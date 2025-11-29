import { Search, ShoppingCart, Menu, User, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Header = ({ cartCount, onCartClick, searchQuery, onSearchChange, selectedCategory, onCategoryChange }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const setHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-height', `${Math.ceil(h)}px`);
      }
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);
  
  return (
    <header ref={headerRef} className="bg-card/95 backdrop-blur-sm border-b fixed top-0 left-0 right-0 z-50 shadow-card-handloom">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-serif font-bold bg-hero-gradient bg-clip-text text-transparent">
              Handloom Heritage
            </h1>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search handloom products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
              <Package className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(isAuthenticated ? "/profile" : "/auth")}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pb-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              'All Products',
              'Sarees', 
              'Dresses',
              'Men\'s Kurtas',
              'Men\'s Shirts',
              'Kurtis',
              'Dupattas',
              'Bags',
              'Accessories'
            ].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className={`whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:text-primary hover:bg-secondary"
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;