'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { signOut } from '@/lib/firebase/auth';
import { CATEGORIES } from '@/constants';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiSearch, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiSettings,
  FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      setUserMenuOpen(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navLinks = [
    { name: 'Shop', href: '/shop/all' },
    { name: 'New Arrivals', href: '/shop/new-arrivals' },
  ];

  return (
    <nav className="bg-white border-b border-primary-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="ELEPEIA"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 hover:text-gold-600 relative group ${
                  pathname === link.href ? 'text-gold-600' : 'text-primary-900'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-600 transition-all duration-300 group-hover:w-full ${
                  pathname === link.href ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-primary-900 hover:text-gold-600 transition-colors"
            >
              <FiSearch size={20} />
            </button>

            {user && (
              <Link
                href="/wishlist"
                className="p-2 text-primary-900 hover:text-gold-600 transition-colors relative"
              >
                <FiHeart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            <Link
              href="/cart"
              className="p-2 text-primary-900 hover:text-gold-600 transition-colors relative"
            >
              <FiShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-primary-900 hover:text-gold-600 transition-colors"
                >
                  <FiUser size={20} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-primary-200 shadow-luxury py-2 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-6 py-3 text-sm text-primary-900 hover:bg-primary-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser className="mr-3" />
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-6 py-3 text-sm text-primary-900 hover:bg-primary-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiPackage className="mr-3" />
                      Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-6 py-3 text-sm text-primary-900 hover:bg-primary-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiSettings className="mr-3" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-primary-200 my-2"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-6 py-3 text-sm text-primary-900 hover:bg-primary-50 transition-colors"
                    >
                      <FiLogOut className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs uppercase tracking-widest font-medium text-primary-900 hover:text-gold-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-6 border-t border-primary-200">
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full px-6 py-3 border border-primary-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-primary-900 placeholder-primary-400"
            />
          </div>
        )}

        {/* Mobile Menu */}
        <button
          className="lg:hidden p-2 text-primary-900 hover:text-primary-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-primary-200 shadow-luxury">
            <div className="py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-6 py-3 text-sm uppercase tracking-wider font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary-50 text-gold-600 border-l-4 border-gold-600'
                      : 'text-primary-900 hover:bg-primary-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
