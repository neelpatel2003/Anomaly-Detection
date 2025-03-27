
import { Activity, AlertCircle, BarChart2, Clock, Database, Lock, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: <Activity className="h-6 w-6 text-primary" />,
    title: "Real-time Monitoring",
    description: "Monitor your network traffic in real-time with sub-second latency detection and alerting."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Threat Detection",
    description: "Advanced AI algorithms to detect potential security threats and unusual behavior patterns."
  },
  {
    icon: <Database className="h-6 w-6 text-primary" />,
    title: "Scalable Architecture",
    description: "Designed to scale with your growing infrastructure, from startups to enterprise deployments."
  },
  {
    icon: <AlertCircle className="h-6 w-6 text-primary" />,
    title: "Anomaly Classification",
    description: "Automatically classify anomalies by type, severity, and potential impact to prioritize responses."
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-primary" />,
    title: "Detailed Analytics",
    description: "Comprehensive dashboards with historical data analysis and trend visualization."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Historical Pattern Analysis",
    description: "Compare current behavior against historical patterns to identify long-term trends and anomalies."
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: "Secure by Design",
    description: "End-to-end encryption and secure authentication to protect your sensitive monitoring data."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Low Latency Alerts",
    description: "Receive instant notifications across multiple channels when anomalies are detected."
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Advanced Features for Complete Network Visibility
          </h2>
          <p className="mt-4 text-xl text-foreground/70">
            Our platform combines cutting-edge AI with intuitive visualizations to provide unmatched insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl p-6 border border-primary/5 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
