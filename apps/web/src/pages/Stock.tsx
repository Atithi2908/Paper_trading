import React, { useEffect, useState, useRef } from "react";
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
import { BASE_URL } from "@repo/config";
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

  if (loading) return <div>Loading company info…</div>;
  if (error) return <div>Error loading company info: {error}</div>;

  return (
    <header className="flex items-center gap-4">
      {profile?.logo ? (
        <img
          src={profile.logo}
          alt={profile.name}
          className="w-12 h-12 object-contain"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          {symbol?.charAt(0)}
        </div>
      )}
      <div>
        <div className="font-semibold">
          {profile?.ticker ?? symbol} — {profile?.name}
        </div>
        <div className="text-sm text-gray-500">{profile?.country ?? "N/A"}</div>
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
    <div style={{ padding: 16 }}>
      <StockDetailsHeader symbol={symbol} />
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          {profile?.currency ?? "USD"} {displayedPrice.toFixed(2)}
          {livePrice && (
            <span style={{ marginLeft: 8, color: "#06b6d4", fontSize: 14 }}>
              (Live)
            </span>
          )}
        </div>
      </div>
      <div style={{ marginTop: 12, marginBottom: 8 }}>
        {["1d", "5d", "1mo", "3mo", "6mo", "1y"].map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r as any)}
            style={{
              marginRight: 8,
              padding: "6px 10px",
              borderRadius: 6,
              border: timeRange === r ? "1px solid #06b6d4" : "1px solid #ddd",
              background: timeRange === r ? "#06b6d4" : "transparent",
              color: timeRange === r ? "#fff" : "#111",
              cursor: "pointer",
            }}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>


      <div
        style={{
          height: 320,
          background: "#fff",
          padding: 12,
          borderRadius: 8,
        }}
      >
        {loadingChart ? (
          <div>Loading chart…</div>
        ) : chartError ? (
          <div>Error: {chartError}</div>
        ) : chartData.length === 0 ? (
          <div>No chart data</div>
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
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
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

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div>Open</div>
          <div>{latest?.open?.toFixed(2) ?? "—"}</div>
        </div>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div>High</div>
          <div>{latest?.high?.toFixed(2) ?? "—"}</div>
        </div>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div>Low</div>
          <div>{latest?.low?.toFixed(2) ?? "—"}</div>
        </div>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div>Close</div>
          <div>{latest?.price?.toFixed(2) ?? "—"}</div>
        </div>
      </div>
    </div>
  );
};

export { StockDetailsPage };
