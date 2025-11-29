const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/handloom-shop';

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
    image: 'saree-1.jpg',
    description: 'Exquisite Kanchipuram silk saree handwoven with traditional golden zari work.',
    features: ['100% Pure Silk', 'Handwoven Zari Work', 'Traditional Design', 'Dry Clean Only'],
    isHandmade: true,
    rating: 4.8,
    reviews: 124,
    stock: 15
  },
  {
    name: 'Elegant Handloom Cotton Saree - Pastel Stripes',
    price: 5200,
    originalPrice: 6500,
    category: 'Sarees',
    image: 'saree-2.jpg',
    description: 'Lightweight handloom cotton saree with subtle pastel stripes, perfect for daily wear.',
    features: ['Breathable Cotton', 'Handloom Weave', 'Lightweight', 'Machine Washable'],
    isHandmade: true,
    rating: 4.5,
    reviews: 42,
    stock: 20
  },
  {
    name: 'Handloom Cotton Block Print Dress - Indigo Collection',
    price: 3200,
    originalPrice: 4000,
    category: 'Dresses',
    image: 'dress-1.jpg',
    description: 'Beautiful handloom cotton dress featuring traditional block print in indigo.',
    features: ['Organic Cotton', 'Natural Dyes', 'Block Print Design', 'Machine Washable'],
    isHandmade: true,
    rating: 4.6,
    reviews: 89,
    stock: 8
  },
  {
    name: 'Handloom Cotton Dress - Floral Motif',
    price: 2800,
    originalPrice: 3500,
    category: 'Dresses',
    image: 'dress-2.jpg',
    description: 'Comfortable handloom dress with delicate floral motifs.',
    features: ['Soft Cotton', 'Floral Motifs', 'Comfort Fit', 'Machine Washable'],
    isHandmade: true,
    rating: 4.4,
    reviews: 36,
    stock: 12
  },
  {
    name: 'Classic Kurta - Handloom Cotton',
    price: 2200,
    originalPrice: 2800,
    category: 'Kurta',
    image: 'kurta-1.jpg',
    description: 'Traditional handloom kurta made from breathable cotton.',
    features: ['Breathable', 'Handloom Fabric', 'Easy Care'],
    isHandmade: true,
    rating: 4.3,
    reviews: 50,
    stock: 25
  },
  {
    name: 'Elegant Kurti - Block Print',
    price: 1800,
    originalPrice: 2200,
    category: 'Kurti',
    image: 'kurti-1.jpg',
    description: 'Handloom kurti with classic block print patterns.',
    features: ['Lightweight', 'Block Print', 'Machine Washable'],
    isHandmade: true,
    rating: 4.2,
    reviews: 30,
    stock: 18
  },
  {
    name: 'Chiffon Dupatta with Hand Embroidery',
    price: 1500,
    originalPrice: 1800,
    category: 'Dupatta',
    image: 'dupatta-1.jpg',
    description: 'Elegant chiffon dupatta with delicate hand embroidery.',
    features: ['Chiffon', 'Hand Embroidery', 'Lightweight'],
    isHandmade: true,
    rating: 4.1,
    reviews: 19,
    stock: 30
  },
  {
    name: 'Handloom Cotton Shirt - Casual',
    price: 1600,
    originalPrice: 2000,
    category: 'Shirts',
    image: 'shirt-1.jpg',
    description: 'Comfortable handloom cotton shirt for everyday wear.',
    features: ['Casual Fit', 'Breathable Cotton', 'Durable'],
    isHandmade: true,
    rating: 4.0,
    reviews: 15,
    stock: 40
  },
  {
    name: 'Handcrafted Jute Bag - Two Tone',
    price: 900,
    originalPrice: 1200,
    category: 'Bags',
    image: 'bag-1.jpg',
    description: 'Durable handcrafted jute bag with two-tone pattern.',
    features: ['Eco-friendly', 'Sturdy', 'Handmade'],
    isHandmade: true,
    rating: 4.3,
    reviews: 22,
    stock: 50
  },
  {
    name: 'Handcrafted Sling Bag - Tribal Weave',
    price: 1250,
    originalPrice: 1500,
    category: 'Bags',
    image: 'bag-2.jpg',
    description: 'Stylish sling bag with tribal handwoven patterns.',
    features: ['Handwoven', 'Stylish', 'Lightweight'],
    isHandmade: true,
    rating: 4.5,
    reviews: 28,
    stock: 22
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded!');
  process.exit();
}

seed().catch(err => console.error(err));
