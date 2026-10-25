'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getOrder } from '@/lib/firebase/orders';
import { Order } from '@/types';
import { formatPrice, formatDateTime } from '@/utils/formatters';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/constants';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { FiPackage, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadOrder();
    }
  }, [user, params.id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrder(params.id as string);
      if (data) {
        if (data.userId !== user?.uid && user?.role !== 'admin') {
          toast.error('Unauthorized');
          router.push('/orders');
          return;
        }
        setOrder(data);
      } else {
        toast.error('Order not found');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <Loading fullScreen />;
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Orders
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded ${
                order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiPackage className="mr-2" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2" />
                Shipping Address
              </h2>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Tracking */}
            {order.trackingNumber && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTruck className="mr-2" />
                  Tracking Information
                </h2>
                <p className="text-gray-600 mb-4">
                  Tracking Number:{' '}
                  <span className="font-mono font-semibold text-gray-900">
                    {order.trackingNumber}
                  </span>
                </p>
                <Button variant="outline">Track Package</Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <FiCreditCard className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Payment Method
                  </span>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {order.paymentMethod}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </span>
              </div>

              {order.estimatedDelivery && (
                <div className="border-t pt-6 mt-6">
                  <p className="text-sm text-gray-600">
                    Estimated Delivery
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(order.estimatedDelivery)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
