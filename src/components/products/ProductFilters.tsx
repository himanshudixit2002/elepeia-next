'use client';

import React from 'react';
import { SIZES, PRICE_RANGES, SORT_OPTIONS } from '@/constants';
import { FiX } from 'react-icons/fi';

interface ProductFiltersProps {
  selectedCategory?: string;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: { min: number; max: number };
  sortBy: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#8B5CF6' },
];

export default function ProductFilters({
  selectedCategory,
  selectedSizes,
  selectedColors,
  priceRange,
  sortBy,
  onSizeChange,
  onColorChange,
  onPriceRangeChange,
  onSortChange,
  onClearFilters,
}: ProductFiltersProps) {
  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < Infinity;

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <FiX size={16} />
          Clear All Filters
        </button>
      )}

      {/* Size Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.name)}
              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                selectedColors.includes(color.name)
                  ? 'border-primary-600 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColors.includes(color.name) && (
                <span className="absolute inset-0 flex items-center justify-center text-white">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={
                  priceRange.min === range.min && priceRange.max === range.max
                }
                onChange={() => onPriceRangeChange(range)}
                className="mr-2 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
