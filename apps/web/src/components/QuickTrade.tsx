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
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md w-full max-w-md">

      <h3 className="text-lg font-semibold mb-3">
        Trade {symbol}
      </h3>

      {/* BUY / SELL Toggle */}
      <div className="flex mb-4 rounded overflow-hidden">
        <button
          onClick={() => setSide("BUY")}
          className={`w-1/2 py-2 font-semibold ${
            side === "BUY"
              ? "bg-green-500 text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide("SELL")}
          className={`w-1/2 py-2 font-semibold ${
            side === "SELL"
              ? "bg-red-500 text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          SELL
        </button>
      </div>

      {/* MARKET / LIMIT Toggle */}
      <div className="flex mb-4 rounded overflow-hidden">
        <button
          onClick={() => setType("MARKET")}
          className={`w-1/2 py-2 ${
            type === "MARKET"
              ? "bg-blue-500 text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          MARKET
        </button>
        <button
          onClick={() => setType("LIMIT")}
          className={`w-1/2 py-2 ${
            type === "LIMIT"
              ? "bg-blue-500 text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          LIMIT
        </button>
      </div>

      {/* Quantity */}
      <label className="block mb-1 text-sm">Quantity</label>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full p-2 mb-3 rounded bg-gray-800"
      />

      {/* Limit Price */}
      {type === "LIMIT" && (
        <>
          <label className="block mb-1 text-sm">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800"
          />
        </>
      )}

      {/* Live Price */}
      {livePrice && (
        <div className="text-sm text-teal-400 mb-3">
          Live Price: {livePrice.toFixed(2)}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submitOrder}
        disabled={loading}
        className="w-full py-2 rounded font-semibold bg-teal-500 hover:bg-teal-600 transition"
      >
        {loading ? "Placing Order..." : `${side} ${type}`}
      </button>

      {/* Messages */}
      {success && <p className="text-green-400 mt-3">{success}</p>}
      {error && <p className="text-red-400 mt-3">{error}</p>}
    </div>
  );
}

export default QuickTradePanel;
