import { useState,useEffect } from 'react';
import { Search, MessageCircle, Bell, User, ChevronDown, TrendingUp } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";
import { StockSearch } from '../components/StockSearch';

export interface User {
  id: number;
  name: string;
}
export interface Post {
  id: number; 
  user: User,
  userId: number;
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

export default function TradingDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);
 const [posts, setPosts] = useState<Post[]>([]);
 const[Loading,setLoading] = useState(false);
  const [isPostOpen, setisPostOpen] = useState(false);
const [formData, setFormData] = useState<{ content: string; tags: string[] }>({
  content: '',
  tags: [],
});

 useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token"); 
      console.log("token is");
      console.log(token);
      console.log(`${BASE_URL}/post/fetchPost`);
      const res = await axios.get( `${BASE_URL}/post/fetchPost`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false); 
    }
  };

  fetchPosts();
}, []);

 const createPost = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem("Token"); 
      console.log("token is");
      console.log(token);
      console.log(`${BASE_URL}/post/create`);
      await axios.post( `${BASE_URL}/post/create`, 
        {
         content: formData.content,
          tags:formData.tags
        },
        {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } 
     catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false); // stop loading
      
    }
  };

  const trendingStocks = [
    { symbol: 'TSLA', change: '+5.2%', positive: true, price: 245.67 },
    { symbol: 'BTC', change: '+3.8%', positive: true, price: 43250.50 },
    { symbol: 'AAPL', change: '+2.1%', positive: true, price: 178.32 }
  ];

  const portfolioHoldings = [
    { symbol: 'AAPL', shares: 50, avgPrice: 170.50, currentPrice: 178.32, totalValue: 8916.00 },
    { symbol: 'TSLA', shares: 25, avgPrice: 235.00, currentPrice: 245.67, totalValue: 6141.75 },
    { symbol: 'MSFT', shares: 30, avgPrice: 380.00, currentPrice: 395.20, totalValue: 11856.00 },
    { symbol: 'GOOGL', shares: 15, avgPrice: 140.50, currentPrice: 145.80, totalValue: 2187.00 }
  ];

  const handleBuyStock = (symbol:any) => {
    alert(`Buy ${symbol} - This would open a trade modal`);
  };

  const calculateProfitLoss = (holding:any) => {
    const profitLoss = (holding.currentPrice - holding.avgPrice) * holding.shares;
    return profitLoss;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <TrendingUp className="text-cyan-400" size={24} />
              <span className="text-base sm:text-lg md:text-xl font-bold text-white">Paper Trades</span>
            </div>

            <div className="flex-1 max-w-xl mx-2 sm:mx-4 md:mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-3 pr-10 text-sm md:text-base bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <StockSearch query={searchQuery}/>
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 cursor-pointer transition">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6">
              <button className="hidden sm:block relative text-slate-300 hover:text-cyan-400 cursor-pointer transition">
                <MessageCircle size={20} className="md:w-6 md:h-6" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                  3
                </span>
              </button>

              <button className="hidden sm:block relative text-slate-300 hover:text-cyan-400 cursor-pointer transition">
                <Bell size={20} className="md:w-6 md:h-6" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                  7
                </span>
              </button>

        
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                <button className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-cyan-400 cursor-pointer transition">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="hidden sm:inline font-medium text-sm md:text-base">John</span>
                  <ChevronDown size={14} className="hidden sm:block md:w-4 md:h-4" />
                </button>
                <span className="text-green-400 font-bold text-sm md:text-lg">$10k</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
   
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Create a Post</h2>
              <p className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6">
                Share your trade insights or questions with the community.
              </p>
              <button className="w-full py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm md:text-base rounded-lg hover:from-cyan-400 hover:to-blue-400 font-medium transition cursor-pointer shadow-lg shadow-cyan-500/30"
               onClick={() => setisPostOpen(true)}
              >
                Make a Post
              </button>
            </div>
          </div>
{isPostOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-3">Create Post</h2>

      <textarea
        className="w-full border rounded-lg p-2 mb-4 text-sm md:text-base min-h-[100px]"
        placeholder="What's on your mind?"
        value={formData.content}
        onChange={(e) =>
          setFormData({ ...formData, content: e.target.value })
        }
      />

      {/* Tags Filter */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm font-medium mb-2 text-gray-700">Select Tags:</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {["Stocks", "Crypto", "Options", "Trading Tips", "Investing"].map(
            (tag) => (
              <label
                key={tag}
                className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200"
              >
                <input
                  type="checkbox"
                  value={tag}
                  checked={formData.tags?.includes(tag)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      const newTags = checked
                        ? [...(prev.tags || []), tag]
                        : prev.tags?.filter((t) => t !== tag);
                      return { ...prev, tags: newTags };
                    });
                  }}
                  className="accent-sky-600"
                />
                <span className="text-xs sm:text-sm">{tag}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setisPostOpen(false)}
          disabled={Loading}
          className="px-3 sm:px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log("Post content:", formData.content);
            console.log("Selected tags:", formData.tags);
         createPost();
            setisPostOpen(false);
          }}
          disabled={Loading}
          className="px-3 sm:px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
        >
          {Loading && <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
          {Loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  </div>
)}

       
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="space-y-3 md:space-y-4">
              {Loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 md:p-12 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                  <p className="text-slate-400 text-center text-sm md:text-base">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 hover:border-cyan-500 transition cursor-pointer"
                  >
                    <h3 className="text-white font-bold mb-2 text-sm md:text-base">{post.user.name}</h3>
                    <p className="text-slate-300 text-sm md:text-base">{post.content}</p>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 md:p-12 text-center">
                  <p className="text-slate-400 text-sm md:text-base">No posts yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="lg:col-span-3 order-3 space-y-4 md:space-y-6">
            <div 
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 hover:border-cyan-500 transition cursor-pointer"
              onClick={() => setShowPortfolio(true)}
            >
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Today's Portfolio</h2>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm md:text-base">Balance:</span>
                  <span className="text-white font-bold text-sm md:text-base">$12,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm md:text-base">Profit/Loss:</span>
                  <span className="text-green-400 font-bold text-sm md:text-base">+$320</span>
                </div>
              </div>
              <p className="text-cyan-400 text-xs md:text-sm mt-3 md:mt-4 text-center">Click to view full portfolio →</p>
            </div>

    
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Top Trending Today</h2>
              <div className="space-y-3 md:space-y-4">
                {trendingStocks.map((stock, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-300 font-medium block text-sm md:text-base">{stock.symbol}</span>
                      <span className="text-slate-500 text-xs md:text-sm">${stock.price}</span>
                    </div>
                    <span className={`font-bold text-sm md:text-base ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <button className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-400 transition cursor-pointer">
        <MessageCircle className="text-white" size={20} />
      </button>


      {showPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-slate-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 md:p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">My Portfolio</h2>
                <p className="text-slate-400 mt-1 text-xs sm:text-sm md:text-base">Complete overview of your holdings</p>
              </div>
              <button 
                onClick={() => setShowPortfolio(false)}
                className="text-slate-400 hover:text-white text-2xl md:text-3xl transition"
              >
                ×
              </button>
            </div>

            {/* Portfolio Summary */}
            <div className="p-4 md:p-6 border-b border-slate-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                  <p className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Total Value</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">$29,100.75</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                  <p className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Cash Balance</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">$12,500.00</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                  <p className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Total P/L</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">+$1,820.75</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                  <p className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">Return</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">+6.68%</p>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Your Holdings</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">Symbol</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">Shares</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">Avg Price</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">Current</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">Value</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">P/L</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-slate-400 font-medium text-xs md:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioHoldings.map((holding, index) => {
                      const profitLoss = calculateProfitLoss(holding);
                      const profitLossPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice * 100).toFixed(2);
                      return (
                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800 transition">
                          <td className="py-3 md:py-4 px-2 md:px-4">
                            <span className="text-white font-bold text-sm md:text-base">{holding.symbol}</span>
                          </td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-slate-300 text-xs md:text-sm">{holding.shares}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-slate-300 text-xs md:text-sm">${holding.avgPrice.toFixed(2)}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-white font-medium text-xs md:text-sm">${holding.currentPrice.toFixed(2)}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-white font-bold text-xs md:text-sm">${holding.totalValue.toFixed(2)}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                            <div className={profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                              <div className="font-bold text-xs md:text-sm">{profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}</div>
                              <div className="text-[10px] md:text-xs">({profitLoss >= 0 ? '+' : ''}{profitLossPercent}%)</div>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                            <button 
                              onClick={() => handleBuyStock(holding.symbol)}
                              className="px-2 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs md:text-sm rounded-lg hover:from-cyan-400 hover:to-blue-400 transition"
                            >
                              Trade
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}