# Handloom Heritage - Full-Stack E-Commerce Platform

### React.js | Node.js | MongoDB | Tailwind CSS | TypeScript | Vite

---

## 1. Project Overview

Handloom Heritage is a full-stack e-commerce web application built to showcase and sell authentic Indian handloom products crafted using traditional techniques. The platform serves as a digital marketplace that connects artisans and sellers with buyers who appreciate handmade, culturally significant textiles.

The project was developed with a focus on three core principles:

- **Performance** - Fast load times, optimized assets, and efficient API calls to ensure a smooth browsing and shopping experience
- **Usability** - Intuitive navigation, responsive design, and accessible UI components so users on any device can shop effortlessly
- **Scalability** - A modular codebase and a flexible MongoDB schema that can easily accommodate new product categories, users, and features

---

## 2. Purpose and Use Case

Indian handloom weaving is one of the oldest crafts in the world. However, artisans often struggle to reach customers beyond their local markets. Handloom Heritage solves this problem by providing:

- A dedicated online storefront for handloom products including Sarees, Dresses, Men's Kurtas, Men's Shirts, Kurtis, Dupattas, Bags, and Accessories
- A searchable, filterable catalog so shoppers can quickly find products they want without scrolling through hundreds of items
- Category-based navigation that mirrors the way buyers naturally think about clothing and textiles
- A backend management system to track products, manage user accounts, and process orders

The target audience includes individual buyers looking for authentic Indian textiles, gifting customers, and fashion-conscious users interested in traditional craftsmanship.

---

## 3. Features and Functionality

### 3.1 Product Browsing and Discovery

The core shopping experience is designed to be effortless:

- **Category Navigation** - A top navigation bar lets users filter products by category: Sarees, Dresses, Men's Kurtas, Men's Shirts, Kurtis, Dupattas, Bags, and Accessories
- **Search Bar** - A prominent search box allows users to type keywords and instantly find matching products from the catalog
- **Filter and Sort** - Users can narrow down results by price, category, or other attributes to find exactly what they need
- **Product Cards** - Each product is displayed with an image, name, price, category badge (e.g., Handmade), and discount percentage if applicable
- **Product Count** - The results page shows the number of matching products found, giving users confidence in the breadth of the catalog

### 3.2 Product Detail View

- Detailed product pages display full descriptions, material information, sizing details, and high-quality images
- Users can add items to a wishlist or shopping cart directly from the detail page

### 3.3 User Authentication and Accounts

- Users can register and log in securely
- Account management allows users to view order history, manage saved addresses, and update profile information
- Authentication is handled through the backend using secure token-based mechanisms

### 3.4 Shopping Cart and Orders

- Users can add multiple items to a cart and review them before checkout
- Order management APIs handle placing, tracking, and managing orders in the database
- The backend supports full CRUD operations for orders so admins can update order statuses

### 3.5 Responsive UI

- The frontend is fully responsive and works seamlessly across desktop, tablet, and mobile screens
- Tailwind CSS utility classes are used throughout for consistent spacing, typography, and color theming
- Optimized loading performance ensures the page renders quickly even on slower connections

---

## 4. Technology Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React.js | Component-based UI library for building interactive pages |
| Frontend | TypeScript | Static typing for safer, more maintainable code |
| Frontend | Tailwind CSS | Utility-first CSS framework for responsive styling |
| Frontend | Vite | Fast build tool and development server |
| Backend | Node.js | JavaScript runtime for server-side logic |
| Backend | Express.js | Web framework for building RESTful APIs |
| Database | MongoDB | NoSQL database for flexible product and user data |
| Tooling | ESLint | Code linting to enforce consistent code quality |
| Tooling | PostCSS | CSS transformation and plugin processing |

---

## 5. Architecture and System Design

### 5.1 Presentation Layer (Frontend)

The frontend is a Single Page Application (SPA) built with React and TypeScript. It communicates with the backend entirely through HTTP REST API calls. The UI is organized into reusable components (product cards, navbar, category filters, search bar) that are composed into full pages.

### 5.2 Application Layer (Backend)

The backend is a Node.js + Express.js server that exposes a RESTful API. It handles:

- User authentication and session management
- Product CRUD operations (Create, Read, Update, Delete)
- Order processing and management
- Search and filtering logic
- Data validation and error handling

