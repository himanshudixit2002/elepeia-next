'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/formatters';
import { calculateDiscount } from '@/utils/helpers';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const displayImage = hoveredImage && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`}>
        <div
          className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200 relative"
          onMouseEnter={() => setHoveredImage(true)}
          onMouseLeave={() => setHoveredImage(false)}
        >
          {displayImage && (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className={`object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.newArrival && (
              <span className="bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {user && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <FiHeart
                size={18}
                className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
              />
            </button>
          )}

          {/* Quick Add to Cart */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-full bg-white text-gray-900 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <FiShoppingCart size={18} />
              Quick Add
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500">{product.category}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-xs text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
