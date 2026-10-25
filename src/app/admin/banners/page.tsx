'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBanners, deleteBanner, updateBanner, type Banner } from '@/lib/firebase/banners';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      loadBanners();
    }
  }, [user, isAdmin]);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, { active: !banner.active });
      toast.success(`Banner ${!banner.active ? 'activated' : 'deactivated'}`);
      loadBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast.error('Failed to update banner');
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete.id);
      toast.success('Banner deleted successfully');
      setDeleteModalOpen(false);
      setBannerToDelete(null);
      loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleReorder = async (banner: Banner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= banners.length) return;

    try {
      await updateBanner(banner.id, { order: newIndex });
      await updateBanner(banners[newIndex].id, { order: currentIndex });
      toast.success('Order updated');
      loadBanners();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to update order');
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
            <h1 className="text-3xl font-display font-bold text-primary-900">
              Hero Banners
            </h1>
            <p className="text-primary-600 mt-2">
              Manage homepage hero banners and promotional content
            </p>
          </div>
          <Button onClick={() => router.push('/admin/banners/new')}>
            <FiPlus className="mr-2" />
            Add Banner
          </Button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden luxury-card"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Preview */}
                <div className="lg:col-span-1">
                  <div className="relative aspect-video bg-primary-100 rounded overflow-hidden">
                    {banner.type === 'image' && banner.imageUrl && (
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {banner.type === 'video' && banner.videoUrl && (
                      <video
                        src={banner.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                      />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {banner.active ? (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary-900 mb-1">
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-primary-600 text-sm">{banner.subtitle}</p>
                      )}
                      {banner.description && (
                        <p className="text-primary-500 text-sm mt-2">
                          {banner.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-primary-500">Order: {banner.order}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-900 text-xs rounded">
                      {banner.type}
                    </span>
                    {banner.link && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs rounded">
                        Has Link
                      </span>
                    )}
                    {banner.buttonText && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs rounded">
                        CTA: {banner.buttonText}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className="flex items-center gap-2 px-4 py-2 border border-primary-300 rounded hover:bg-primary-50 transition-colors text-sm"
                    >
                      {banner.active ? (
                        <>
                          <FiEyeOff size={16} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <FiEye size={16} />
                          Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReorder(banner, 'up')}
                      disabled={index === 0}
                      className="flex items-center gap-2 px-4 py-2 border border-primary-300 rounded hover:bg-primary-50 transition-colors text-sm disabled:opacity-50"
                    >
                      <FiArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleReorder(banner, 'down')}
                      disabled={index === banners.length - 1}
                      className="flex items-center gap-2 px-4 py-2 border border-primary-300 rounded hover:bg-primary-50 transition-colors text-sm disabled:opacity-50"
                    >
                      <FiArrowDown size={16} />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/banners/edit/${banner.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded hover:bg-primary-800 transition-colors text-sm"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setBannerToDelete(banner);
                        setDeleteModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-16">
            <p className="text-primary-500 text-lg mb-6">No banners found</p>
            <Button onClick={() => router.push('/admin/banners/new')}>
              <FiPlus className="mr-2" />
              Create Your First Banner
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Banner"
      >
        <p className="text-primary-600 mb-6">
          Are you sure you want to delete "{bannerToDelete?.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={handleDeleteBanner}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
