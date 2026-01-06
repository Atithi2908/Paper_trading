import { useState, useEffect } from 'react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
} 

interface ChartDataPoint {
  time: string;
  value: number;
}

export default function TradingLanding() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [visibleElements, setVisibleElements] = useState<number[]>([]);
  const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);
  
  // Data kept mostly the same for functionality, but you can swap symbols here
  const stocks: Stock[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 42150.20, change: 1250.50, percent: 2.95 },
    { symbol: 'ETH', name: 'Ethereum', price: 2250.80, change: 45.20, percent: 1.85 },
    { symbol: 'SOL', name: 'Solana', price: 98.45, change: -2.30, percent: -2.15 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, percent: 1.33 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.45, percent: 2.58 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.68, change: -5.12, percent: -2.07 },
  ];

  const chartData: ChartDataPoint[] = [
    { time: '09:00', value: 420 },
    { time: '10:00', value: 435 },
    { time: '11:00', value: 428 },
    { time: '12:00', value: 445 },
    { time: '13:00', value: 438 },
    { time: '14:00', value: 455 },
    { time: '15:00', value: 470 },
    { time: '16:00', value: 465 },
  ];

  useEffect(() => {
    const stockInterval = setInterval(() => {
      setCurrentStockIndex((prev) => (prev + 1) % stocks.length);
    }, 3000);

    return () => clearInterval(stockInterval);
  }, [stocks.length]);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrollY(window.scrollY);
      
      const elements = document.querySelectorAll('.scroll-fade');
      const newVisible: number[] = [];
      
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
          newVisible.push(index);
        }
      });
      
      setVisibleElements(newVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStock = stocks[currentStockIndex];
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-zinc-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: scale(0.8) rotateY(90deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .scroll-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .scroll-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .float-slow {
          animation: float 8s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse 3s ease-in-out infinite;
        }

        .rotate-in {
          animation: rotateIn 0.6s ease-out forwards;
        }
        
        .hover-lift {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(95, 220, 198, 0.15);
        }
        
        .btn-glow {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-glow:hover {
          box-shadow: 0 0 40px rgba(95, 220, 198, 0.5);
          transform: scale(1.05);
        }
        
        .btn-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .btn-glow:hover::before {
          left: 100%;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #5FDCC6 0%, #A8E6CF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .shimmer-border {
          position: relative;
          background: linear-gradient(90deg, transparent, rgba(95, 220, 198, 0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-10px) rotate(-1deg);
          box-shadow: 0 30px 60px rgba(95, 220, 198, 0.2);
        }

        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s ease-out forwards;
        }
      `}</style>
      
      {/* NAVIGATION */}
      <nav className="px-8 py-6 flex items-center justify-between border-b border-gray-800 backdrop-blur-sm bg-zinc-900/50 sticky top-0 z-50 fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center hover:rotate-12 transition-transform">
            <svg className="w-6 h-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">QuantEx</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">Exchange</a>
          <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">Derivatives</a>
          <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110">Learn</a>
          <button className="px-5 py-2 border border-gray-700 hover:border-teal-400 text-white rounded-lg transition-all hover:scale-105">
            Log In
          </button>
          <button className="px-5 py-2 bg-teal-400 hover:bg-teal-500 text-zinc-900 font-semibold rounded-lg transition-all hover:scale-105">
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="px-8 py-20 max-w-7xl mx-auto relative">
        <div 
          className="absolute top-20 right-10 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl opacity-10 pulse-glow"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute bottom-40 left-10 w-80 h-80 bg-emerald-400 rounded-full filter blur-3xl opacity-10 pulse-glow"
          style={{ transform: `translateY(${scrollY * -0.2}px)`, animationDelay: '1.5s' }}
        ></div>

        <div className="text-center mb-24 relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-zinc-800 border border-gray-800 rounded-full text-sm text-gray-400 fade-in-up shimmer-border">
            Join the fastest growing trading network
          </div>
          <h1 className="text-7xl font-bold text-white mb-6 fade-in-up delay-100">
            Master the Markets
            <br />
            <span className="gradient-text">With Precision</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto fade-in-up delay-200">
            Leverage AI-driven insights and institutional-grade tools to stay ahead.
            Trade crypto, forex, and equities on one unified platform.
          </p>
          <div className="flex flex-col items-center gap-4 fade-in-up delay-300">
            <button className="px-8 py-4 bg-teal-400 hover:bg-teal-500 text-zinc-900 text-lg font-bold rounded-lg btn-glow flex items-center gap-2">
              Launch Terminal
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="text-sm text-gray-500">Sign up in seconds • KYC Verified</p>
          </div>
        </div>

        {/* LIVE TICKER */}
        <div className="mb-16 fade-in-up delay-400">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl border border-gray-800 p-8 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="rotate-in">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-white">{currentStock.symbol}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentStock.change > 0 ? 'bg-teal-400/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                    {currentStock.change > 0 ? '↑' : '↓'} {Math.abs(currentStock.percent)}%
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{currentStock.name}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-white">${currentStock.price.toLocaleString()}</span>
                  <span className={`text-lg font-semibold ${currentStock.change > 0 ? 'text-teal-400' : 'text-red-400'}`}>
                    {currentStock.change > 0 ? '+' : ''}{currentStock.change}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {stocks.map((stock, idx) => (
                  <div 
                    key={stock.symbol}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentStockIndex ? 'bg-teal-400 w-8' : 'bg-gray-700'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className={`scroll-fade ${visibleElements.includes(0) ? 'visible' : ''} mb-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-gray-800 p-10`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Portfolio Performance</h3>
              <p className="text-gray-400">Track your asset growth in real-time</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-teal-400/10 text-teal-400 rounded-lg font-semibold">24H</button>
              <button className="px-4 py-2 text-gray-400 hover:text-white rounded-lg">7D</button>
              <button className="px-4 py-2 text-gray-400 hover:text-white rounded-lg">30D</button>
              <button className="px-4 py-2 text-gray-400 hover:text-white rounded-lg">ALL</button>
            </div>
          </div>
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5FDCC6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5FDCC6" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#2a2a2a" strokeWidth="1" />
              ))}
              
              <path
                d={`M 0 200 ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800;
                  const y = 200 - ((d.value - minValue) / (maxValue - minValue)) * 180;
                  return `L ${x} ${y}`;
                }).join(' ')} L 800 200 Z`}
                fill="url(#chartGradient)"
              />
              
              <path
                className="chart-line"
                d={`M ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800;
                  const y = 200 - ((d.value - minValue) / (maxValue - minValue)) * 180;
                  return `${x} ${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#5FDCC6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {chartData.map((d, i) => {
                const x = (i / (chartData.length - 1)) * 800;
                const y = 200 - ((d.value - minValue) / (maxValue - minValue)) * 180;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#5FDCC6"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
              {chartData.map((d) => (
                <span key={d.time}>{d.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className={`scroll-fade ${visibleElements.includes(1) ? 'visible' : ''} bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-2xl border border-gray-800 card-hover`}>
            <div className="text-teal-400 text-5xl font-bold mb-2">99.9%</div>
            <h3 className="text-xl font-bold text-white mb-2">Uptime Guarantee</h3>
            <p className="text-gray-500">
              Reliable infrastructure that never sleeps, just like the markets
            </p>
          </div>

          <div className={`scroll-fade ${visibleElements.includes(2) ? 'visible' : ''} bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-2xl border border-gray-800 card-hover`} style={{transitionDelay: '0.1s'}}>
            <div className="text-teal-400 text-5xl font-bold mb-2">500+</div>
            <h3 className="text-xl font-bold text-white mb-2">Global Assets</h3>
            <p className="text-gray-500">
              Diverse portfolio options ranging from Crypto to Indices
            </p>
          </div>

          <div className={`scroll-fade ${visibleElements.includes(3) ? 'visible' : ''} bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-2xl border border-gray-800 card-hover`} style={{transitionDelay: '0.2s'}}>
            <div className="text-teal-400 text-5xl font-bold mb-2">10x</div>
            <h3 className="text-xl font-bold text-white mb-2">Leverage</h3>
            <p className="text-gray-500">
              Maximize your potential with competitive margin rates
            </p>
          </div>
        </div>

        {/* DETAILED FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className={`scroll-fade ${visibleElements.includes(4) ? 'visible' : ''} bg-zinc-800 p-10 rounded-3xl border border-gray-800 hover-lift`}>
            <div className="w-12 h-12 bg-teal-400/10 rounded-xl flex items-center justify-center mb-6 float-slow">
              <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Smart Order Routing</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our algorithm automatically finds the best prices across multiple liquidity providers, ensuring you get the best entry and exit points every time.
            </p>
          </div>

          <div className={`scroll-fade ${visibleElements.includes(5) ? 'visible' : ''} bg-zinc-800 p-10 rounded-3xl border border-gray-800 hover-lift`} style={{transitionDelay: '0.15s'}}>
            <div className="w-12 h-12 bg-teal-400/10 rounded-xl flex items-center justify-center mb-6 float-slow" style={{animationDelay: '1s'}}>
              <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.567-4.166" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Biometric Verification</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Secure your account with next-gen FaceID and fingerprint integration. Withdrawals are locked to your unique biological signature.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className={`scroll-fade ${visibleElements.includes(6) ? 'visible' : ''} relative bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-3xl p-16 text-center border border-gray-800 overflow-hidden`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl opacity-5 float-slow"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400 rounded-full filter blur-3xl opacity-5 float-slow" style={{animationDelay: '2s'}}></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-4">The Future is Open</h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Join the revolution of decentralized finance with the security of a centralized exchange.
            </p>
            <button className="px-12 py-5 bg-teal-400 hover:bg-teal-500 text-zinc-900 text-xl font-bold rounded-lg btn-glow flex items-center gap-2 mx-auto">
              Create Free Account
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <p className="text-sm text-gray-500 mt-4">Zero fees for the first 30 days</p>
          </div>
        </div>
      </main>

      <div className="absolute top-40 left-20 w-2 h-2 bg-teal-400 rounded-full opacity-60 pulse-glow"></div>
      <div className="absolute top-60 right-40 w-2 h-2 bg-teal-400 rounded-full opacity-40 pulse-glow" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-teal-400 rounded-full opacity-50 pulse-glow" style={{animationDelay: '2s'}}></div>
    </div>
  );
}