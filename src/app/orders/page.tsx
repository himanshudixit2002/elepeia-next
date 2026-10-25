'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders } from '@/lib/firebase/orders';
import { Order } from '@/types';
import { formatPrice, formatShortDate } from '@/utils/formatters';
import { ORDER_STATUS_LABELS } from '@/constants';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { FiPackage } from 'react-icons/fi';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
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

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiPackage size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-600 mb-6">Start shopping to create your first order</p>
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
          My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
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
                  <p className="text-sm text-gray-600">
                    Placed on {formatShortDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.items.length > 4 && (
                  <p className="text-sm text-gray-500 mb-4">
                    +{order.items.length - 4} more items
                  </p>
                )}

                <div className="flex gap-3">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {order.trackingNumber && (
                    <Button variant="ghost" size="sm">
                      Track Package
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
