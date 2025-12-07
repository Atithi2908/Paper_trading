import WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const FINNHUB_KEY = process.env.FINNHUB_API_KEY!;
const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_KEY}`;

export const finnhubSocket = new WebSocket(FINNHUB_WS_URL);

finnhubSocket.on("open", () => {
  console.log("✅ Connected to Finnhub WebSocket");
});

finnhubSocket.on("close", () => {
  console.log("❌ Finnhub WebSocket disconnected");
});

finnhubSocket.on("error", (err) => {
  console.error("⚠️ Finnhub WebSocket error:", err);
});
