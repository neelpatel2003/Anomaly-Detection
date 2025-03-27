
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center py-16 md:py-20 lg:py-24">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground animate-fade-in">
              AI-Powered Network <span className="text-primary">Anomaly Detection</span>
            </h1>
            
            <p className="mt-6 text-lg text-foreground/80 leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Protect your infrastructure with advanced machine learning algorithms that detect suspicious patterns and anomalies in real-time. Stay one step ahead of potential threats.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {isAuthenticated ? (
                <Button 
                  className="btn-primary group"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <>
                  <Button 
                    className="btn-primary group"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                    <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    className="btn-outline"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-6 md:flex md:items-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                  <Zap size={18} className="text-primary" />
                </div>
                <p className="ml-3 text-sm font-medium text-foreground/80">Real-time Detection</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                  <Shield size={18} className="text-primary" />
                </div>
                <p className="ml-3 text-sm font-medium text-foreground/80">Advanced Security</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                  <BarChart3 size={18} className="text-primary" />
                </div>
                <p className="ml-3 text-sm font-medium text-foreground/80">Detailed Analytics</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
              <div className="absolute -bottom-10 right-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-pulse-soft" style={{ animationDelay: "1s" }}></div>
              
              <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Network Traffic Analysis</h3>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">Live</span>
                  </div>
                  
                  <div className="relative h-48 bg-background/60 rounded-lg overflow-hidden mb-4">
                    <div className="absolute inset-0 p-3">
                      <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-md animate-pulse-soft"></div>
                      
                      {/* Simulate Network Traffic Visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="90%" height="80%" viewBox="0 0 100 50">
                          <path d="M0,25 Q10,10 20,20 T40,15 T60,30 T80,5 T100,20" fill="none" stroke="rgba(0, 119, 255, 0.8)" strokeWidth="1" />
                          <path d="M0,25 Q10,40 20,30 T40,35 T60,20 T80,40 T100,25" fill="none" stroke="rgba(0, 119, 255, 0.5)" strokeWidth="1" />
                          {/* Anomaly point */}
                          <circle cx="80" cy="5" r="2" fill="#FF3B30" className="animate-pulse-soft" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background/60 p-3 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Traffic Volume</p>
                      <p className="text-xl font-semibold text-foreground">1.2 TB</p>
                    </div>
                    <div className="bg-background/60 p-3 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Anomalies</p>
                      <p className="text-xl font-semibold text-red-500">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
