import { Product } from '@/types';

export const calculateDiscount = (price: number, compareAtPrice?: number): number => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export const isOnSale = (product: Product): boolean => {
  return !!product.compareAtPrice && product.compareAtPrice > product.price;
};

export const getProductStock = (product: Product): number => {
  return product.sizes.reduce((total, size) => total + size.stock, 0);
};

export const isProductInStock = (
  product: Product,
  size?: string,
  color?: string
): boolean => {
  if (!size) {
    return getProductStock(product) > 0;
  }

  const sizeObj = product.sizes.find((s) => s.name === size);
  return sizeObj ? sizeObj.inStock : false;
};

export const getAvailableSizes = (product: Product): string[] => {
  return product.sizes.filter((s) => s.inStock).map((s) => s.name);
};

export const getProductImages = (
  product: Product,
  color?: string
): string[] => {
  if (color) {
    const colorObj = product.colors.find((c) => c.name === color);
    if (colorObj && colorObj.images.length > 0) {
      return colorObj.images;
    }
  }
  return product.images;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const scrollToTop = (smooth: boolean = true): void => {
  if (isBrowser()) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isBrowser()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};
