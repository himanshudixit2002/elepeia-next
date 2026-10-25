'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductGrid from '@/components/products/ProductGrid';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return null;
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiHeart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 mb-6">Start adding items you love</p>
        <Link href="/shop/new-arrivals">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Clear Wishlist
          </button>
        </div>

        <ProductGrid products={wishlist.map((item) => item.product)} />
      </div>
    </div>
  );
}
