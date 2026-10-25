'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/firebase/products';
import { getActiveBanners, type Banner } from '@/lib/firebase/banners';
import { Product } from '@/types';
import { SITE_TAGLINE, CATEGORIES } from '@/constants';
import ProductGrid from '@/components/products/ProductGrid';
import { FiArrowRight, FiTruck, FiShield, FiAward, FiClock } from 'react-icons/fi';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, newItems, activeBanners] = await Promise.all([
          getProducts({ featured: true, limitCount: 4 }),
          getProducts({ newArrival: true, limitCount: 8 }),
          getActiveBanners(),
        ]);
        setFeaturedProducts(featured);
        setNewArrivals(newItems);
        setBanners(activeBanners);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];

  return (
    <div>
      {/* Hero Section - Dynamic Banners */}
      {banners.length > 0 && currentBanner ? (
        <section className="relative h-screen overflow-hidden">
          {/* Banner Media */}
          {currentBanner.type === 'image' && currentBanner.imageUrl && (
            <div className="absolute inset-0">
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {currentBanner.type === 'video' && currentBanner.videoUrl && (
            <div className="absolute inset-0">
              <video
                src={currentBanner.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/50 to-transparent"></div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-slide-up">
                <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight">
                  {currentBanner.title}
                </h1>
                {currentBanner.subtitle && (
                  <p className="text-xl md:text-3xl text-gold-300 mb-4 tracking-widest uppercase font-light">
                    {currentBanner.subtitle}
                  </p>
                )}
                {currentBanner.description && (
                  <p className="text-lg md:text-xl text-primary-100 mb-12 max-w-3xl mx-auto font-light">
                    {currentBanner.description}
                  </p>
                )}
                {currentBanner.link && currentBanner.buttonText && (
                  <Link href={currentBanner.link}>
                    <button className="btn-luxury">
                      {currentBanner.buttonText}
                      <FiArrowRight className="inline ml-2" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Banner Navigation Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? 'bg-gold-500 w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        // Default Hero if no banners
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <div className="animate-slide-up">
              <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight">
                ELEPEIA
              </h1>
              <p className="text-xl md:text-3xl text-gold-300 mb-4 tracking-widest uppercase font-light">
                {SITE_TAGLINE}
              </p>
              <p className="text-lg md:text-xl text-primary-100 mb-12 max-w-3xl mx-auto font-light">
                Impeccably crafted menswear for the distinguished gentleman
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/shop/new-arrivals">
                  <button className="btn-luxury">
                    Discover Collection
                    <FiArrowRight className="inline ml-2" />
                  </button>
                </Link>
                <Link href="/shop/all">
                  <button className="btn-luxury-outline border-white text-white hover:bg-white hover:text-primary-900">
                    Shop All
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24 bg-primary-50 border-y border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-primary-200 mb-6 transition-all duration-300 group-hover:border-gold-500 group-hover:shadow-luxury">
                <FiTruck className="text-primary-900" size={28} />
              </div>
              <h3 className="text-sm uppercase tracking-widest font-semibold mb-2 text-primary-900">Complimentary Shipping</h3>
              <p className="text-primary-600 text-sm">On all orders above $250</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-primary-200 mb-6 transition-all duration-300 group-hover:border-gold-500 group-hover:shadow-luxury">
                <FiClock className="text-primary-900" size={28} />
              </div>
              <h3 className="text-sm uppercase tracking-widest font-semibold mb-2 text-primary-900">Lifetime Guarantee</h3>
              <p className="text-primary-600 text-sm">Quality you can trust</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-primary-200 mb-6 transition-all duration-300 group-hover:border-gold-500 group-hover:shadow-luxury">
                <FiShield className="text-primary-900" size={28} />
              </div>
              <h3 className="text-sm uppercase tracking-widest font-semibold mb-2 text-primary-900">Secure Transactions</h3>
              <p className="text-primary-600 text-sm">Your privacy protected</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-primary-200 mb-6 transition-all duration-300 group-hover:border-gold-500 group-hover:shadow-luxury">
                <FiAward className="text-primary-900" size={28} />
              </div>
              <h3 className="text-sm uppercase tracking-widest font-semibold mb-2 text-primary-900">Exceptional Craftsmanship</h3>
              <p className="text-primary-600 text-sm">Italian fabrics & tailoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-gold-600 text-sm uppercase tracking-widest font-semibold mb-4">Signature Collection</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-primary-900 tracking-tight">
                Handpicked For Excellence
              </h2>
              <p className="text-primary-600 text-lg max-w-2xl mx-auto">
                Our most refined pieces, selected for the distinguished gentleman
              </p>
            </div>
            <ProductGrid products={featuredProducts} loading={loading} />
          </div>
        </section>
      )}

      {/* Shop by Category */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4 tracking-tight">
              Explore Our Collections
            </h2>
            <p className="text-primary-600 text-lg max-w-2xl mx-auto">
              Curated selections of the finest menswear, tailored to perfection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.filter(cat => cat.slug !== 'new-arrivals').slice(0, 6).map((category) => (
              <Link 
                key={category.slug}
                href={`/shop/${category.slug}`} 
                className="group relative aspect-[3/4] overflow-hidden bg-primary-100 luxury-card"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-primary-900 opacity-0 group-hover:opacity-10 transition-all duration-500 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-primary-100 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {category.description}
                  </p>
                  <span className="text-gold-400 text-sm uppercase tracking-widest font-medium flex items-center">
                    Explore <FiArrowRight className="ml-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div>
                <p className="text-gold-600 text-sm uppercase tracking-widest font-semibold mb-4">Latest Collection</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-2 text-primary-900 tracking-tight">
                  New Arrivals
                </h2>
                <p className="text-primary-600 text-lg">Discover the season's finest pieces</p>
              </div>
              <Link href="/shop/new-arrivals">
                <button className="btn-luxury-outline mt-6 md:mt-0">
                  View All
                  <FiArrowRight className="inline ml-2" />
                </button>
              </Link>
            </div>
            <ProductGrid products={newArrivals} loading={loading} />
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-24 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Stay Distinguished
          </h2>
          <p className="text-primary-200 mb-10 text-lg">
            Subscribe for exclusive access to new collections and private sales
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 backdrop-blur-sm"
            />
            <button className="btn-luxury bg-gold-600 hover:bg-gold-700 border-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
