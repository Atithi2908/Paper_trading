import { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface QuickTradeProps {
  symbol: string;
  livePrice?: number | null;
}

export function QuickTradePanel({ symbol, livePrice }: QuickTradeProps) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${baseUrl}/order/buy`,
        {
          symbol,
          side,
          type,
          quantity,
          limitPrice: type === "LIMIT" ? Number(limitPrice) : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(`${side} order placed successfully`);
      setLimitPrice("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Order failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] text-white rounded-2xl border border-gray-700 shadow-xl w-full max-w-2xl mx-auto">

      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Quick Trade {symbol}
      </h3>

      {/* BUY / SELL Toggle */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <button
          onClick={() => setSide("BUY")}
          className={`py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 ${
            side === "BUY"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide("SELL")}
          className={`py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 ${
            side === "SELL"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
              : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
          }`}
        >
          SELL
        </button>
      </div>

      {/* MARKET / LIMIT Toggle */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <button
          onClick={() => setType("MARKET")}
          className={`py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 ${
            type === "MARKET"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
          }`}
        >
          MARKET
        </button>
        <button
          onClick={() => setType("LIMIT")}
          className={`py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 ${
            type === "LIMIT"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
          }`}
        >
          LIMIT
        </button>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition"
        />
      </div>

      {/* Limit Price */}
      {type === "LIMIT" && (
        <div className="mb-6">
          <label className="block text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition"
            placeholder="Enter limit price"
          />
        </div>
      )}

      {/* Live Price */}
      {livePrice && (
        <div className="p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
          <div className="text-xs sm:text-sm text-green-400 font-semibold uppercase tracking-wide">Live Price</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-400 mt-1">${livePrice.toFixed(2)}</div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submitOrder}
        disabled={loading}
        className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg transition-all duration-300 ${
          side === "BUY"
            ? "bg-gradient-to-r from-green-500 to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:opacity-90"
            : "bg-gradient-to-r from-red-500 to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:opacity-90"
        }`}
      >
        {loading ? "Placing Order..." : `${side} ${type} ${symbol}`}
      </button>

      {/* Messages */}
      {success && (
        <div className="mt-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-xs sm:text-sm font-semibold">{success}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-xs sm:text-sm font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}

export default QuickTradePanel;
