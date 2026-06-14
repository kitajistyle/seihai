'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FaXTwitter } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16 relative overflow-hidden">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="absolute bottom-0 right-6 md:right-16 pointer-events-none opacity-70"
      >
        <Image src="/shiba-character.png" alt="キャラクター" width={100} height={130} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter uppercase text-gradient-premium tracking-widest">EVERY1 FES</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { name: 'Twitter', href: 'https://x.com/sei_every1?s=21&t=hxjk70Akf81vhMIHEAZyIQ', icon: FaXTwitter, bgColor: 'group-hover:bg-[var(--color-brand-blue)]/10', textColor: 'group-hover:text-[var(--color-brand-blue)]', glow: 'group-hover:shadow-[0_0_20px_rgba(2,132,199,0.15)]' },
            ].map((link) => {
              const content = (
                <motion.div
                  whileHover={{ y: -8, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-[var(--color-brand-blue)]/5 flex items-center justify-center border border-[var(--color-brand-blue)]/10 transition-all duration-300 ${link.bgColor} ${link.glow} group-hover:border-[var(--color-brand-blue)]`}>
                    <link.icon className={`w-6 h-6 transition-colors duration-300 text-gray-600 ${link.textColor}`} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition-colors duration-300 ${link.textColor}`}>
                    {link.name}
                  </span>
                </motion.div>
              );

              return (
                <div key={link.name}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <Link href={link.href}>
                      {content}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
            <p className="text-gray-500 text-xs mt-4">
              © 2026 EVERY1 FES. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
