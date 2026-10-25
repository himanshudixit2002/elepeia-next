'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createBanner, uploadBannerImage } from '@/lib/firebase/banners';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NewBannerPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    link: '',
    buttonText: '',
    type: 'image' as 'image' | 'video',
    active: true,
    order: 0,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.type === 'image' && !imageFile) {
      toast.error('Please upload an image');
      return;
    }

    if (formData.type === 'video' && !videoFile) {
      toast.error('Please upload a video');
      return;
    }

    setLoading(true);
    try {
      // Create banner first to get ID
      const bannerId = await createBanner({
        ...formData,
        imageUrl: '',
        videoUrl: '',
      });

      // Upload media files
      let imageUrl = '';
      let videoUrl = '';

      if (imageFile) {
        imageUrl = await uploadBannerImage(imageFile, bannerId);
      }

      if (videoFile) {
        videoUrl = await uploadBannerImage(videoFile, bannerId);
      }

      // Update banner with media URLs
      await createBanner({
        ...formData,
        imageUrl,
        videoUrl,
      });

      toast.success('Banner created successfully!');
      router.push('/admin/banners');
    } catch (error) {
      console.error('Error creating banner:', error);
      toast.error('Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Banners
          </button>
          <h1 className="text-3xl font-display font-bold text-primary-900">
            Create New Banner
          </h1>
          <p className="text-primary-600 mt-2">
            Add a new hero banner to your homepage
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-primary-900 mb-3">
              Banner Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="image"
                  checked={formData.type === 'image'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                  className="mr-2"
                />
                <span>Image</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={formData.type === 'video'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                  className="mr-2"
                />
                <span>Video</span>
              </label>
            </div>
          </div>

          {/* Media Upload */}
          {formData.type === 'image' ? (
            <div>
              <label className="block text-sm font-semibold text-primary-900 mb-3">
                Banner Image *
              </label>
              <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-96 mx-auto rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="mx-auto text-primary-400 mb-4" size={48} />
                    <p className="text-primary-600 mb-2">Upload banner image</p>
                    <p className="text-primary-400 text-sm mb-4">Recommended: 1920x1080px</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="btn-luxury cursor-pointer inline-block">
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-primary-900 mb-3">
                Banner Video *
              </label>
              <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center">
                {videoPreview ? (
                  <div className="relative">
                    <video src={videoPreview} controls className="max-h-96 mx-auto rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview('');
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="mx-auto text-primary-400 mb-4" size={48} />
                    <p className="text-primary-600 mb-2">Upload banner video</p>
                    <p className="text-primary-400 text-sm mb-4">MP4 format recommended</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="btn-luxury cursor-pointer inline-block">
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Link URL"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/shop/new-arrivals"
            />
            <Input
              label="Button Text"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              placeholder="Shop Now"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            />
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-semibold text-primary-900">Active</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button type="submit" loading={loading} className="flex-1">
              Create Banner
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
