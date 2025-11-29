import { useState, useMemo, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useCart } from '@/contexts/CartContext';
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import CartSidebar from "@/components/CartSidebar";

// Import images
import heroImage from "@/assets/hero-handloom.jpg";
import { api } from '@/lib/api';
import imageMap from '@/lib/imageMap';

// Products are fetched from backend. We map backend `_id` to `id` and resolve image filenames
// using `imageMap`. The frontend polls for product changes every 30s so DB deletes
// will be reflected without a manual refresh.

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isHandmade: boolean;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  isHandmade: boolean;
  rating: number;
}

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { cartItems, addToCart, updateQuantity, removeItem, cartCount } = useCart();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    isHandmade: false,
    rating: 0
  });

  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from backend and poll for changes every 30s
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data: any[] = await api.getProducts();
        if (!mounted) return;
        const blacklist = new Set(["mustard embroidered a-line kurti"].map(s=>s.toLowerCase().trim()));
        const mapped = (data || []).map((p) => {
          const nameNorm = (p.name||'').toString().toLowerCase().trim();
          if (blacklist.has(nameNorm)) return null;
          const imgKey = (p.image || '').toString().split('/').pop();
          return ({
            id: (p._id || p.id).toString(),
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            image: imageMap[imgKey] || imageMap[p.image] || p.image,
            category: p.category,
            isHandmade: p.isHandmade,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            description: p.description,
            features: p.features || [],
            inStock: (p.stock || 0) > 0,
            stockCount: p.stock || 0
          } as Product);
        });
        setProducts(mapped.filter(Boolean) as Product[]);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };

    load();
    const iv = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  // Filter products based on search, category, and filters
  const filteredProducts = useMemo(() => {
    const normalize = (s: any) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '');

    // Map display labels used in Header/FilterSidebar to backend category values.
    // This makes the UI resilient to pluralization/casing differences.
    const categoryMap: Record<string, string[]> = {
      [normalize('All Products')]: [],
      [normalize('Sarees')]: ['Sarees'],
      [normalize('Dresses')]: ['Dresses'],
      [normalize("Men's Kurtas")]: ['Kurta', 'Kurtas'],
      [normalize("Men's Shirts")]: ['Shirts', 'Shirt'],
      [normalize('Kurtis')]: ['Kurti', 'Kurtis'],
      [normalize('Dupattas')]: ['Dupatta', 'Dupattas'],
      [normalize('Bags')]: ['Bags'],
      [normalize('Accessories')]: ['Accessories']
    };

    const matchesSelectedCategory = (prodCat: string, selLabel: string) => {
      if (!selLabel || selLabel === 'All Products') return true;
      const mapped = categoryMap[normalize(selLabel)];
      if (!mapped || mapped.length === 0) return true;
      return mapped.some(mc => normalize(mc) === normalize(prodCat));
    };

    const matchesFilterCategories = (prodCat: string, filterLabels: string[]) => {
      if (!filterLabels || filterLabels.length === 0) return true;
      const prodNorm = normalize(prodCat);
      return filterLabels.some(fl => {
        const mapped = categoryMap[normalize(fl)];
        if (mapped && mapped.length > 0) {
          return mapped.some(mc => normalize(mc) === prodNorm);
        }
        return normalize(fl) === prodNorm;
      });
    };

    return products.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter from navbar - compare normalized values to handle
      // case and simple pluralization differences between backend and UI
      if (!matchesSelectedCategory(product.category, selectedCategory)) {
        return false;
      }
      
      // Category filter from sidebar (display labels may differ from backend).
      if (!matchesFilterCategories(product.category, filters.categories)) {
        return false;
      }
      
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Handmade filter
      if (filters.isHandmade && !product.isHandmade) {
        return false;
      }
      
      // Rating filter
      if (product.rating < filters.rating) {
        return false;
      }
      
      return true;
    });
  }, [products, searchQuery, selectedCategory, filters]);

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => updateQuantity(id, quantity);
  const handleRemoveItem = (id: string) => removeItem(id);

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      isHandmade: false,
      rating: 0
    });
    setSelectedCategory("All Products");
  };

  // cartCount comes from CartContext

  return (
    <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={heroImage}
          alt="Beautiful handloom products showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold">
              Handloom Heritage
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
              Discover authentic Indian handloom products crafted with traditional techniques
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Shop Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Product Area */}
          <div className="flex-1">
            {/* Filter Toggle for Mobile */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Results Count for Desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-semibold">
                Our Collection
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No products found matching your criteria.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;