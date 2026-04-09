# Handloom Heritage - Full-Stack E-commerce Platform

A full-stack e-commerce platform for showcasing and selling authentic Indian handloom products, focusing on performance, usability, and scalability.

---

## Overview

Handloom Heritage is a web-based marketplace that connects buyers with traditional Indian handloom products. The platform offers a smooth shopping experience with category-based browsing, product search, and a clean responsive interface.

---

## Features

- Responsive frontend built with React.js and Tailwind CSS for a seamless user experience across devices
- Product search, filtering, and category-based navigation for improved product discovery
- RESTful APIs built with Node.js for managing users, products, and orders
- MongoDB integration for efficient data storage and retrieval
- Optimized UI with fast loading performance

---

## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- TypeScript
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB

---

## Project Structure

```
desi-loom-crafts-main/
├── backend/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- MongoDB (local or Atlas)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KoritalaBhavana/SDP-11-FEDF.git
   cd SDP-11-FEDF/desi-loom-crafts-main
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Configure environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Update the `.env` file with your MongoDB connection string and other required values.

5. Seed the database (optional):
   ```bash
   node backend/seed.js
   ```

6. Start the backend server:
   ```bash
   node backend/server.js
   ```

7. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## MongoDB Setup

Refer to `MONGODB_SETUP.md` in the root of the project for detailed instructions on setting up and connecting MongoDB.

---

## Usage

- Browse products by category (Sarees, Dresses, Men's Kurtas, Men's Shirts, Kurtis, Dupattas, Bags, Accessories)
- Search for specific handloom products using the search bar
- Filter products by category, price, or other attributes
- View product details and add items to cart

---

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

---

## License

This project is developed as part of SDP-11 (Software Development Project).

---

## Team

Developed by Team SDP-11 - FEDF
