
import { useState, useEffect } from "react";
import { ChevronDown, HardDriveDownload, HardDriveUpload, RefreshCw } from "lucide-react";
import StatCard from "./StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Mock data
const generateTrafficData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      traffic: 1000 + Math.random() * 2000,
      anomaly: Math.random() > 0.9 ? 1500 + Math.random() * 1000 : 0,
    });
  }
  return data;
};

const TrafficMonitor = () => {
  const [trafficData, setTrafficData] = useState(generateTrafficData());
  const [refreshing, setRefreshing] = useState(false);
  
  const totalTraffic = trafficData.reduce((acc, curr) => acc + curr.traffic, 0);
  const avgTraffic = Math.round(totalTraffic / trafficData.length);
  
  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTrafficData(generateTrafficData());
      setRefreshing(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Network Traffic Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time analysis of network traffic patterns and anomalies</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Traffic"
          value={`${(Math.random() * 100).toFixed(2)} Mbps`}
          description="Live network throughput"
          icon={<RefreshCw size={18} className="text-primary animate-spin" />}
          variant="glass"
        />
        <StatCard
          title="Total Traffic Today"
          value={`${(totalTraffic / 1000).toFixed(2)} GB`}
          description="Cumulative for current day"
          icon={<HardDriveDownload size={18} className="text-primary" />}
          variant="glass"
        />
        <StatCard
          title="Outbound Traffic"
          value={`${(totalTraffic * 0.4 / 1000).toFixed(2)} GB`}
          description="40% of total traffic"
          icon={<HardDriveUpload size={18} className="text-primary" />}
          variant="glass"
        />
        <StatCard
          title="Peak Usage"
          value={`${Math.max(...trafficData.map(d => d.traffic)) / 1000} GB/h`}
          description="Highest recorded this period"
          variant="glass"
        />
      </div>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>24-hour network traffic with anomaly highlights</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              24h 
              <ChevronDown size={14} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trafficData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
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
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={0.5}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={0.5}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}GB`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 border border-border/50 shadow-lg rounded-lg">
                          <p className="text-sm font-medium">{`Time: ${payload[0].payload.time}`}</p>
                          <p className="text-sm text-primary">{`Traffic: ${(payload[0].value / 1000).toFixed(2)} GB`}</p>
                          {payload[1].value > 0 && (
                            <p className="text-sm text-red-500 font-medium">{`Anomaly Detected!`}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#trafficFill)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="anomaly" 
                  stroke="red" 
                  strokeWidth={2}
                  fill="url(#anomalyFill)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/80">CPU Usage</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/80">Memory Usage</span>
                <span className="text-sm font-medium">43%</span>
              </div>
              <Progress value={43} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/80">Disk I/O</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficMonitor;
