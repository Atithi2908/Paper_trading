import { useEffect, useState } from "react";
import axios from "axios";
type Wallet = {
  balance: number;
  updatedAt: string;
};

type Position = {
  stockId: number;
  symbol: string;
  name: string;
  exchange: string | null;
  quantity: number;
  avgBuyPrice: number;
  investedAmount: number;
};

type PortfolioResponse = {
  wallet: Wallet | null;
  positions: Position[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("Token");
        

        const res = await axios.get(`${API_BASE}/user/portfolio`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res) {
          throw new Error("Failed to fetch portfolio");
        }

        const data = await res.data;
        setPortfolio(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-slate-400 text-base">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-red-500/50 rounded-xl p-8 max-w-md">
          <p className="text-red-400 text-center text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const totalInvested = portfolio.positions.reduce((sum, p) => sum + p.investedAmount, 0);

  return (
    <div className="min-h-screen bg-[#0d1117] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            My Portfolio
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Track your investments and wallet balance</p>
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">₹</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Wallet Balance</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                ₹{portfolio.wallet?.balance.toFixed(2)}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Last updated: {new Date(portfolio.wallet?.updatedAt || "").toLocaleString()}
            </p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] border border-gray-700 rounded-xl p-5 shadow-lg">
            <p className="text-slate-400 text-sm mb-2">Total Positions</p>
            <p className="text-2xl font-bold text-white">{portfolio.positions.length}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] border border-gray-700 rounded-xl p-5 shadow-lg">
            <p className="text-slate-400 text-sm mb-2">Total Invested</p>
            <p className="text-2xl font-bold text-cyan-400">₹{totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] border border-gray-700 rounded-xl p-5 shadow-lg">
            <p className="text-slate-400 text-sm mb-2">Available Balance</p>
            <p className="text-2xl font-bold text-green-400">₹{portfolio.wallet?.balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Positions */}
        <div className="bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] border border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Your Positions</h2>

          {portfolio.positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-slate-500 text-2xl">📊</span>
              </div>
              <p className="text-slate-400 text-center">No positions yet</p>
              <p className="text-slate-500 text-sm text-center mt-2">Start trading to see your holdings here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-wider">Stock</th>
                    <th className="text-center py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-wider">Quantity</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-wider">Avg Buy</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-wider">Invested</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.positions.map((p, idx) => (
                    <tr 
                      key={p.stockId} 
                      className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                        idx === portfolio.positions.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-2 sm:px-4">
                        <div className="font-bold text-white text-sm sm:text-base">{p.symbol}</div>
                        <div className="text-xs sm:text-sm text-slate-400 mt-1">{p.name}</div>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-xs sm:text-sm font-semibold">
                          {p.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right text-white font-medium text-sm sm:text-base">
                        ₹{p.avgBuyPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right text-cyan-400 font-bold text-sm sm:text-base">
                        ₹{p.investedAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
