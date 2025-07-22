import { useState, useEffect } from "react";
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    Clock,
    Filter,
    RefreshCw,
    Shield,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatCard from "./StatCard";
import { fetchRecentVulnerabilities } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface Anomaly {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  severity: string;
  status: string;
  impact: number;
  title?: string;
  description?: string;
  references?: string[];
}

interface ScanFinding {
  type: string;
  message: string;
}

// Mock data
const generateAnomalies = () => {
    const types = [
        "DDoS",
        "Port Scan",
        "Data Exfiltration",
        "Unusual Login",
        "Malware Communication",
    ];
    const sources = [
        "192.168.1.105",
        "10.0.0.24",
        "172.16.254.1",
        "fe80::1ff:fe23:4567:890a",
        "2001:db8:3333:4444:5555:6666:7777:8888",
    ];
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
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [error, setError] = useState<string | null>(null);
    const [scanDomain, setScanDomain] = useState("");
    const [scanning, setScanning] = useState(false);
    const [lastScanDomain, setLastScanDomain] = useState<string | null>(null);
    const [lastScanFindings, setLastScanFindings] = useState<Anomaly[]>([]);
    const { user } = useAuth();

    // Fetch anomalies for the user
    const loadAnomalies = async () => {
        if (!user?.email) return;
        setIsRefreshing(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:4000/anomalies?email=${encodeURIComponent(user.email)}`);
            setAnomalies(res.data);
        } catch (e) {
            setError("Failed to fetch anomalies. Please try again later.");
        }
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadAnomalies();
        // eslint-disable-next-line
    }, []);

    // Notify when new vulnerabilities are fetched
    useEffect(() => {
        if (anomalies.length > 0) {
            toast.info(
                `Fetched ${anomalies.length} vulnerabilities from the internet.`,
                {
                    description: "Review and resolve new threats as soon as possible.",
                }
            );
        }
        // eslint-disable-next-line
    }, [anomalies.length]);

    const handleResolve = (id: string) => {
        setAnomalies((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
        );
        toast.success("Vulnerability resolved!", {
            description:
                "Mitigation steps: Apply the latest security patches, review system logs, and update affected software.",
        });
    };

    const refreshData = () => {
        loadAnomalies();
    };

    // Scan handler
    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanDomain || !user?.email) return;
        setScanning(true);
        try {
            const res = await axios.post("http://localhost:4000/scan", {
                domain: scanDomain,
                email: user.email,
            });
            const findings = res.data.findings.map((f: ScanFinding, i: number): Anomaly => ({
                id: `scan-${scanDomain}-${i}`,
                timestamp: new Date().toISOString(),
                type: f.type,
                source: scanDomain,
                severity:
                    f.type === "critical"
                        ? "High"
                        : f.type === "warning"
                            ? "Medium"
                            : "Low",
                status: "Active",
                impact: 0,
                title: f.type,
                description: f.message,
                references: [],
            }));
            setAnomalies((prev) => [...findings, ...prev]);
            setLastScanDomain(scanDomain);
            setLastScanFindings(findings);
            toast.success(`Scan complete for ${scanDomain}`);
        } catch (err) {
            toast.error("Scan failed. Backend may be offline.");
        }
        setScanning(false);
        setScanDomain("");
    };

    // Generate mailto link for developer notification
    const getMailtoLink = () => {
        if (!lastScanDomain || lastScanFindings.length === 0) return "";
        const subject = encodeURIComponent(`Security Issues Detected on ${lastScanDomain}`);
        const body = encodeURIComponent(
            `Dear Developer,%0D%0A%0D%0A` +
            `The following security issues were detected on your website (${lastScanDomain}):%0D%0A%0D%0A` +
            lastScanFindings.map(f => `- [${f.type}] ${f.description}`).join('%0D%0A') +
            `%0D%0A%0D%0APlease address these issues as soon as possible.%0D%0A%0D%0ARegards,%0D%0AAnomaly Detection System`
        );
        return `mailto:?subject=${subject}&body=${body}`;
    };

    const filteredAnomalies = anomalies.filter((anomaly) => {
        if (
            statusFilter !== "all" &&
            anomaly.status.toLowerCase() !== statusFilter.toLowerCase()
        )
            return false;
        if (severityFilter !== "all" && anomaly.severity !== severityFilter)
            return false;
        if (typeFilter !== "all" && anomaly.type !== typeFilter) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        return status === "Active"
            ? "bg-red-500/20 text-red-600"
            : "bg-green-500/20 text-green-600";
    };

    const getSeverityColor = (severity: string) => {
        if (severity === "Low") return "text-anomaly-low";
        if (severity === "Medium") return "text-anomaly-medium";
        return "text-anomaly-high";
    };

    const activeAnomalies = anomalies.filter((a) => a.status === "Active").length;
    const highSeverity = anomalies.filter((a) => a.severity === "High").length;

    return (
        <div className="space-y-6">
            {/* Loading State */}
            {isRefreshing && (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-muted-foreground">
                        Loading vulnerabilities...
                    </span>
                </div>
            )}
            {/* Error State */}
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                </div>
            )}
            {/* Main Content */}
            {!isRefreshing && !error && (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">
                                Vulnerability & Anomaly Detection
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Live feed of recent vulnerabilities and anomalies from the
                                internet
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Severity</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {Array.from(new Set(anomalies.map((a) => a.type))).map(
                                        (type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={refreshData}
                                disabled={isRefreshing}
                                className="flex items-center gap-1.5"
                            >
                                <RefreshCw
                                    size={14}
                                    className={isRefreshing ? "animate-spin" : ""}
                                />
                                Refresh
                            </Button>
                        </div>
                    </div>
                    <form
                        onSubmit={handleScan}
                        className="flex flex-col sm:flex-row gap-2 mb-4"
                    >
                        <input
                            type="text"
                            className="border rounded px-3 py-2 w-full sm:w-auto"
                            placeholder="Enter website or domain (e.g. example.com)"
                            value={scanDomain}
                            onChange={(e) => setScanDomain(e.target.value)}
                            disabled={scanning}
                        />
                        <Button type="submit" disabled={scanning || !scanDomain}>
                            {scanning ? "Scanning..." : "Scan Website"}
                        </Button>
                    </form>
                    {lastScanFindings.length > 0 && lastScanDomain && (
                        <a
                            href={getMailtoLink()}
                            className="inline-block mt-4"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="destructive" type="button">
                                Notify Developer
                            </Button>
                        </a>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAnomalies.map((anomaly) => (
                            <Card key={anomaly.id} className="relative">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle
                                            className={getSeverityColor(anomaly.severity)}
                                        />
                                        {anomaly.title || anomaly.type}
                                    </CardTitle>
                                    <CardDescription>{anomaly.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div>
                                            <b>Severity:</b>{" "}
                                            <span className={getSeverityColor(anomaly.severity)}>
                                                {anomaly.severity}
                                            </span>
                                        </div>
                                        <div>
                                            <b>Status:</b>{" "}
                                            <span className={getStatusColor(anomaly.status)}>
                                                {anomaly.status}
                                            </span>
                                        </div>
                                        <div>
                                            <b>Published:</b>{" "}
                                            {new Date(anomaly.timestamp).toLocaleString()}
                                        </div>
                                        <div>
                                            <b>Source:</b> {anomaly.source}
                                        </div>
                                        {anomaly.references && anomaly.references.length > 0 && (
                                            <div>
                                                <b>References:</b>{" "}
                                                <a
                                                    href={anomaly.references[0]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    {anomaly.references[0]}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-4"
                                        disabled={anomaly.status === "Resolved"}
                                        onClick={() => handleResolve(anomaly.id)}
                                    >
                                        {anomaly.status === "Resolved" ? "Resolved" : "Resolve"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnomalyDetector;
