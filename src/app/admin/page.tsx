'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts } from '@/lib/firebase/products';
import { getAllOrders } from '@/lib/firebase/orders';
import { getAllUsers } from '@/lib/firebase/users';
import { formatPrice, formatNumber } from '@/utils/formatters';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiUsers,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, isAdmin]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [products, orders, users] = await Promise.all([
        getProducts(),
        getAllOrders(),
        getAllUsers(),
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const completedOrders = orders.filter(
        (o) => o.status === 'delivered'
      ).length;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        revenueChange: 12.5,
        ordersChange: 8.3,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return <Loading fullScreen />;
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.displayName}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <FiTrendingUp size={16} />
                <span>+{stats.revenueChange}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPrice(stats.totalRevenue)}
            </h3>
            <p className="text-gray-600 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiShoppingBag className="text-blue-600" size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <FiTrendingUp size={16} />
                <span>+{stats.ordersChange}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalOrders)}
            </h3>
            <p className="text-gray-600 text-sm">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiPackage className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalProducts)}
            </h3>
            <p className="text-gray-600 text-sm">Total Products</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiUsers className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalUsers)}
            </h3>
            <p className="text-gray-600 text-sm">Total Users</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/banners">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-luxury transition-all cursor-pointer luxury-card group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gold-100 rounded-lg group-hover:bg-gold-200 transition-colors">
                  <svg className="text-gold-600" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 uppercase tracking-wide">
                    Banners
                  </h3>
                  <p className="text-primary-600 text-xs">
                    Hero banners & media
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Banners
              </Button>
            </div>
          </Link>

          <Link href="/admin/products">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-luxury transition-all cursor-pointer luxury-card group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <FiPackage className="text-purple-600" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 uppercase tracking-wide">
                    Products
                  </h3>
                  <p className="text-primary-600 text-xs">
                    Manage inventory
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Products
              </Button>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-luxury transition-all cursor-pointer luxury-card group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiShoppingBag className="text-blue-600" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 uppercase tracking-wide">
                    Orders
                  </h3>
                  <p className="text-primary-600 text-xs">
                    Customer orders
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Orders
              </Button>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-luxury transition-all cursor-pointer luxury-card group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <FiUsers className="text-orange-600" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 uppercase tracking-wide">
                    Users
                  </h3>
                  <p className="text-primary-600 text-xs">
                    User accounts
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Users
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
