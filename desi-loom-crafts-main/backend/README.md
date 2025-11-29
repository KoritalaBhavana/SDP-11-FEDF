# Handloom Backend

Minimal Express + Mongoose backend for the Handloom Heritage frontend.

## Quick start

1. Copy `.env.example` to `.env` and adjust `MONGO_URI` if needed.

2. Install dependencies and run:

```powershell
cd backend
npm install express mongoose cors dotenv bcryptjs
# optionally: npm install -D nodemon
npm run start
```

3. Seed sample products (optional):

```powershell
npm run seed
```

The server will listen on PORT (default 3001) and expose API endpoints under `/api`.

Routes implemented:
- POST /api/users/signup
- POST /api/users/login
- PUT /api/users/:id
- GET /api/products
- POST /api/products
 - GET /api/products/:id
 - PUT /api/products/:id
 - DELETE /api/products/:id
- POST /api/orders
- GET /api/orders/:userId
- GET /api/orders
- GET /api/stats/orders

