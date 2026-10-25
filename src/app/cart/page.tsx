'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '@/constants';
import Button from '@/components/ui/Button';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">Add some items to get started</p>
        <Link href="/shop/new-arrivals">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex gap-6">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-200">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.size, item.color)
                        }
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-sm text-primary-600">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
                    shipping!
                  </p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push('/checkout')}
                className="w-full mb-4"
              >
                Proceed to Checkout
              </Button>

              <Link href="/shop/new-arrivals">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
