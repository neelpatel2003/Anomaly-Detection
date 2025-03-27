
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="bg-primary text-white font-bold rounded-lg p-1.5 text-xl">AD</span>
              <span className="text-xl font-bold text-foreground">AnomalyDetect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "after:w-full text-foreground font-medium" : ""}`}>
              Home
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "after:w-full text-foreground font-medium" : ""}`}>
                Dashboard
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground/80">Hi, {user?.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary" size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-foreground">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? "max-h-screen opacity-100 visible" 
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="bg-background/95 backdrop-blur-md shadow-lg px-4 py-5 space-y-4">
          <Link to="/" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
              Dashboard
            </Link>
          )}
          
          <div className="pt-3 border-t border-border/30">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground/80 py-1">Hi, {user?.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="flex items-center justify-center gap-1 w-full"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={toggleMenu} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">Log in</Button>
                </Link>
                <Link to="/signup" onClick={toggleMenu} className="w-full">
                  <Button className="bg-primary w-full" size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
