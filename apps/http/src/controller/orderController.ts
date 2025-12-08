import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { getLivePrice } from "../utils/pricefeed";
import redisClient from "../redis";

const prisma = new PrismaClient();

export const placeOrder = async (req: Request, res: Response) => {
  console.log("Order request came");

  const { userId, stockId, side, type, quantity, limitPrice } = req.body;

  try {

    if (type === "LIMIT") {
      const limitOrder = await placeLimitOrder({ userId, stockId, side, quantity, limitPrice });
      return res.status(200).json(limitOrder);
    }

    const order = await prisma.order.create({
      data: { userId, stockId, side, type, quantity, limitPrice }
    });

    if (type === "MARKET") {
      const trade = await executeMarketOrder(order);
      return res.status(200).json({ order, trade });
    }

    return res.status(200).json(order);

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Order failed", error: e });
  }
};

export const executeMarketOrder = async (order: any) => {

  const stock = await prisma.stock.findUnique({ where: { id: order.stockId }});
  if (!stock) throw new Error("Stock not found");

  const price = await getLivePrice(stock.symbol);
  const amount = price * order.quantity;

  const wallet = await prisma.wallet.findUnique({
    where: { userId: order.userId }
  });
  if (!wallet) throw new Error("Wallet not found");

  if (order.side === "BUY" && wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  const trade = await prisma.trade.create({
    data: {
      orderId: order.id,
      userId: order.userId,
      stockId: order.stockId,
      side: order.side,
      quantity: order.quantity,
      price,
      amount
    }
  });

  if (order.side === "BUY") {
    await prisma.wallet.update({
      where: { userId: order.userId },
      data: { balance: wallet.balance - amount }
    });
  } else {
    await prisma.wallet.update({
      where: { userId: order.userId },
      data: { balance: wallet.balance + amount }
    });
  }

  await updatePosition(order, trade);

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "EXECUTED" }
  });

  return trade;
};

export const updatePosition = async (order: any, trade: any) => {
  const pos = await prisma.position.findFirst({
    where: { userId: order.userId, stockId: order.stockId }
  });

  if (order.side === "BUY") {
    if (!pos) {
      return await prisma.position.create({
        data: {
          userId: order.userId,
          stockId: order.stockId,
          quantity: trade.quantity,
          avgBuyPrice: trade.price
        }
      });
    }

    const newQty = pos.quantity + trade.quantity;
    const newAvg =
      (pos.avgBuyPrice * pos.quantity + trade.price * trade.quantity) /
      newQty;

    return await prisma.position.update({
      where: { id: pos.id },
      data: {
        quantity: newQty,
        avgBuyPrice: newAvg
      }
    });
  }

  if (!pos || pos.quantity < trade.quantity) {
    throw new Error("Not enough quantity to sell");
  }

  return await prisma.position.update({
    where: { id: pos.id },
    data: {
      quantity: pos.quantity - trade.quantity
    }
  });
};

export const placeLimitOrder = async ({ userId, stockId, side, quantity, limitPrice }: any) => {
  const stock = await prisma.stock.findUnique({ where: { id: stockId }});
  if (!stock) throw new Error("Stock not found");

  if (side === "BUY") {
    const wallet = await prisma.wallet.findUnique({ where: { userId }});
    const required = limitPrice * quantity;

    if (!wallet || wallet.balance < required) {
      throw new Error("Not enough balance to place buy limit order");
    }

    await prisma.wallet.update({
      where: { userId },
      data: { balance: wallet.balance - required }
    });
  }

  if (side === "SELL") {
    const pos = await prisma.position.findFirst({
      where: { userId, stockId }
    });

    if (!pos || pos.quantity < quantity) {
      throw new Error("Not enough shares to place sell limit order");
    }

    await prisma.position.update({
      where: { id: pos.id },
      data: { quantity: pos.quantity - quantity }
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      stockId,
      side,
      type: "LIMIT",
      quantity,
      limitPrice,
      status: "PENDING"
    }
  });

  await registerSymbolForPriceFeed(stock.symbol);

  return order;
};

const registerSymbolForPriceFeed = async (symbol: string) => {
   const upper = symbol.toUpperCase();
  await redisClient.sadd("subscribed:stocks",upper);
};

export const cancelOrder = async (req: Request, res: Response) => {
  console.log("Cancel order request");

  const { id } = req.params;

  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED" }
    });

    res.status(200).json(order);

  } catch (e) {
    res.status(400).json({ message: "Cancel failed", error: e });
  }
};
