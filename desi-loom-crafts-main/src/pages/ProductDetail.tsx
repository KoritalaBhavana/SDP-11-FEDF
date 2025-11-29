import { useState, useEffect } from "react";
import { useCart } from '@/contexts/CartContext';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CartSidebar from '@/components/CartSidebar';
import { api } from '@/lib/api';
import imageMap from '@/lib/imageMap';
import ProductCard from '@/components/ProductCard';

// Import images
import sareeImage from "@/assets/saree-1.jpg";
import sareeImage2 from "@/assets/saree-2.jpg";
import dressImage from "@/assets/dress-1.jpg";
import dressImage2 from "@/assets/dress-2.jpg";
import shirtImage from "@/assets/shirt-1.jpg";
import bagImage from "@/assets/bag-1.jpg";
import bagImage2 from "@/assets/bag-2.jpg";
import kurtaImage from "@/assets/kurta-1.jpg";
import kurtiImage from "@/assets/kurti-1.jpg";
import dupattaImage from "@/assets/dupatta-1.jpg";

// We'll fetch the product by id from backend

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addToCart, cartCount, cartItems, updateQuantity, removeItem } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const p: any = await api.getProduct(id);
        if (!mounted) return;
        const blacklist = new Set(["mustard embroidered a-line kurti"].map(s=>s.toLowerCase().trim()));
        const nameNorm = (p && p.name ? p.name.toString().toLowerCase().trim() : '');
        if (!p || p.error || blacklist.has(nameNorm)) {
          setProduct(null);
          setLoading(false);
          return;
        }
        const imgKey = (p.image || '').toString().split('/').pop();
        const mapped = {
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
          inStock: p.stock > 0,
          stockCount: p.stock || 0
        };
        setProduct(mapped);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Load related products when the main product is available
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!product) return;
      try {
        const all: any[] = await api.getProducts();
        if (!mounted) return;
        const mapped = (all || []).map((p) => {
          const imgKey = (p.image || '').toString().split('/').pop();
          return {
            id: (p._id || p.id)?.toString(),
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            image: imageMap[imgKey] || imageMap[p.image] || p.image,
            category: p.category,
            isHandmade: p.isHandmade,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
          };
        }).filter(p => p.id !== product.id && p.category && p.category === product.category).slice(0, 8);

        setRelatedProducts(mapped);
      } catch (e) {
        console.error('Failed to load related products', e);
      }
    })();
    return () => { mounted = false; };
  }, [product]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-subtle-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category }, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

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
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-card shadow-card-handloom">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      In Stock ({product.stockCount} items left)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart & Favorite */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className="px-6"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹2000</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 day return policy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Authentic</p>
                  <p className="text-xs text-muted-foreground">100% handmade products</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Suggestions / Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recommendations available.</p>
            ) : (
              relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  product={rp}
                  onAddToCart={(p) => { addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category }, 1); setIsCartOpen(true); }}
                  onToggleFavorite={() => {}}
                  isFavorite={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;