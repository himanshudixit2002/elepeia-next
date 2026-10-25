'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProducts } from '@/lib/firebase/products';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import { FiFilter, FiX } from 'react-icons/fi';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    loadProducts();
  }, [category]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedSizes, selectedColors, priceRange, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        category: category === 'new-arrivals' ? undefined : category,
        newArrival: category === 'new-arrivals' ? true : undefined,
      });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s.name) && s.inStock)
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: Infinity });
  };

  const getCategoryTitle = () => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            {getCategoryTitle()}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary-600 text-white p-4 rounded-full shadow-lg"
          >
            {filtersOpen ? <FiX size={24} /> : <FiFilter size={24} />}
          </button>

          {/* Filters Sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white p-6 overflow-y-auto transition-transform lg:translate-x-0 ${
              filtersOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <ProductFilters
              selectedCategory={category}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              priceRange={priceRange}
              sortBy={sortBy}
              onSizeChange={handleSizeChange}
              onColorChange={handleColorChange}
              onPriceRangeChange={setPriceRange}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
