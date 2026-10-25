# ELEPEIA Project Structure

## Complete File Structure

```
Elepeia/
├── .eslintrc.json                      # ESLint configuration
├── .gitignore                          # Git ignore file
├── env.example                         # Environment variables template
├── next.config.js                      # Next.js configuration
├── package.json                        # Project dependencies
├── postcss.config.js                   # PostCSS configuration
├── README.md                           # Project documentation
├── PROJECT_STRUCTURE.md                # This file
├── tailwind.config.ts                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
│
├── public/                             # Static assets (images, fonts, etc.)
│
└── src/                                # Source code
    │
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout with providers
    │   ├── page.tsx                    # Homepage
    │   ├── globals.css                 # Global styles
    │   │
    │   ├── admin/                      # Admin dashboard
    │   │   ├── page.tsx               # Admin dashboard overview
    │   │   ├── orders/
    │   │   │   └── page.tsx           # Order management
    │   │   ├── products/
    │   │   │   └── page.tsx           # Product management
    │   │   └── users/
    │   │       └── page.tsx           # User management
    │   │
    │   ├── auth/                       # Authentication pages
    │   │   ├── login/
    │   │   │   └── page.tsx           # Login page
    │   │   ├── register/
    │   │   │   └── page.tsx           # Registration page
    │   │   └── forgot-password/
    │   │       └── page.tsx           # Password reset
    │   │
    │   ├── cart/                       # Shopping cart
    │   │   └── page.tsx               # Cart page
    │   │
    │   ├── checkout/                   # Checkout flow
    │   │   └── page.tsx               # Checkout page
    │   │
    │   ├── orders/                     # Order pages
    │   │   ├── page.tsx               # Order history
    │   │   └── [id]/
    │   │       └── page.tsx           # Order details
    │   │
    │   ├── products/                   # Product pages
    │   │   └── [id]/
    │   │       └── page.tsx           # Product details
    │   │
    │   ├── profile/                    # User profile
    │   │   └── page.tsx               # Profile page
    │   │
    │   ├── shop/                       # Product catalog
    │   │   └── [category]/
    │   │       └── page.tsx           # Category page
    │   │
    │   └── wishlist/                   # Wishlist
    │       └── page.tsx               # Wishlist page
    │
    ├── components/                     # React components
    │   │
    │   ├── layout/                     # Layout components
    │   │   ├── Navbar.tsx             # Navigation bar
    │   │   └── Footer.tsx             # Footer
    │   │
    │   ├── products/                   # Product components
    │   │   ├── ProductCard.tsx        # Product card component
    │   │   ├── ProductGrid.tsx        # Product grid layout
    │   │   └── ProductFilters.tsx     # Product filters
    │   │
    │   └── ui/                         # Reusable UI components
    │       ├── Button.tsx             # Button component
    │       ├── Input.tsx              # Input component
    │       ├── Modal.tsx              # Modal component
    │       └── Loading.tsx            # Loading spinner
    │
    ├── contexts/                       # React Context providers
    │   ├── AuthContext.tsx            # Authentication context
    │   ├── CartContext.tsx            # Shopping cart context
    │   └── WishlistContext.tsx        # Wishlist context
    │
    ├── hooks/                          # Custom React hooks
    │   ├── useDebounce.ts             # Debounce hook
    │   └── useLocalStorage.ts         # Local storage hook
    │
    ├── lib/                            # Libraries and configurations
    │   └── firebase/                  # Firebase setup
    │       ├── config.ts              # Firebase configuration
    │       ├── auth.ts                # Authentication service
    │       ├── products.ts            # Product service
    │       ├── orders.ts              # Order service
    │       ├── users.ts               # User service
    │       └── reviews.ts             # Review service
    │
    ├── types/                          # TypeScript definitions
    │   └── index.ts                   # All type definitions
    │
    ├── utils/                          # Utility functions
    │   ├── formatters.ts              # Formatting utilities
    │   ├── validators.ts              # Validation utilities
    │   └── helpers.ts                 # Helper functions
    │
    ├── constants/                      # App constants
    │   └── index.ts                   # Global constants
    │
    └── middleware.ts                   # Next.js middleware
```

## Key Features by File

### Pages (App Router)

**Homepage** (`app/page.tsx`)
- Hero section with CTA
- Featured products
- Category showcase
- Newsletter signup

**Authentication** (`app/auth/`)
- Login with email/password and Google
- Registration with validation
- Password reset functionality

**Product Pages** (`app/products/`, `app/shop/`)
- Product listing with filters
- Product detail page with image gallery
- Size and color selection
- Add to cart and wishlist

**Shopping** (`app/cart/`, `app/checkout/`)
- Shopping cart management
- Checkout with shipping address
- Order summary and payment

**User Pages** (`app/profile/`, `app/orders/`)
- User profile management
- Order history and tracking
- Order details view

**Admin Dashboard** (`app/admin/`)
- Dashboard with statistics
- Product management (CRUD)
- Order management and status updates
- User management

### Components

**Layout** (`components/layout/`)
- Responsive navigation with cart/wishlist badges
- Footer with links and newsletter
- Mobile-friendly hamburger menu

**Product Components** (`components/products/`)
- Product card with image, price, badges
- Product grid with loading states
- Filters for size, color, price, sorting

**UI Components** (`components/ui/`)
- Reusable button with variants
- Input field with validation
- Modal dialog
- Loading spinner

### Contexts

**AuthContext** - User authentication state
**CartContext** - Shopping cart management
**WishlistContext** - Wishlist management

### Firebase Services

**auth.ts** - Sign up, sign in, sign out, password reset
**products.ts** - Product CRUD operations, search, filters
**orders.ts** - Order creation, tracking, status updates
**users.ts** - User profile management, addresses
**reviews.ts** - Product reviews (foundation)

### Utils & Helpers

**formatters.ts** - Price, date, number formatting
**validators.ts** - Email, password, phone validation
**helpers.ts** - Common helper functions

## Data Models

### User
- uid, email, displayName, photoURL
- role (user/admin)
- addresses
- phoneNumber

### Product
- name, description, price, compareAtPrice
- category, subcategory
- images, sizes, colors
- stock, featured, trending, newArrival
- tags, rating, reviewCount

### Order
- orderNumber, userId
- items (products with quantity, size, color)
- subtotal, shipping, tax, total
- status, paymentStatus, paymentMethod
- shippingAddress, billingAddress
- trackingNumber, estimatedDelivery

### CartItem
- productId, product
- quantity, size, color
- addedAt

## Environment Variables

Required for Firebase:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Optional for payment:
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY

## Getting Started

1. Install dependencies: `npm install`
2. Setup Firebase project
3. Configure `.env.local` with Firebase credentials
4. Run development server: `npm run dev`
5. Create first admin user in Firebase Console

## Total Files Created: 60+

- Configuration files: 7
- App pages: 18
- Components: 10
- Contexts: 3
- Firebase services: 6
- Types: 1
- Utils: 3
- Constants: 1
- Hooks: 2
- Middleware: 1
