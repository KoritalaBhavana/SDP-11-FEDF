import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar, Home } from "lucide-react";
import imageMap from '@/lib/imageMap';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const { cartCount } = useCart();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        let fetched: any[] = [];

        if (user?.id) {
          fetched = (await api.getOrders(user.id)) || [];
        } else {
          // try to fetch guest orders by clientId stored in localStorage
          try {
            const cid = typeof window !== 'undefined' ? localStorage.getItem('clientId') : null;
            if (cid) {
              fetched = (await api.getOrdersByClient(cid)) || [];
            } else {
              fetched = [];
            }
          } catch (e) {
            fetched = [];
          }
        }

        const ids = new Set<string>();
        // collect any product identifiers from items; support productId, id, or _id (robust for older orders)
        fetched.forEach((o: any) => (o.items || []).forEach((it: any) => {
          const pid = it?.productId || it?.id || it?._id || null;
          if (pid) ids.add(pid.toString());
        }));
        const idList = Array.from(ids);

        const productMap: Record<string, any> = {};
        await Promise.all(idList.map(async (id) => {
          try {
            const p = await api.getProduct(id);
            if (p && p._id) productMap[id] = p;
          } catch (e) {
            // ignore
          }
        }));

        const enriched = fetched.map((o: any) => ({
          ...o,
          items: (o.items || []).map((it: any) => {
            const prod = (it?.productId && productMap[it.productId]) || (it?.id && productMap[it.id]) || (it?._id && productMap[it._id]) || null;
            return {
              ...it,
              name: it.name || prod?.name,
              image: it.image || prod?.image,
              product: prod || null
            };
          })
        }));

        if (mounted) setOrders(enriched);
      } catch (err) {
        console.error('Failed to load orders', err);
        if (mounted) setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'processing': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'shipped': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading orders…</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
        <Header
          cartCount={cartCount}
          onCartClick={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent>
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
      <Header
        cartCount={0}
        onCartClick={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div>
            <Button variant="ghost" onClick={() => navigate('/') }>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id || order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order._id || order.id}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={getStatusColor(order.status)}>{order.status}</Badge>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-xl font-bold">₹{order.total?.toLocaleString?.() ?? order.total}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Items</h3>
                  <div className="space-y-4">
                    {(order.items || []).map((item: any, idx: number) => {
                      const imgKey = (item.image || '').toString().split('/').pop();
                      const imgSrc = imageMap[imgKey] || imageMap[item.image] || item.image || '';
                      const productId = item.productId || item.product?._id || item.id || item._id;
                      const linkTo = productId ? `/product/${productId}` : undefined;

                      return (
                        <div key={item._id || item.id || idx} className="flex gap-4 items-center">
                          {linkTo ? (
                            <Link to={linkTo} className="block w-20 h-20 shrink-0">
                              <img src={imgSrc} alt={item.name} className="w-20 h-20 object-cover rounded border" />
                            </Link>
                          ) : (
                            <div className="w-20 h-20 shrink-0">
                              <img src={imgSrc} alt={item.name} className="w-20 h-20 object-cover rounded border" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h4 className="font-medium">
                              {linkTo ? <Link to={linkTo} className="hover:underline">{item.name}</Link> : item.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            <p className="text-sm font-semibold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">{order.shipping?.fullName || order.shippingAddress?.fullName || '—'}</p>
                    <p>{order.shipping?.address || order.shippingAddress?.address || ''}</p>
                    <p>{order.shipping?.city || order.shippingAddress?.city || ''}, {order.shipping?.state || order.shippingAddress?.state || ''} - {order.shipping?.pincode || order.shippingAddress?.pincode || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