### 5.3 Data Layer (MongoDB)

MongoDB stores all application data in flexible JSON-like documents. The main collections are:

- **Users** - Stores user credentials, profile info, and roles
- **Products** - Stores product name, category, price, images, description, and stock info
- **Orders** - Stores order details, user references, product lists, and order status

---

## 6. Project Structure

```
desi-loom-crafts-main/
├── backend/
│   ├── server.js              # Express server entry point, routes, middleware
│   ├── seed.js                # Script to populate MongoDB with sample data
│   ├── package.json           # Backend dependencies (express, mongoose, etc.)
│   └── .env.example           # Environment variable template
├── public/
│   ├── placeholder.svg        # Default image placeholder
│   └── robots.txt             # SEO crawler instructions
├── src/                       # React frontend source code
│   ├── components/            # Reusable UI components (navbar, product cards, filters)
│   ├── pages/                 # Route-level page components (Home, Products, Cart)
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Helper functions and API client
├── index.html                 # HTML entry point
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript compiler options
├── postcss.config.js          # PostCSS plugins
├── eslint.config.js           # ESLint rules
├── bun.lockb                  # Bun package lock file
├── MONGODB_SETUP.md           # MongoDB connection guide
└── README.md                  # This file
```

---

## 7. API Endpoints

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user account |
| POST | `/api/users/login` | Authenticate user and return token |
| GET | `/api/users/profile` | Retrieve logged-in user's profile |
| PUT | `/api/users/profile` | Update user profile information |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products (supports search and filter queries) |
| GET | `/api/products/:id` | Fetch a single product by ID |
| POST | `/api/products` | Add a new product (admin only) |
| PUT | `/api/products/:id` | Update product details (admin only) |
| DELETE | `/api/products/:id` | Delete a product (admin only) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/:id` | Get order details by ID |
| GET | `/api/orders/myorders` | Get all orders for the logged-in user |
| PUT | `/api/orders/:id/status` | Update order status (admin only) |

---

## 8. Database Schema

### User Schema

```js
{
  name: String,
  email: String,       // unique
  password: String,    // hashed
  role: String,        // "user" or "admin"
  createdAt: Date
}
```

### Product Schema

```js
{
  name: String,
  category: String,
  price: Number,
  discountPercent: Number,
  description: String,
  images: [String],
  isHandmade: Boolean,
  stock: Number,
  createdAt: Date
}
```

### Order Schema

```js
{
  user: ObjectId,           // ref: User
  items: [
    { product: ObjectId, qty: Number }
  ],
  totalPrice: Number,
  status: String,
  shippingAddress: Object,
  createdAt: Date
}
```

---

## 9. Installation and Setup

### 9.1 Prerequisites

- Node.js v18 or higher
- MongoDB (local installation or MongoDB Atlas free tier)
- npm or bun package manager
- Git

### 9.2 Clone the Repository

```bash
git clone https://github.com/KoritalaBhavana/SDP-11-FEDF.git
cd SDP-11-FEDF/desi-loom-crafts-main
```

### 9.3 Configure Environment Variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in the following values:

```
MONGO_URI=mongodb://localhost:27017/handloom_heritage
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 9.4 Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 9.5 Seed the Database

```bash
node backend/seed.js
```

This populates MongoDB with sample products across all categories so the storefront is ready to browse immediately.

### 9.6 Run the Application

```bash
# Start the backend server
node backend/server.js

# In a new terminal, start the frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

---

## 10. MongoDB Setup

Refer to `MONGODB_SETUP.md` in the root of the project for detailed instructions on setting up and connecting to MongoDB.

---

## 11. Future Enhancements

- Payment gateway integration (Razorpay or Stripe) for live transactions
- Admin dashboard with sales analytics and inventory management
- Product reviews and ratings system
- Email notifications for order confirmations and shipping updates
- Wishlist persistence across sessions
- Multi-language support for regional buyers
- PWA (Progressive Web App) support for offline browsing

---

## 12. Team

Developed by **Team SDP-11 - FEDF** as part of the Software Development Project curriculum.

---

## 13. License

This project is developed for educational purposes under the SDP-11 academic project guidelines.
