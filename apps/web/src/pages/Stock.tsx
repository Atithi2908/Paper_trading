import { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useParams } from "react-router-dom";
import { QuickTradePanel } from "../components/QuickTrade";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000"; // your WebSocket server URL


type CompanyProfile = {
  ticker?: string;
  name?: string;
  logo?: string;
  currency?: string;
  marketCapitalization?: number;
  weburl?: string;
  country?: string;
  ipo?: string;
  shareOutstanding?: number;
  [k: string]: any;
};

type BackendChartResponse = {
  data?: Array<{
    time?: string;
    date?: string;
    price?: number;
    open?: number;
    high?: number;
    low?: number;
    volume?: number;
  }>;
};

const useCompanyProfile = (symbol?: string) => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!symbol) {
    setProfile(null);
    return;
  }

  setLoading(true);
  setError(null);

  const controller = new AbortController();
  const infoUrl = `${BASE_URL}/stock/${symbol}/info`;
  const stockIdUrl = `${BASE_URL}/stock/entry`;

  const fetchData = async () => {
    console.log(WS_URL);
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      const [infoRes] = await Promise.allSettled([
        axios.get<CompanyProfile>(infoUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),

        axios.post(
          stockIdUrl,
          { symbol }, 
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        ),
      ]);

      
      if (infoRes.status === "fulfilled") {
        setProfile(infoRes.value.data);
      } else {
        setError(infoRes.reason?.message ?? "Failed to fetch profile");
      }

      setLoading(false);
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") return;
      setError(err?.message ?? "Unexpected error");
      setLoading(false);
    }
  };

  fetchData();

  return () => controller.abort();
}, [symbol]);


  return { profile, loading, error };
};


