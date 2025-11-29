
## *How the Application Works*

This application is a *handloom e-commerce website* called "Handloom Heritage" that showcases and sells authentic Indian handloom products. 


## *Core Frameworks & Libraries*

### *1. Frontend Framework*
- *React 18.3.1* - The main UI library using functional components and hooks
- *TypeScript* - Provides type safety and better development experience
- *Vite* - Modern build tool for fast development and optimized production builds

### *2. Routing & Navigation*
- *React Router DOM 6.30.1* - Handles client-side routing between pages:
  - / - Homepage with product grid
  - /product/:id - Individual product detail pages
  - * - 404 Not Found page

### *3. UI Component Library (shadcn/ui)*
Built on top of *Radix UI primitives* with custom styling:
- *@radix-ui/react-** components for accessibility and functionality
- *Tailwind CSS* for styling and responsive design
- *Lucide React* for consistent iconography

### *4. State Management & Data Fetching*
- *TanStack React Query 5.83.0* - Server state management and caching
- *React Hook Form 7.61.1* - Form handling and validation
- *Zod 3.25.76* - Schema validation for forms

### *5. Styling & Design System*
- *Tailwind CSS* - Utility-first CSS framework
- *tailwindcss-animate* - Pre-built animations
- *class-variance-authority (CVA)* - Type-safe component variants
- *clsx & tailwind-merge* - Conditional class merging

## *Key Features Implementation*

### *Product Catalog System*
typescript
// Mock data structure for products
const mockProducts = [
  {
    id: "1",
    name: "Traditional Kanchipuram Silk Saree",
    price: 12500,
    originalPrice: 15000,
    image: sareeImage,
    category: "Sarees",
    isHandmade: true,
    rating: 4.8,
    reviews: 124
  }
]


### *Dynamic Filtering & Search*
- Category-based filtering through navbar
- Advanced filters in sidebar (price, ratings, handmade status)
- Real-time search functionality
- Responsive filter sidebar that works on mobile and desktop

### *Shopping Cart*
- Add/remove items with quantity control
- Persistent cart state using React state
- Slide-out cart sidebar
- Real-time cart count in header

### *Responsive Design*
- Mobile-first approach with Tailwind's responsive utilities
- Fixed header that doesn't overlap content
- Collapsible filter sidebar on mobile
- Optimized layouts for different screen sizes

## *Project Architecture*


src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation & search
│   ├── ProductCard.tsx # Product display component
│   ├── FilterSidebar.tsx # Product filtering
│   └── CartSidebar.tsx # Shopping cart
├── pages/              # Route components
│   ├── Index.tsx       # Homepage with product grid
│   ├── ProductDetail.tsx # Individual product page
│   └── NotFound.tsx    # 404 page
├── assets/             # Static images
├── hooks/              # Custom React hooks
└── lib/                # Utility functions


## *Development Tools & Build Process*

- *ESLint* - Code linting and formatting
- *TypeScript* - Type checking during development
- *Vite SWC* - Fast compilation using SWC (Speedy Web Compiler)
- *PostCSS & Autoprefixer* - CSS processing and vendor prefixes

## *Notable Features*

1. *Dynamic Header Height*: Uses CSS custom properties to prevent content overlap
2. *Product Rating System*: Star ratings with review counts
3. *Discount Calculations*: Shows original vs sale prices with percentage savings
4. *Stock Management*: Displays availability and stock status
5. *Image Optimization*: Proper aspect ratios and lazy loading
6. *Toast Notifications*: User feedback for cart actions using Sonner

The application follows modern React patterns with hooks, context for global state, and a component-based architecture that's maintainable and scalable. The use of TypeScript ensures type safety, while the shadcn/ui components provide a consistent, accessible design system.
