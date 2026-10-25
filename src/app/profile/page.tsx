'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/firebase/users';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return <Loading fullScreen />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber || undefined,
      });
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          My Profile
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser size={32} className="text-primary-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.displayName}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-600 rounded">
                {user.role === 'admin' ? 'Admin' : 'Customer'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />

            <div className="flex gap-4">
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/orders')}
              >
                View Orders
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