function mapBackendChartToPoints(payload?: BackendChartResponse) {
  if (!payload || !Array.isArray(payload.data)) return [];
  return payload.data
    .filter((p) => typeof p.price === "number")
    .map((p) => ({
      time:
        p.time ??
        (p.date
          ? new Date(p.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : ""),
      date: p.date ? new Date(p.date) : new Date(),
      price: p.price as number,
      open: typeof p.open === "number" ? p.open : undefined,
      high: typeof p.high === "number" ? p.high : undefined,
      low: typeof p.low === "number" ? p.low : undefined,
      volume: typeof p.volume === "number" ? p.volume : undefined,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function createChartSegments(data: Array<any>) {
  if (data.length <= 1) return data.map((p) => ({ ...p, isUp: true }));
  
  return data.map((point, idx) => ({
    ...point,
    isUp: idx === 0 || point.price >= data[idx - 1].price
  }));
}


const useChartData = (symbol?: string, range: string = "1y") => {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    const chartUrl = `${baseUrl}/stock/${encodeURIComponent(
      symbol
    )}/getStockChartData?range=${encodeURIComponent(range)}`;

    (async () => {
        const token = localStorage.getItem("Token"); 
        console.log(token);
        if (!token) {
  setError("No token found");
  setLoading(false);
  return;
}
      try {
        const res = await axios.get<BackendChartResponse>(chartUrl, 
          

          { headers: {
          Authorization: `Bearer ${token}`
        },
          signal: controller.signal,
        });
        console.log(res.data);
        const points = mapBackendChartToPoints(res.data);
        setData(points);
        setLoading(false);
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        setError(err?.message ?? "Failed to load chart");
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [symbol, range]);

  return { data, loading, error };
};

const StockDetailsHeader: FC<{ symbol?: string }> = ({ symbol }) => {
  const { profile, loading, error } = useCompanyProfile(symbol);

  if (loading) return <div className="text-sm md:text-base text-gray-400">Loading company info…</div>;
  if (error) return <div className="text-sm md:text-base text-red-400">Error loading company info: {error}</div>;

  return (
    <header className="flex items-center gap-3 sm:gap-4 md:gap-5 p-4 sm:p-6 bg-gradient-to-r from-[#1a2a3a] to-[#0f1b28] rounded-xl border border-gray-700 shadow-lg">
      {profile?.logo ? (
        <img
          src={profile.logo}
          alt={profile.name}
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-lg bg-gray-800 p-2"
        />
      ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold text-white">
          {symbol?.charAt(0)}
        </div>
      )}
      <div className="flex-1">
        <div className="font-bold text-lg sm:text-2xl md:text-3xl text-white">
          {profile?.ticker ?? symbol}
        </div>
        <div className="text-sm sm:text-base text-gray-300 mt-1">{profile?.name}</div>
        <div className="text-xs sm:text-sm text-gray-500 mt-1">{profile?.country ?? "N/A"}</div>
      </div>
    </header>
  );
};


const StockDetailsPage: FC = ({}) => {
  const {symbol} =useParams()
  console.log(`Params recieved from stockDetails Page is ${symbol}` );
  const [timeRange, setTimeRange] = useState<
    "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y"
  >("1y");

  const { profile } = useCompanyProfile(symbol);
  const { data: chartData, loading: loadingChart, error: chartError } =
    useChartData(symbol, timeRange);

  const latest = chartData.length ? chartData[chartData.length - 1] : null;


  const [livePrice, setLivePrice] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    ws.onmessage = (event) => {
       console.log("📩 RAW WS MESSAGE FROM BACKEND:", event.data);
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "trade" && Array.isArray(msg.data)) {
          const trade = msg.data.find((t: any) => t.s === symbol);
          if (trade && typeof trade.p === "number") {
            setLivePrice(trade.p);
          }
        }
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const displayedPrice = livePrice ?? latest?.price ?? 0;

  return (
    <div className="min-h-screen bg-[#0d1117] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <StockDetailsHeader symbol={symbol} />

        {/* Price Display Section */}
        <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {profile?.currency ?? "USD"} {displayedPrice.toFixed(2)}
            </div>
            {livePrice && (
              <span className="px-3 sm:px-4 py-1 sm:py-2 bg-green-500/20 border border-green-500/50 text-green-400 text-xs sm:text-sm md:text-base font-semibold rounded-full">
                ● Live
              </span>
            )}
            <div className="group relative inline-flex items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center cursor-help hover:bg-gray-600 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-gray-300">i</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <div className="bg-gray-900 text-gray-100 text-xs sm:text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap">
                  Currently we update live prices of US stocks. Sorry for inconvenience.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base mt-2">Current Price</p>
        </div>

        {/* Time Range Buttons */}
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap gap-2 sm:gap-3">
          {["1d", "5d", "1mo", "3mo", "6mo", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r as any)}
              className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 ${
                timeRange === r
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Chart Section */}
        <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Price Chart</h3>
            {latest && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                (latest.price ?? 0) >= (latest.open ?? 0)
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-red-500/20 border border-red-500/50"
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  (latest.price ?? 0) >= (latest.open ?? 0)
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}></div>
                <span className={`text-xs sm:text-sm font-semibold ${
                  (latest.price ?? 0) >= (latest.open ?? 0)
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {(latest.price ?? 0) >= (latest.open ?? 0) ? "Bullish" : "Bearish"}
                </span>
              </div>
            )}
          </div>
          <div className="h-64 sm:h-80 md:h-96">
            {loadingChart ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm sm:text-base">Loading chart…</div>
              </div>
            ) : chartError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-400 text-sm sm:text-base">Error: {chartError}</div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm sm:text-base">No chart data</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={createChartSegments(chartData)}>
                  <defs>
                    <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="downGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a2a3a", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#e5e7eb" }}
                    formatter={(v: any) => [
                      `${profile?.currency ?? "USD"} ${Number(v).toFixed(2)}`,
                      "Price",
                    ]}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1a2a3a] border border-gray-700 rounded p-2">
                            <p className="text-gray-300 text-xs sm:text-sm">{data.time}</p>
                            <p className={`font-semibold ${data.isUp ? 'text-green-400' : 'text-red-400'}`}>
                              ${data.price.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#06b6d4"
                    fill="url(#upGrad)"
                    strokeWidth={2.5}
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Trade Panel */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <QuickTradePanel symbol={symbol!} livePrice={livePrice} />
        </div>

        {/* Stock Statistics Grid */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Stock Statistics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { label: "Open", value: latest?.open?.toFixed(2) },
              { label: "High", value: latest?.high?.toFixed(2) },
              { label: "Low", value: latest?.low?.toFixed(2) },
              { label: "Close", value: latest?.price?.toFixed(2) }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#1a2a3a] to-[#0f1b28] rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide mb-2">
                  {stat.label}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400">
                  {stat.value ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { StockDetailsPage };
