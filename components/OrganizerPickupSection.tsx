import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ORGANIZERS } from '@/lib/data';

export default function OrganizerPickupSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">主催者一覧</h2>
        <div className="w-24 h-1 bg-[var(--color-brand-blue)] mx-auto mb-4" />
        <p className="text-gray-400 mb-8 md:mb-0">大会を開催する主催者たち</p>
        <Link href="/organizers" className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors hidden md:flex items-center gap-1">
          すべて見る <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ORGANIZERS.slice(0, 2).map((org) => (
          <div key={org.id} className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.imageUrl} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={org.name} />
            <div>
              <h3 className="text-2xl font-bold mb-1">{org.name}</h3>
              <p className="text-[var(--color-brand-blue)] text-sm font-medium mb-3">{org.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{org.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center md:hidden">
        <Link href="/organizers" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1">
          すべて見る <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
