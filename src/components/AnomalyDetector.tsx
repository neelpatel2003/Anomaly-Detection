import { useEffect, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Clock, Filter, RefreshCw, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "./StatCard";

const AnomalyDetector = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAnomalies = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/results");
      const data = await response.json();

      const badPackets = data.recent.filter((packet) => packet.bad_packet === "1");

      // Convert bad packets to anomaly-like format
      const parsed = badPackets.map((packet, index) => ({
        id: `bad-${index}`,
        timestamp: packet.Time,
        type: packet.Protocol || "Unknown",
        source: packet.Source,
        severity: inferSeverity(packet), // helper function below
        status: "Active", // or infer from data if available
        impact: Math.floor(Math.random() * 100), // optional/random
      }));

      setAnomalies(parsed);
    } catch (err) {
      console.error("Failed to fetch anomalies:", err);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const refreshData = () => {
    fetchAnomalies();
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (statusFilter === "all") return true;
    return anomaly.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-red-500/20 text-red-600" : "bg-green-500/20 text-green-600";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "Low") return "text-anomaly-low";
    if (severity === "Medium") return "text-anomaly-medium";
    return "text-anomaly-high";
  };

  const inferSeverity = (packet: { Length?: string }): string => {
    const length = parseInt(packet.Length || "0");
    if (length > 120) return "High";
    if (length > 60) return "Medium";
    return "Low";
  };


  const activeAnomalies = anomalies.filter(a => a.status === "Active").length;
  const highSeverity = anomalies.filter(a => a.severity === "High").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Anomaly Detection</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-powered analysis of network behavior patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Anomalies"
          value={activeAnomalies}
          description="Requiring attention"
          icon={<AlertTriangle size={18} className={activeAnomalies > 0 ? "text-anomaly-high" : "text-foreground/70"} />}
          variant={activeAnomalies > 0 ? "danger" : "glass"}
        />
        <StatCard
          title="Detected Today"
          value={anomalies.length}
          description="Total anomalies found"
          icon={<Shield size={18} className="text-primary" />}
          variant="glass"
        />
        <StatCard
          title="High Severity"
          value={highSeverity}
          description="Critical security issues"
          icon={<ArrowUpRight size={18} className={highSeverity > 0 ? "text-anomaly-high" : "text-foreground/70"} />}
          variant={highSeverity > 0 ? "danger" : "glass"}
        />
        <StatCard
          title="Resolution Rate"
          value="0%" // Update if real resolution data is available
          description="Anomalies resolved"
          icon={<ArrowDownRight size={18} className="text-anomaly-low" />}
          variant="success"
        />
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Anomaly Log</CardTitle>
              <CardDescription>Recent detected anomalies and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Filter size={14} />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left font-medium text-muted-foreground py-3 px-4">Type</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4">Source</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4">Severity</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4">Time</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnomalies.map((anomaly) => (
                  <tr key={anomaly.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 border-b border-border/30 font-medium">{anomaly.type}</td>
                    <td className="py-3 px-4 border-b border-border/30">{anomaly.source}</td>
                    <td className="py-3 px-4 border-b border-border/30">
                      <span className={`font-medium ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-border/30">{anomaly.timestamp}</td>
                    <td className="py-3 px-4 border-b border-border/30">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(anomaly.status)}`}>
                        {anomaly.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDetector;
