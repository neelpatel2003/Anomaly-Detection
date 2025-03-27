
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-primary/5 z-0"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to secure your network?
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
              Join thousands of organizations using our advanced anomaly detection platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/signup" className="btn-primary">
                Get Started
              </a>
              <a href="/login" className="btn-outline">
                Log In
              </a>
            </div>
          </div>
        </section>
        
        <footer className="bg-background border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="bg-primary text-white font-bold rounded-lg p-1.5 text-xl">AD</span>
                <span className="text-xl font-bold text-foreground ml-2">AnomalyDetect</span>
              </div>
              <p className="text-sm text-foreground/60">
                © {new Date().getFullYear()} AnomalyDetect. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
