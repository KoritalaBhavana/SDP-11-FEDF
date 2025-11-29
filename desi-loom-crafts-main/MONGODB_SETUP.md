# MongoDB Local Integration Guide

This guide explains how to integrate your Handloom Heritage app with a local MongoDB database.

## Architecture

```
React Frontend (Lovable) → Backend API (Node.js/Express) → MongoDB (Local)
```

## Prerequisites

- Node.js installed (v16+)
- MongoDB installed locally OR Docker

## Step 1: Install MongoDB

### Option A: Download MongoDB
1. Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download and install MongoDB Community Edition
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

### Option B: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 2: Create Backend Server

Create a new directory outside your Lovable project:

```bash
mkdir handloom-backend
cd handloom-backend
npm init -y
npm install express mongoose cors dotenv bcryptjs
```

Create `server.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/handloom-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  description: String,
  features: [String],
  isHandmade: Boolean,
  rating: Number,
  reviews: Number,
  stock: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  shippingAddress: Object,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// API Routes

// User Authentication
app.post('/api/users/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    // Don't send password back
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product APIs
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order APIs
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Stats
app.get('/api/stats/orders', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('MongoDB connected to handloom-shop database');
});
```

## Step 3: Seed Initial Product Data (Optional)

Create `seed.js` in your backend folder:

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/handloom-shop');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  description: String,
  features: [String],
  isHandmade: Boolean,
  rating: Number,
  reviews: Number,
  stock: Number
});

const Product = mongoose.model('Product', ProductSchema);

const products = [
  {
    name: 'Traditional Kanchipuram Silk Saree with Golden Zari Work',
    price: 12500,
    originalPrice: 15000,
    category: 'Sarees',
    image: '/src/assets/saree-1.jpg',
    description: 'Exquisite Kanchipuram silk saree handwoven with traditional golden zari work. This masterpiece showcases the rich heritage of South Indian craftsmanship with intricate patterns that have been passed down through generations.',
    features: ['100% Pure Silk', 'Handwoven Zari Work', 'Traditional Design', 'Dry Clean Only'],
    isHandmade: true,
    rating: 4.8,
    reviews: 124,
    stock: 15
  },
  {
    name: 'Handloom Cotton Block Print Dress - Indigo Collection',
    price: 3200,
    originalPrice: 4000,
    category: 'Dresses',
    image: '/src/assets/dress-1.jpg',
    description: 'Beautiful handloom cotton dress featuring traditional block print in stunning indigo color. Made from premium cotton with eco-friendly natural dyes.',
    features: ['Organic Cotton', 'Natural Dyes', 'Block Print Design', 'Machine Washable'],
    isHandmade: true,
    rating: 4.6,
    reviews: 89,
    stock: 8
  },
  {
    name: 'Pure Cotton Handwoven Kurta for Men - Natural Beige',
    price: 2800,
    category: "Men's Shirts",
    image: '/src/assets/shirt-1.jpg',
    description: 'Comfortable and elegant handwoven cotton kurta in natural beige. Perfect for casual and semi-formal occasions with its breathable fabric and classic design.',
    features: ['100% Cotton', 'Handwoven Fabric', 'Comfortable Fit', 'Machine Washable'],
    isHandmade: true,
    rating: 4.7,
    reviews: 56,
    stock: 12
  },
  {
    name: 'Handcrafted Jute Tote Bag with Traditional Motifs',
    price: 1200,
    originalPrice: 1500,
    category: 'Bags',
    image: '/src/assets/bag-1.jpg',
    description: 'Eco-friendly jute tote bag with beautiful traditional motifs. Spacious and durable, perfect for daily use while supporting sustainable fashion.',
    features: ['Eco-friendly Jute', 'Traditional Motifs', 'Spacious Design', 'Durable Construction'],
    isHandmade: true,
    rating: 4.5,
    reviews: 73,
    stock: 25
  },
  {
    name: 'Banarasi Silk Saree - Wedding Collection',
    price: 18000,
    originalPrice: 22000,
    category: 'Sarees',
    image: '/src/assets/saree-2.jpg',
    description: 'Luxurious Banarasi silk saree from our exclusive wedding collection. Features intricate gold and silver zari work that makes it perfect for special occasions.',
    features: ['Pure Banarasi Silk', 'Gold & Silver Zari', 'Wedding Collection', 'Gift Wrapped'],
    isHandmade: true,
    rating: 4.9,
    reviews: 156,
    stock: 5
  },
  {
    name: 'Handloom Cotton Palazzo Dress Set',
    price: 2800,
    category: 'Dresses',
    image: '/src/assets/dress-2.jpg',
    description: 'Comfortable handloom cotton palazzo dress set perfect for summer. The flowing silhouette and breathable fabric make it ideal for warm weather.',
    features: ['Handloom Cotton', 'Palazzo Style', 'Summer Wear', 'Comfortable Fit'],
    isHandmade: true,
    rating: 4.4,
    reviews: 67,
    stock: 10
  },
  {
    name: 'Traditional White Cotton Kurta - Festival Edition',
    price: 3500,
    originalPrice: 4200,
    category: "Men's Kurtas",
    image: '/src/assets/kurta-1.jpg',
    description: 'Classic white cotton kurta from our festival edition. Features subtle embroidery and premium cotton fabric, perfect for celebrations and formal occasions.',
    features: ['Premium Cotton', 'Subtle Embroidery', 'Festival Edition', 'Classic Design'],
    isHandmade: true,
    rating: 4.6,
    reviews: 89,
    stock: 7
  },
  {
    name: 'Handwoven Silk Dupatta with Zari Border',
    price: 2200,
    originalPrice: 2800,
    category: 'Dupattas',
    image: '/src/assets/dupatta-1.jpg',
    description: 'Elegant handwoven silk dupatta with traditional zari border work. Perfect accessory to complement ethnic wear with its rich texture and beautiful design.',
    features: ['Pure Silk', 'Zari Border', 'Handwoven', 'Versatile Styling'],
    isHandmade: true,
    rating: 4.7,
    reviews: 112,
    stock: 18
  },
  {
    name: 'Block Print Cotton Kurti - Summer Collection',
    price: 1800,
    category: 'Kurtis',
    image: '/src/assets/kurti-1.jpg',
    description: 'Refreshing block print cotton kurti from our summer collection. Features vibrant colors and comfortable cotton fabric perfect for everyday wear.',
    features: ['Block Print Design', 'Summer Collection', 'Cotton Fabric', 'Vibrant Colors'],
    isHandmade: true,
    rating: 4.5,
    reviews: 95,
    stock: 20
  },
  {
    name: 'Handcrafted Leather Crossbody Bag',
    price: 2500,
    originalPrice: 3200,
    category: 'Bags',
    image: '/src/assets/bag-2.jpg',
    description: 'Stylish handcrafted leather crossbody bag with traditional craftsmanship. Features multiple compartments and adjustable strap for convenience.',
    features: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap', 'Handcrafted'],
    isHandmade: true,
    rating: 4.8,
    reviews: 67,
    stock: 14
  }
];

