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
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" id="nav-brand-logo" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tighter uppercase text-gradient-premium">せい祭</span>
            </Link>

            <div className="hidden md:flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  id={`nav-desktop-link-${item}`}
                  href={NAV_LINKS[item]}
                  className={`text-sm font-bold tracking-wide transition-all ${
                    pathname === NAV_LINKS[item]
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            <button
              id="nav-mobile-menu-toggle"
              className="md:hidden p-2 text-zinc-400 hover:text-white"
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
              className="fixed top-0 right-0 z-50 h-full w-72 bg-zinc-950 border-l border-zinc-800 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-800 shrink-0">
                <span className="text-base font-black tracking-tighter uppercase text-white">せい祭</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
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
                    className={`flex items-center px-6 py-4 text-sm font-bold border-b border-zinc-900 transition-colors ${
                      pathname === NAV_LINKS[item]
                        ? 'text-white bg-zinc-900/60'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900/30'
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
