'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist.map((item: WishlistItem) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        })));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } else {
      localStorage.removeItem('wishlist');
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.productId === product.id);
      if (exists) {
        toast.error('Already in wishlist');
        return prevWishlist;
      }

      toast.success('Added to wishlist');
      return [
        ...prevWishlist,
        {
          productId: product.id,
          product,
          addedAt: new Date(),
        },
      ];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.productId !== productId)
    );
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
