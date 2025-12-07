import WebSocket from "ws";
import { finnhubSocket } from "./finnhubClient";


const clientSubscriptions = new Map<WebSocket, Set<string>>();
const symbolSubscribers = new Map<string, Set<WebSocket>>();
const finnhubSubscriptions = new Set<string>();

export function setupClientConnection(ws: WebSocket) {
  clientSubscriptions.set(ws, new Set());
  console.log("🧍 Client connected. Total:", clientSubscriptions.size);

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      
      if (data.type === "subscribe" && data.symbol) {
        const symbol = String(data.symbol).toUpperCase();
        subscribeClientToSymbol(ws, symbol);
        return;
      }

   
      if (data.type === "unsubscribe" && data.symbol) {
        const symbol = String(data.symbol).toUpperCase();
        unsubscribeClientFromSymbol(ws, symbol);
        return;
      }

      
    } catch (e) {
      console.error("Invalid message from client:", msg);
    }
  });

  ws.on("close", () => {

    const subs = clientSubscriptions.get(ws);
    if (subs) {
      for (const symbol of subs) {
        const set = symbolSubscribers.get(symbol);
        if (set) {
          set.delete(ws);
          if (set.size === 0) {
            symbolSubscribers.delete(symbol);
           
            if (finnhubSubscriptions.has(symbol)) {
              finnhubSocket.send(JSON.stringify({ type: "unsubscribe", symbol }));
              finnhubSubscriptions.delete(symbol);
            }
          }
        }
      }
    }

    clientSubscriptions.delete(ws);
    console.log("👋 Client disconnected. Total:", clientSubscriptions.size);
  });
}

function subscribeClientToSymbol(ws: WebSocket, symbol: string) {
 
  let clientSet = clientSubscriptions.get(ws);
  if (!clientSet) {
    clientSet = new Set();
    clientSubscriptions.set(ws, clientSet);
  }
  if (clientSet.has(symbol)) return; // already subscribed

  clientSet.add(symbol);

  // add client to symbolSubscribers map
  let subs = symbolSubscribers.get(symbol);
  if (!subs) {
    subs = new Set();
    symbolSubscribers.set(symbol, subs);
  }
  subs.add(ws);

  // ask finnhub to subscribe only once per symbol
  if (!finnhubSubscriptions.has(symbol)) {
    finnhubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
    finnhubSubscriptions.add(symbol);
  }

  console.log(`🔔 Client subscribed to ${symbol} (clients for ${symbol}: ${subs.size})`);
}

function unsubscribeClientFromSymbol(ws: WebSocket, symbol: string) {
  const clientSet = clientSubscriptions.get(ws);
  if (clientSet) {
    clientSet.delete(symbol);
  }

  const subs = symbolSubscribers.get(symbol);
  if (subs) {
    subs.delete(ws);
    if (subs.size === 0) {
      // no more local subscribers, unsubscribe from finnhub
      symbolSubscribers.delete(symbol);
      if (finnhubSubscriptions.has(symbol)) {
        finnhubSocket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        finnhubSubscriptions.delete(symbol);
      }
    }
  }

  console.log(`🔕 Client unsubscribed from ${symbol}`);
}

/**
 * Handle messages from Finnhub: parse and forward only to clients
 * that subscribed to the symbol(s) in the message.
 */
finnhubSocket.on("message", (msg) => {
  let parsed: any;
  try {
    parsed = JSON.parse(msg.toString());
  } catch (e) {
    // If it's not JSON, ignore or broadcast if desired (but safer to ignore)
    console.warn("Received non-JSON message from Finnhub:", msg.toString());
    return;
  }

  // Example Finnhub trade payload:
  // { "type": "trade", "data": [ { "s": "AAPL", "p": 183.45, "t": 1731392200000, ... }, ... ] }
  if (parsed.type === "trade" && Array.isArray(parsed.data)) {
    // group ticks by symbol to minimize sends
    const bySymbol = new Map<string, any[]>();
    for (const tick of parsed.data) {
      // common keys used by exchanges/APIs: 's' or 'symbol'
      const symbol = (tick.s || tick.symbol || "").toString().toUpperCase();
      if (!symbol) continue;
      if (!bySymbol.has(symbol)) bySymbol.set(symbol, []);
      bySymbol.get(symbol)!.push(tick);
    }

    // send only to clients subscribed to each symbol
    for (const [symbol, ticks] of bySymbol.entries()) {
      const subs = symbolSubscribers.get(symbol);
      if (!subs || subs.size === 0) continue;

      const payload = JSON.stringify({ type: "trade", symbol, data: ticks });

      for (const client of subs) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    }
    return;
  }

  // Handle other Finnhub message types (e.g., 'tick', 'bbo', etc.) similarly if needed:
  // Try to extract symbol(s) and forward only to relevant subscribers.
});
