'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '@/lib/firebase/products';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/formatters';
import { calculateDiscount } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { FiHeart, FiShoppingCart, FiTruck, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProduct(params.id as string);
      if (data) {
        setProduct(data);
        if (data.sizes.length > 0) setSelectedSize(data.sizes[0].name);
        if (data.colors.length > 0) setSelectedColor(data.colors[0].name);
      } else {
        toast.error('Product not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      router.push('/auth/login');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return null;
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                      <span className="bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              {product.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Size: {selectedSize}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    disabled={!size.inStock}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size.name
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : size.inStock
                        ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Color: {selectedColor}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-primary-600 scale-110'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1">
                <FiShoppingCart className="mr-2" />
                Add to Cart
              </Button>
              <button
                onClick={handleWishlistToggle}
                className="px-4 py-2 border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FiHeart
                  size={24}
                  className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiTruck size={20} />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiRefreshCw size={20} />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
