import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [clientId, setClientId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card'|'upi'|'netbanking'|'cod'>('card');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [netAccountNumber, setNetAccountNumber] = useState('');
  const [netIfsc, setNetIfsc] = useState('');

  useEffect(() => {
    try {
      let cid = localStorage.getItem('clientId');
      if (!cid) {
        cid = Date.now().toString();
        localStorage.setItem('clientId', cid);
      }
      setClientId(cid);
    } catch (e) {
      setClientId(Date.now().toString());
    }
  }, []);

  // fallback deterministic SVG generator used if QR library fails or while generating
  const generatePlaceholderSvg = (seedInput: string) => {
    const seed = (seedInput || 'x').toString();
    const hash = (s: string) => {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      }
      return Math.abs(h);
    };
    const h = hash(seed);
    const size = 120;
    const cols = 7;
    const cell = Math.floor(size / cols);
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>`;
    svg += `<rect width='100%' height='100%' fill='#ffffff'/>`;
    for (let r = 0; r < cols; r++) {
      for (let c = 0; c < cols; c++) {
        const bit = ((h >> ((r * cols + c) % 32)) & 1) ^ ((r + c) % 2 === 0 ? 0 : 0);
        if (bit) {
          const x = c * cell;
          const y = r * cell;
          svg += `<rect x='${x}' y='${y}' width='${cell}' height='${cell}' fill='#111827'/>`;
        }
      }
    }
    svg += `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const [upiQrDataUri, setUpiQrDataUri] = useState<string>(() => generatePlaceholderSvg(clientId || 'x'));

  // compute totals before effects that depend on them
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // build UPI deep link; include amount if available
        const pa = upiId ? encodeURIComponent(upiId) : '';
        const pn = encodeURIComponent(formData.fullName || 'Merchant');
        const am = total ? encodeURIComponent(total.toString()) : '';
        const upiUri = `upi://pay?pa=${pa}&pn=${pn}${am ? `&am=${am}&cu=INR` : ''}`;

        // dynamic import to avoid TypeScript type issues if types missing
        const QR = await import('qrcode');
        const dataUrl = await QR.toDataURL(upiUri || generatePlaceholderSvg(clientId || 'x'));
        if (mounted && dataUrl) setUpiQrDataUri(dataUrl);
      } catch (err) {
        // fallback to deterministic placeholder SVG
        if (mounted) setUpiQrDataUri(generatePlaceholderSvg(upiId || clientId || 'x'));
      }
    })();
    return () => { mounted = false; };
  }, [upiId, clientId, formData.fullName, total]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create order payload
    // Ensure each cart item includes a productId field that points to the backend product id
    const itemsWithProductId = cartItems.map((ci) => ({
      productId: (ci as any).id || (ci as any)._id || null,
      name: ci.name,
      price: ci.price,
      quantity: ci.quantity,
      image: ci.image,
    }));

    const orderPayload: any = {
      // let backend assign _id; include a client-side id for immediate display if needed
      clientId: clientId || Date.now().toString(),
      userId: user?.id || null,
      date: new Date().toISOString(),
      items: itemsWithProductId,
      total,
      payment: {
        method: paymentMethod,
        details: paymentMethod === 'card' ? {
          cardNumber: formData.cardNumber ? `**** **** **** ${formData.cardNumber.slice(-4)}` : undefined,
          expiry: formData.expiryDate || undefined
        } : paymentMethod === 'upi' ? {
          upiId: upiId || null
        } : paymentMethod === 'netbanking' ? {
          bank: selectedBank || null,
          accountNumber: netAccountNumber || null,
          ifsc: netIfsc || null
        } : { note: 'Cash on Delivery' }
      },
      shippingAddress: formData,
      status: "Processing",
    };

    (async () => {
      try {
        const created = await api.createOrder(orderPayload);

        toast({
          title: "Order Placed Successfully!",
          description: `Order #${created._id || created.id || orderPayload.clientId} has been confirmed`,
        });

        navigate("/orders");
      } catch (err) {
        console.error('Failed to create order on backend', err);
        toast({
          title: 'Order Failed',
          description: 'Could not place order. Please try again.',
          variant: 'destructive'
        });
      }
    })();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
        <Header
          cartCount={0}
          onCartClick={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <Button onClick={() => navigate("/")}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
      <Header
        cartCount={cartItems.length}
        onCartClick={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <span className="ml-2">Card</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                        <span className="ml-2">UPI</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />
                        <span className="ml-2">Netbanking</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <span className="ml-2">Cash on Delivery</span>
                      </label>
                    </div>

                    {/* Card form */}
                    {paymentMethod === 'card' && (
                      <div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI form */}
                    {paymentMethod === 'upi' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input id="upiId" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="example@upi" />
                        </div>
                        <div>
                          <Label>UPI QR</Label>
                          <div className="border rounded p-4 flex items-center justify-center h-40 bg-muted/10 flex-col">
                            <img src={upiQrDataUri} alt="UPI QR" className="w-28 h-28 object-contain mb-2" />
                            <div className="text-sm text-muted-foreground">{upiId ? `UPI ID: ${upiId}` : 'Scan QR to pay or enter UPI ID'}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Netbanking form */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="bank">Select Bank</Label>
                          <select id="bank" className="w-full border rounded p-2" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                            <option value="">-- Select Bank --</option>
                            <option>State Bank of India</option>
                            <option>HDFC Bank</option>
                            <option>ICICI Bank</option>
                            <option>Axis Bank</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" value={netAccountNumber} onChange={(e) => setNetAccountNumber(e.target.value)} placeholder="Enter account number" />
                          </div>
                          <div>
                            <Label htmlFor="ifsc">IFSC Code</Label>
                            <Input id="ifsc" value={netIfsc} onChange={(e) => setNetIfsc(e.target.value)} placeholder="IFSC e.g., SBIN0000123" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COD info */}
                    {paymentMethod === 'cod' && (
                      <div className="text-sm text-muted-foreground">Pay with cash to the delivery agent upon receipt.</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                Place Order
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
