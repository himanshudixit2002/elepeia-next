'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/lib/firebase/orders';
import { formatPrice } from '@/utils/formatters';
import { generateOrderNumber } from '@/utils/formatters';
import { TAX_RATE, SHIPPING_METHODS } from '@/constants';
import { Address } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    name: user?.displayName || '',
    phone: user?.phoneNumber || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to checkout');
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  if (authLoading || !user) {
    return <Loading fullScreen />;
  }

  const subtotal = getCartTotal();
  const shipping = selectedShipping.price;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    if (!shippingAddress.name?.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!shippingAddress.phone?.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!shippingAddress.street?.trim()) {
      toast.error('Please enter your street address');
      return false;
    }
    if (!shippingAddress.city?.trim()) {
      toast.error('Please enter your city');
      return false;
    }
    if (!shippingAddress.state?.trim()) {
      toast.error('Please enter your state');
      return false;
    }
    if (!shippingAddress.zipCode?.trim()) {
      toast.error('Please enter your zip code');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderNumber = generateOrderNumber();
      
      const orderData = {
        userId: user.uid,
        orderNumber,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0],
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: 'card',
        shippingAddress: shippingAddress as Address,
        billingAddress: shippingAddress as Address,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const orderId = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  required
                />
                <Input
                  label="State"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  required
                />
                <Input
                  label="Zip Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                  }
                  required
                />
                <Input
                  label="Country"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Method
              </h2>
              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping.id === method.id}
                        onChange={() => setSelectedShipping(method)}
                        className="mr-3 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(method.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                <Input label="Cardholder Name" placeholder="John Doe" />
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVV" placeholder="123" type="password" maxLength={4} />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="text-sm text-gray-600">
                      {item.quantity}x
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.size} | {item.color}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-3">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                loading={loading}
                className="w-full"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
