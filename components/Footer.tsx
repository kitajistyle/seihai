import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-dark)] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[var(--color-brand-blue)] rounded flex items-center justify-center">
            <Trophy className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tighter uppercase">E-SPORTS HUB</span>
        </div>
        <p className="text-gray-500 text-sm mb-8">
          © 2026 Card Game Championship Hub. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-gray-400">
          {['Twitter', 'Discord', 'YouTube', 'Contact'].map((link) => (
            <Link
              key={link}
              href="#"
              className="text-xs hover:text-[var(--color-brand-blue)] transition-colors uppercase tracking-widest"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
