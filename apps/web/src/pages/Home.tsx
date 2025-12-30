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
      const res = await axios.get( "http://localhost:3000/post/fetchPost", {
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-cyan-400" size={28} />
            <span className="text-xl font-bold text-white">TRADEINCASE</span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stocks, crypto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-4 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <StockSearch query={searchQuery}/>
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 cursor-pointer transition">
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative text-slate-300 hover:text-cyan-400 cursor-pointer transition">
              <MessageCircle size={24} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            <button className="relative text-slate-300 hover:text-cyan-400 cursor-pointer transition">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                7
              </span>
            </button>

        
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 text-white hover:text-cyan-400 cursor-pointer transition">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="font-medium">John</span>
                <ChevronDown size={16} />
              </button>
              <span className="text-green-400 font-bold text-lg">$10,000</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
   
          <div className="col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Create a Post</h2>
              <p className="text-slate-400 text-sm mb-6">
                Share your trade insights or questions with the community.
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 font-medium transition cursor-pointer shadow-lg shadow-cyan-500/30"
               onClick={() => setisPostOpen(true)}
              >
                Make a Post
              </button>
            </div>
          </div>
{isPostOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-8 rounded-xl w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3">Create Post</h2>

      <textarea
        className="w-full border rounded-lg p-2 mb-4"
        placeholder="What's on your mind?"
        value={formData.content}
        onChange={(e) =>
          setFormData({ ...formData, content: e.target.value })
        }
      />

      {/* Tags Filter */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2 text-gray-700">Select Tags:</p>
        <div className="flex flex-wrap gap-2">
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
                <span className="text-sm">{tag}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setisPostOpen(false)}
          disabled={Loading}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {Loading && <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
          {Loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  </div>
)}

       
          <div className="col-span-6">
            <div className="space-y-4">
              {Loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                  <p className="text-slate-400 text-center">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyan-500 transition cursor-pointer"
                  >
                    <h3 className="text-white font-bold mb-2">{post.user.name}</h3>
                    <p className="text-slate-300">{post.content}</p>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
                  <p className="text-slate-400">No posts yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="col-span-3 space-y-6">
            <div 
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyan-500 transition cursor-pointer"
              onClick={() => setShowPortfolio(true)}
            >
              <h2 className="text-xl font-bold text-white mb-4">Today's Portfolio</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Balance:</span>
                  <span className="text-white font-bold">$12,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Profit/Loss:</span>
                  <span className="text-green-400 font-bold">+$320</span>
                </div>
              </div>
              <p className="text-cyan-400 text-sm mt-4 text-center">Click to view full portfolio →</p>
            </div>

    
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Top Trending Today</h2>
              <div className="space-y-4">
                {trendingStocks.map((stock, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-300 font-medium block">{stock.symbol}</span>
                      <span className="text-slate-500 text-sm">${stock.price}</span>
                    </div>
                    <span className={`font-bold ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-400 transition cursor-pointer">
        <MessageCircle className="text-white" size={24} />
      </button>


      {showPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">My Portfolio</h2>
                <p className="text-slate-400 mt-1">Complete overview of your holdings</p>
              </div>
              <button 
                onClick={() => setShowPortfolio(false)}
                className="text-slate-400 hover:text-white text-3xl transition"
              >
                ×
              </button>
            </div>

            {/* Portfolio Summary */}
            <div className="p-6 border-b border-slate-800">
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Total Value</p>
                  <p className="text-2xl font-bold text-white">$29,100.75</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Cash Balance</p>
                  <p className="text-2xl font-bold text-white">$12,500.00</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Total P/L</p>
                  <p className="text-2xl font-bold text-green-400">+$1,820.75</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Return</p>
                  <p className="text-2xl font-bold text-green-400">+6.68%</p>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Holdings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Shares</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Avg Price</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Current Price</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Total Value</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">P/L</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioHoldings.map((holding, index) => {
                      const profitLoss = calculateProfitLoss(holding);
                      const profitLossPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice * 100).toFixed(2);
                      return (
                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800 transition">
                          <td className="py-4 px-4">
                            <span className="text-white font-bold">{holding.symbol}</span>
                          </td>
                          <td className="py-4 px-4 text-right text-slate-300">{holding.shares}</td>
                          <td className="py-4 px-4 text-right text-slate-300">${holding.avgPrice.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right text-white font-medium">${holding.currentPrice.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right text-white font-bold">${holding.totalValue.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right">
                            <div className={profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                              <div className="font-bold">{profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}</div>
                              <div className="text-sm">({profitLoss >= 0 ? '+' : ''}{profitLossPercent}%)</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => handleBuyStock(holding.symbol)}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg hover:from-cyan-400 hover:to-blue-400 transition"
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