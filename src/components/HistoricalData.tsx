
import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Mock data
const anomalyTypeData = [
  { name: "DDoS", value: 35 },
  { name: "Port Scan", value: 25 },
  { name: "Data Exfiltration", value: 15 },
  { name: "Unusual Login", value: 10 },
  { name: "Malware", value: 15 },
];

const weeklyData = [
  { name: "Mon", normal: 4000, anomaly: 240 },
  { name: "Tue", normal: 3000, anomaly: 139 },
  { name: "Wed", normal: 2000, anomaly: 980 },
  { name: "Thu", normal: 2780, anomaly: 390 },
  { name: "Fri", normal: 1890, anomaly: 490 },
  { name: "Sat", normal: 2390, anomaly: 230 },
  { name: "Sun", normal: 3490, anomaly: 340 },
];

const monthlyData = [
  { name: "Jan", normal: 4000, anomaly: 2400 },
  { name: "Feb", normal: 3000, anomaly: 1398 },
  { name: "Mar", normal: 2000, anomaly: 9800 },
  { name: "Apr", normal: 2780, anomaly: 3908 },
  { name: "May", normal: 1890, anomaly: 4800 },
  { name: "Jun", normal: 2390, anomaly: 3800 },
  { name: "Jul", normal: 3490, anomaly: 4300 },
  { name: "Aug", normal: 4000, anomaly: 2400 },
  { name: "Sep", normal: 3000, anomaly: 1398 },
  { name: "Oct", normal: 2000, anomaly: 9800 },
  { name: "Nov", normal: 2780, anomaly: 3908 },
  { name: "Dec", normal: 1890, anomaly: 4800 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const HistoricalData = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Historical Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">Long-term patterns and anomaly trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
              >
                <CalendarIcon size={14} />
                {date ? format(date, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Anomaly Distribution</CardTitle>
              <CardDescription>Breakdown of anomalies by type</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={anomalyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {anomalyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 border border-border/50 shadow-lg rounded-lg">
                          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                          <p className="text-xs text-foreground/60">{`${((payload[0].value / anomalyTypeData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}% of total`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Traffic Trends</CardTitle>
              <CardDescription>Normal vs. anomalous traffic over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Filter size={14} />
                Filter
              </Button>
            </div>
            
            <TabsContent value="weekly" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} />
                  <YAxis stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card p-3 border border-border/50 shadow-lg rounded-lg">
                            <p className="text-sm font-medium mb-1">{label}</p>
                            <p className="text-xs flex items-center">
                              <span className="h-2 w-2 rounded-full bg-primary mr-1.5 inline-block"></span>
                              Normal Traffic: {payload[0].value}
                            </p>
                            <p className="text-xs flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5 inline-block"></span>
                              Anomalous: {payload[1].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="normal"
                    name="Normal Traffic"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anomaly"
                    name="Anomalous Traffic"
                    stroke="#FF3B30"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="monthly" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} />
                  <YAxis stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card p-3 border border-border/50 shadow-lg rounded-lg">
                            <p className="text-sm font-medium mb-1">{label}</p>
                            <p className="text-xs flex items-center">
                              <span className="h-2 w-2 rounded-full bg-primary/70 mr-1.5 inline-block"></span>
                              Normal Traffic: {payload[0].value}
                            </p>
                            <p className="text-xs flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500/70 mr-1.5 inline-block"></span>
                              Anomalous: {payload[1].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="normal"
                    name="Normal Traffic"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.7}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="anomaly"
                    name="Anomalous Traffic"
                    fill="#FF3B30"
                    fillOpacity={0.7}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalData;
