import type { Metadata } from 'next';
import { ORGANIZERS } from '@/lib/data';

export const metadata: Metadata = {
  title: '主催者一覧',
  description: '大会を開催する主催者・オーガナイザーの一覧です。',
};

export default function OrganizersPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">主催者一覧</h1>
        <div className="w-24 h-1 bg-[var(--color-brand-blue)] mx-auto mb-4" />
        <p className="text-gray-400">大会を開催する主催者たち</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ORGANIZERS.map((org) => (
          <div key={org.id} className="glass-panel p-6 flex gap-6 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.imageUrl} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={org.name} />
            <div>
              <h3 className="text-2xl font-bold mb-1">{org.name}</h3>
              <p className="text-[var(--color-brand-blue)] text-sm font-medium mb-3">{org.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{org.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-lg font-bold text-gray-500 mb-8 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/10" />
          その他の主催者
          <div className="h-px w-12 bg-white/10" />
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {['Yamada', 'Sato', 'Gaming Bros', 'Nakamura'].map((name) => (
            <div key={name} className="text-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-[var(--color-brand-blue)] transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/150?u=${name}`} className="w-full h-full object-cover" alt="" />
              </div>
              <p className="font-bold text-sm">{name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Staff</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
