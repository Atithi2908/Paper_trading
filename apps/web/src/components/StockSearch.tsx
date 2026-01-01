import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Stock {
  symbol: string;
  description: string;
}

interface StockSearchProps {
  query: string;
}

export const StockSearch: React.FC<StockSearchProps> = ({ query }) => {
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchResults(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stock/search`, {
        params: { q: searchTerm },
      });

      setResults(res.data.result || []);
    } catch (err) {
      console.error("Error fetching stocks", err);
    }
    setLoading(false);
  };

  if (!query) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-y-auto z-50">
      {loading && (
        <p className="text-gray-400 text-center p-2 text-xs sm:text-sm">Loading...</p>
      )}

      {!loading && results.length === 0 && (
        <p className="text-gray-400 text-center p-2 text-xs sm:text-sm">No results found.</p>
      )}

      {!loading &&
        results.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
            className="p-2 sm:p-3 hover:bg-gray-700 cursor-pointer transition"
          >
            <p className="text-white font-medium text-sm sm:text-base">{stock.symbol}</p>
            <p className="text-gray-400 text-xs sm:text-sm truncate">{stock.description}</p>
          </div>
        ))}
    </div>
  );
};
