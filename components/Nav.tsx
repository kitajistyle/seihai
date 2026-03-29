'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, NAV_LINKS } from '@/lib/data';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-dark)]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" id="nav-brand-logo" className="flex items-center">
            <span className="text-xl font-bold tracking-tighter uppercase">せい杯</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                id={`nav-desktop-link-${item}`}
                href={NAV_LINKS[item]}
                className={`text-sm font-medium transition-colors ${
                  pathname === NAV_LINKS[item]
                    ? 'text-[var(--color-brand-blue)]'
                    : 'text-gray-400 hover:text-[var(--color-brand-blue)]'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          <button
            id="nav-mobile-menu-toggle"
            className="md:hidden p-2 text-gray-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--color-bg-dark)] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  id={`nav-mobile-link-${item}`}
                  href={NAV_LINKS[item]}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-[var(--color-brand-blue)] hover:bg-white/5 rounded-md"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
