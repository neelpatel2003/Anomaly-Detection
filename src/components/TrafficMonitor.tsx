import { useState, useEffect } from "react";
import { ChevronDown, HardDriveDownload, HardDriveUpload, RefreshCw } from "lucide-react";
import StatCard from "./StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { boolean } from "zod";

const TrafficMonitor = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const fetchTrafficData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/results");
      const json = await res.json();
      const formatMinute = (h, m) => `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

      const minuteBuckets = Array.from({ length: 1440 }, (_, i) => {
        const hour = Math.floor(i / 60);
        const minute = i % 60;
        return {
          time: formatMinute(hour, minute),
          traffic: 0,
          anomaly: 0,
        };
      });

      for (const pkt of json.recent) {
        const date = new Date(pkt.Time);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const timeLabel = formatMinute(hour, minute);
        const length = parseInt(pkt.Length);
        const isAnomaly = pkt.bad_packet === "1";

        const bucket = minuteBuckets.find(b => b.time === timeLabel);
        if (bucket) {
          bucket.traffic += length;
          if (isAnomaly) {
            bucket.anomaly += length;
          }
        }
      }

      setTrafficData(minuteBuckets);
    } catch (error) {
      console.error("Failed to fetch traffic data:", error);
    }
    setRefreshing(false);
  };


  useEffect(() => {
    fetchTrafficData();
  }, []);

  const totalTraffic = trafficData.reduce((acc, curr) => acc + curr.traffic, 0);
  const peakUsage = Math.max(...trafficData.map(d => d.traffic));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Network Traffic Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analysis of network traffic patterns and anomalies
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await fetch("/api/start", { method: "POST" });
                setIsRunning(true);
              } catch (err) {
                console.error("Failed to start capturing:", err);
              }
            }}
          >
            Start
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await fetch("/api/stop", { method: "POST" });
                setIsRunning(false);
              } catch (err) {
                console.error("Failed to stop capturing:", err);
              }
            }}
          >
            Stop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTrafficData}
            disabled={refreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh Data
          </Button>
          <div
            className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${isRunning ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {isRunning ? "Traffic Capture is Running" : "Traffic Capture is Stopped"}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Traffic Today"
          value={`${(totalTraffic / 1000).toFixed(2)} KB`}
          description="Cumulative for current day"
          icon={<HardDriveDownload size={18} className="text-primary" />}
          variant="glass"
        />
        <StatCard
          title="Outbound Traffic"
          value={`${(totalTraffic * 0.4 / 1000).toFixed(2)} KB`}
          description="40% of total traffic"
          icon={<HardDriveUpload size={18} className="text-primary" />}
          variant="glass"
        />
        <StatCard
          title="Peak Usage"
          value={`${(peakUsage / 1000).toFixed(2)} KB/h`}
          description="Highest recorded this period"
          variant="glass"
        />
      </div>

      {/* Area Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>24-hour network traffic</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="anomalyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="red" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="red" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  interval={59} // shows one label every 60 minutes
                  // try 4 or 9 for every 5 or 10 minutes
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={0.5}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}KB`} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card p-3 border border-border/50 shadow-lg rounded-lg">
                        <p className="text-sm font-medium">{`Time: ${payload[0].payload.time}`}</p>
                        <p className="text-sm text-primary">{`Traffic: ${(payload[0].value as number/ 1000).toFixed(2)} KB`}</p>
                        {payload[1] && payload[1].value as number > 0 && (
                          <p className="text-sm text-red-500 font-medium">Anomaly Detected!</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }} />
                <Area type="monotone" dataKey="traffic" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#trafficFill)" />
                <Area type="monotone" dataKey="anomaly" stroke="red" strokeWidth={2} fill="url(#anomalyFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficMonitor;
