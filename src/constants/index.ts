export const SITE_NAME = 'ELEPEIA';
export const SITE_DESCRIPTION = 'Premium Menswear for the Distinguished Gentleman';
export const SITE_TAGLINE = 'Elevated Essentials. Timeless Elegance.';

export const CATEGORIES = [
  { 
    name: 'Shirts', 
    slug: 'shirts', 
    description: 'Impeccably tailored shirts',
    subcategories: ['Dress Shirts', 'Casual Shirts', 'Oxford Shirts', 'Linen Shirts'] 
  },
  { 
    name: 'Suits & Blazers', 
    slug: 'suits', 
    description: 'Bespoke sophistication',
    subcategories: ['Two-Piece Suits', 'Three-Piece Suits', 'Blazers', 'Tuxedos'] 
  },
  { 
    name: 'Trousers', 
    slug: 'trousers', 
    description: 'Perfect fit, refined comfort',
    subcategories: ['Dress Pants', 'Chinos', 'Denim', 'Casual Trousers'] 
  },
  { 
    name: 'Outerwear', 
    slug: 'outerwear', 
    description: 'Statement pieces for every season',
    subcategories: ['Overcoats', 'Leather Jackets', 'Blazers', 'Peacoats'] 
  },
  { 
    name: 'Accessories', 
    slug: 'accessories', 
    description: 'The finishing touch',
    subcategories: ['Ties', 'Watches', 'Belts', 'Cufflinks', 'Leather Goods', 'Shoes'] 
  },
  { 
    name: 'New Arrivals', 
    slug: 'new-arrivals', 
    description: 'Discover our latest collection',
    subcategories: [] 
  },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Highest Rated', value: 'rating' },
];

export const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
];

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
};

export const SHIPPING_METHODS = [
  { 
    id: 'standard', 
    name: 'Standard Shipping', 
    description: '5-7 business days', 
    price: 9.99 
  },
  { 
    id: 'express', 
    name: 'Express Shipping', 
    description: '2-3 business days', 
    price: 19.99 
  },
  { 
    id: 'overnight', 
    name: 'Overnight Shipping', 
    description: '1 business day', 
    price: 39.99 
  },
];

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 100;

export const FOOTER_LINKS = {
  shop: [
    { name: 'Shirts', href: '/shop/shirts' },
    { name: 'Suits & Blazers', href: '/shop/suits' },
    { name: 'Trousers', href: '/shop/trousers' },
    { name: 'Outerwear', href: '/shop/outerwear' },
    { name: 'Accessories', href: '/shop/accessories' },
    { name: 'New Arrivals', href: '/shop/new-arrivals' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Track Order', href: '/track-order' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/elepeia',
  instagram: 'https://instagram.com/elepeia',
  twitter: 'https://twitter.com/elepeia',
  pinterest: 'https://pinterest.com/elepeia',
  youtube: 'https://youtube.com/elepeia',
};
