import { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface QuickTradeProps {
  symbol: string;
  livePrice?: number | null;
}

export function QuickTradePanel({ symbol, livePrice }: QuickTradeProps) {
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop-loss" | "stop-limit">("market");
  const [qty, setQty] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
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
        setError("No token found — please log in again.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${baseUrl}/trade/order`,
        {
          symbol,
          orderType,
          qty,
          limitPrice: limitPrice ? Number(limitPrice) : null,
          stopPrice: stopPrice ? Number(stopPrice) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Order placed successfully!");
      setLimitPrice("");
      setStopPrice("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Order failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-md mt-4">

      <h3 className="text-lg font-semibold mb-3">Quick Trade</h3>

      {/* Order Type */}
      <label className="block mb-2">Order Type</label>
      <select
        value={orderType}
        onChange={(e) => setOrderType(e.target.value as any)}
        className="w-full p-2 rounded bg-gray-800 mb-3"
      >
        <option value="market">Market</option>
        <option value="limit">Limit</option>
        <option value="stop-loss">Stop Loss</option>
        <option value="stop-limit">Stop Limit</option>
      </select>

      {/* Quantity */}
      <label className="block mb-2">Quantity</label>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="w-full p-2 rounded bg-gray-800 mb-3"
      />

      {/* Limit Price */}
      {orderType !== "market" && (
        <>
          <label className="block mb-2">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 mb-3"
          />
        </>
      )}

      {/* Stop Price */}
      {(orderType === "stop-loss" || orderType === "stop-limit") && (
        <>
          <label className="block mb-2">Stop Price</label>
          <input
            type="number"
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 mb-3"
          />
        </>
      )}

      {/* Live Price Display */}
      {livePrice && (
        <div className="mt-2 text-sm text-teal-400">
          Live Price: {livePrice.toFixed(2)}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={submitOrder}
        disabled={loading}
        className="mt-3 w-full py-2 bg-teal-500 rounded hover:bg-teal-600 transition"
      >
        {loading ? "Placing Order..." : "Submit Order"}
      </button>

      {/* Success / Error */}
      {success && <p className="text-green-400 mt-2">{success}</p>}
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
export default QuickTradePanel;