
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import TrafficMonitor from "@/components/TrafficMonitor";
import AnomalyDetector from "@/components/AnomalyDetector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart, Clock } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Slight delay to trigger animations after component mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If still loading, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-10">
          <header className={`mb-8 transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Network Anomaly Dashboard</h1>
            <p className="text-muted-foreground mt-2">Monitor and analyze your network security with AI-powered insights</p>
          </header>
          
          <Tabs defaultValue="traffic" className={`transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '100ms' }}>
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
              <TabsTrigger value="traffic" className="flex items-center gap-1.5">
                <Activity size={16} />
                Traffic Monitor
              </TabsTrigger>
              <TabsTrigger value="anomalies" className="flex items-center gap-1.5" style={{marginLeft:'150px'}}>
                <BarChart size={16} />
                Anomalies
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="traffic" className={`transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <TrafficMonitor />
            </TabsContent>
            
            <TabsContent value="anomalies" className={`transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <AnomalyDetector />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
