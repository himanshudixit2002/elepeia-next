export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: Size[];
  colors: Color[];
  stock: number;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  reviewCount?: number;
  materials?: string[];
  careInstructions?: string[];
}

export interface Size {
  name: string;
  inStock: boolean;
  stock: number;
}

export interface Color {
  name: string;
  hex: string;
  images: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  addedAt: Date;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  active: boolean;
  order: number;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribedAt: Date;
  active: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueChange: number;
  ordersChange: number;
  recentOrders: Order[];
  topProducts: Product[];
}
