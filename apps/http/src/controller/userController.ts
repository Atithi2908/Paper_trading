import { Request,Response } from "express";
import { prisma } from "../lib/prisma";

export const getUserPortfolio = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const [wallet, positions] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId },
        select: {
          balance: true,
          updatedAt: true,
        },
      }),

      prisma.position.findMany({
        where: { userId },
        include: {
          stock: {
            select: {
              id: true,
              symbol: true,
              name: true,
              exchange: true,
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      wallet,
      positions: positions.map((p) => ({
        stockId: p.stockId,
        symbol: p.stock.symbol,
        name: p.stock.name,
        exchange: p.stock.exchange,
        quantity: p.quantity,
        avgBuyPrice: p.avgBuyPrice,
        investedAmount: p.quantity * p.avgBuyPrice,
      })),
    });
  } catch (err) {
    console.error("getPortfolioController error:", err);
    return res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};


export const getUserOrderHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        stock: {
          select: {
            symbol: true,
            name: true,
          },
        },
        trades: {
          select: {
            id: true,
            quantity: true,
            price: true,
            amount: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = orders.map((order) => {
      const filledQuantity = order.trades.reduce(
        (sum, t) => sum + t.quantity,
        0
      );

      const totalAmount = order.trades.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      const avgExecutedPrice =
        filledQuantity > 0 ? totalAmount / filledQuantity : null;

      return {
        orderId: order.id,
        stockSymbol: order.stock.symbol,
        stockName: order.stock.name,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        filledQuantity,
        limitPrice: order.limitPrice,
        status: order.status,
        avgExecutedPrice,
        createdAt: order.createdAt,
        trades: order.trades,
      };
    });

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("getOrderHistoryController error:", err);
    return res.status(500).json({ message: "Failed to fetch order history" });
  }
};


export const getUserTradeHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const trades = await prisma.trade.findMany({
      where: { userId },
      include: {
        stock: {
          select: {
            symbol: true,
            name: true,
          },
        },
        order: {
          select: {
            side: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(
      trades.map((trade) => ({
        tradeId: trade.id,
        stockSymbol: trade.stock.symbol,
        stockName: trade.stock.name,
        side: trade.side,
        orderType: trade.order.type,
        quantity: trade.quantity,
        price: trade.price,
        amount: trade.amount,
        executedAt: trade.createdAt,
      }))
    );
  } catch (err) {
    console.error("getTradeHistoryController error:", err);
    return res.status(500).json({ message: "Failed to fetch trade history" });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const userId = req.user.userId;

    const [user, wallet] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.wallet.findUnique({
        where: { userId },
        select: {
          balance: true,
        },
      }),
    ]);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.name,
      },
      wallet: wallet ?? {
        balance: 0,
        currency: "INR",
      },
    });
  } catch (error) {
    console.error("getDetails error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
