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
    <>
      <nav className="sticky top-0 z-50 bg-[var(--color-bg-dark)]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" id="nav-brand-logo" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-blue-dark)] flex items-center justify-center shadow-[0_0_10px_rgba(0,225,255,0.4)] group-hover:shadow-[0_0_15px_rgba(0,225,255,0.6)] transition-shadow">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-gradient-premium">せい杯</span>
            </Link>

            <div className="hidden md:flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  id={`nav-desktop-link-${item}`}
                  href={NAV_LINKS[item]}
                  className={`text-sm font-bold tracking-wide transition-all ${
                    pathname === NAV_LINKS[item]
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-blue)] to-blue-300 drop-shadow-[0_0_8px_rgba(0,225,255,0.4)]'
                      : 'text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            <button
              id="nav-mobile-menu-toggle"
              className="md:hidden p-2 text-gray-400"
              onClick={() => setIsMenuOpen(true)}
              aria-label="メニューを開く"
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay + panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 背景オーバーレイ */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* サイドドロワー */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-[var(--color-bg-dark)] border-l border-white/10 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
                <span className="text-base font-black tracking-tighter uppercase">せい杯</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="メニューを閉じる"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item}
                    id={`nav-mobile-link-${item}`}
                    href={NAV_LINKS[item]}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b border-white/5 transition-colors ${
                      pathname === NAV_LINKS[item]
                        ? 'text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
