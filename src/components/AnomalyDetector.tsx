
import { useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Clock, Filter, RefreshCw, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "./StatCard";

// Mock data
const generateAnomalies = () => {
  const types = ["DDoS", "Port Scan", "Data Exfiltration", "Unusual Login", "Malware Communication"];
  const sources = ["192.168.1.105", "10.0.0.24", "172.16.254.1", "fe80::1ff:fe23:4567:890a", "2001:db8:3333:4444:5555:6666:7777:8888"];
  const severities = ["Low", "Medium", "High"];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `anomaly-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    type: types[Math.floor(Math.random() * types.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: Math.random() > 0.3 ? "Active" : "Resolved",
    impact: Math.floor(Math.random() * 100),
  }));
};

const AnomalyDetector = () => {
  const [anomalies, setAnomalies] = useState(generateAnomalies());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAnomalies(generateAnomalies());
      setIsRefreshing(false);
    }, 1000);
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
          value="67%"
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
                    <td className="py-3 px-4 border-b border-border/30 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(anomaly.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-border/30">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(anomaly.status)}`}>
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
