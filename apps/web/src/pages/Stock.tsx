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

  if (loading) return <div className="text-sm md:text-base">Loading company info…</div>;
  if (error) return <div className="text-sm md:text-base text-red-500">Error loading company info: {error}</div>;

  return (
    <header className="flex items-center gap-2 sm:gap-3 md:gap-4">
      {profile?.logo ? (
        <img
          src={profile.logo}
          alt={profile.name}
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        />
      ) : (
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex items-center justify-center text-sm sm:text-base">
          {symbol?.charAt(0)}
        </div>
      )}
      <div>
        <div className="font-semibold text-sm sm:text-base md:text-lg">
          {profile?.ticker ?? symbol} — {profile?.name}
        </div>
        <div className="text-xs sm:text-sm text-gray-500">{profile?.country ?? "N/A"}</div>
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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <StockDetailsHeader symbol={symbol} />
      <div className="mt-3 sm:mt-4 md:mt-6">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {profile?.currency ?? "USD"} {displayedPrice.toFixed(2)}
          {livePrice && (
            <span className="ml-2 sm:ml-3 md:ml-4 text-cyan-400 text-xs sm:text-sm md:text-base">
              (Live)
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 sm:mt-4 md:mt-6 mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
        {["1d", "5d", "1mo", "3mo", "6mo", "1y"].map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r as any)}
            className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md border text-xs sm:text-sm md:text-base ${
              timeRange === r
                ? "border-cyan-400 bg-cyan-400 text-white"
                : "border-gray-300 bg-transparent text-gray-800"
            } cursor-pointer transition hover:border-cyan-400`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>


      <div className="h-64 sm:h-80 md:h-96 bg-white p-3 sm:p-4 rounded-lg shadow-md">
        {loadingChart ? (
          <div className="flex items-center justify-center h-full text-sm md:text-base">Loading chart…</div>
        ) : chartError ? (
          <div className="flex items-center justify-center h-full text-sm md:text-base text-red-500">Error: {chartError}</div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm md:text-base">No chart data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: any) => [
                  `${profile?.currency ?? "USD"} ${Number(v).toFixed(2)}`,
                  "Price",
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#06b6d4"
                fill="url(#g1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    <QuickTradePanel symbol={symbol!} livePrice={livePrice} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Open</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold">{latest?.open?.toFixed(2) ?? "—"}</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">High</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold">{latest?.high?.toFixed(2) ?? "—"}</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Low</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold">{latest?.low?.toFixed(2) ?? "—"}</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Close</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold">{latest?.price?.toFixed(2) ?? "—"}</div>
        </div>
      </div>
    </div>
  );
};

export { StockDetailsPage };
