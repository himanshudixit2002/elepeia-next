'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_LINKS, SOCIAL_LINKS, SITE_DESCRIPTION } from '@/constants';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import { FaPinterest, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast.success('Successfully subscribed to newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-primary-950 text-primary-300 border-t border-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/assets/logo.png"
                alt="ELEPEIA"
                width={160}
                height={50}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm mb-6 text-primary-400 leading-relaxed">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex space-x-5">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-primary-700 flex items-center justify-center hover:border-gold-600 hover:text-gold-600 transition-all"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-primary-700 flex items-center justify-center hover:border-gold-600 hover:text-gold-600 transition-all"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-primary-700 flex items-center justify-center hover:border-gold-600 hover:text-gold-600 transition-all"
              >
                <FiTwitter size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-primary-700 flex items-center justify-center hover:border-gold-600 hover:text-gold-600 transition-all"
              >
                <FaPinterest size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-primary-700 flex items-center justify-center hover:border-gold-600 hover:text-gold-600 transition-all"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Shop</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Support</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-900 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-primary-500">
            &copy; {new Date().getFullYear()} ELEPEIA. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 sm:mt-0">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary-500 hover:text-gold-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
