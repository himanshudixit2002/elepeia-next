# ELEPEIA - Premium Luxury Clothing E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js, React, TypeScript, and Firebase.

## Features

### Customer Features
- **Authentication**: Email/password and Google OAuth sign-in
- **Product Browsing**: Browse by categories (Women, Men, Accessories, New Arrivals, Sale)
- **Advanced Filtering**: Filter products by size, color, price range, and sort options
- **Product Details**: Detailed product pages with multiple images, size/color selection
- **Shopping Cart**: Add, remove, and manage cart items with persistent storage
- **Wishlist**: Save favorite products for later
- **Checkout**: Complete checkout flow with shipping address and payment
- **Order Management**: View order history and track order status
- **User Profile**: Manage account details and shipping addresses

### Admin Features
- **Dashboard**: Overview of revenue, orders, products, and users
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View all orders, update order status, and track shipments
- **User Management**: View and manage all user accounts

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Firebase Firestore for real-time data sync
- **Secure Authentication**: Firebase Authentication with role-based access
- **Image Storage**: Firebase Storage for product images
- **Type Safety**: Full TypeScript implementation
- **Context API**: Global state management for auth, cart, and wishlist
- **SEO Optimized**: Next.js App Router for better SEO
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Toast notifications for user feedback

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   │   ├── orders/       # Order management
│   │   ├── products/     # Product management
│   │   └── users/        # User management
│   ├── auth/             # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── orders/           # Order history
│   ├── products/         # Product details
│   ├── profile/          # User profile
│   ├── shop/             # Product catalog
│   ├── wishlist/         # Wishlist
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── products/         # Product-related components
│   └── ui/               # Reusable UI components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── lib/                   # Libraries and configurations
│   └── firebase/         # Firebase setup and services
│       ├── config.ts
│       ├── auth.ts
│       ├── products.ts
│       ├── orders.ts
│       └── users.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
└── constants/             # App constants
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Elepeia
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Set up Firebase Storage
   - Get your Firebase configuration

4. Configure environment variables:
   - Copy `env.example` to `.env.local`
   - Fill in your Firebase credentials and other API keys

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

### Firestore Collections

Create the following collections in Firestore:

- `users`: User profiles and data
- `products`: Product catalog
- `orders`: Order information
- `reviews`: Product reviews (optional)

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Admin Access

To make a user an admin:

1. Create a user account through the app
2. Go to Firebase Console → Firestore
3. Find the user document in the `users` collection
4. Update the `role` field to `"admin"`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted

## Environment Variables

Required environment variables (see `env.example`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features to Implement (Future)

- Payment integration (Stripe)
- Product reviews and ratings
- Email notifications
- Advanced analytics
- Social media sharing
- Multi-language support
- Dark mode
- Progressive Web App (PWA)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.