async function seed() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded!');
  process.exit();
}

seed();
```

Run: `node seed.js`

## Step 4: Run Both Applications

### Terminal 1 - Backend:
```bash
cd handloom-backend
node server.js
```
Backend will run on http://localhost:3001

### Terminal 2 - Frontend (Lovable):
The Lovable app already has the API integration configured in `src/lib/api.ts`.
Just run your Lovable preview as normal.

## MongoDB Collections Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String,
  stock: Number
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: String,
  shippingAddress: Object,
  createdAt: Date
}
```

## Testing with MongoDB Compass

1. Download MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. View your `handloom-shop` database
4. Browse collections: users, products, orders

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/signup | Create new user |
| POST | /api/users/login | Login user |
| GET | /api/products | Get all products |
| POST | /api/products | Create product |
| POST | /api/orders | Create order |
| GET | /api/orders/:userId | Get user orders |
| GET | /api/orders | Get all orders |
| GET | /api/stats/orders | Get order statistics |

## Security Notes

⚠️ This is a development setup. For production:
- Use environment variables for MongoDB connection
- Implement JWT tokens instead of simple auth
- Add rate limiting
- Use HTTPS
- Add input validation (express-validator)
- Implement proper error handling
- Add authentication middleware

## Troubleshooting

**CORS errors?**
- Make sure backend has `cors()` middleware enabled

**Connection refused?**
- Check MongoDB is running: `mongosh` should connect
- Verify port 3001 is not in use

**Can't see data?**
- Check browser console for API errors
- Verify backend logs for MongoDB connection
- Use MongoDB Compass to verify data exists
