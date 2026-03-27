import type { Metadata } from 'next';
import { getOrganizers } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: '主催者一覧',
  description: '大会を開催する主催者・オーガナイザーの一覧です。',
};

export default async function OrganizersPage() {
  const organizers = await getOrganizers();
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">主催者一覧</h1>
        <div className="w-24 h-1 bg-[var(--color-brand-blue)] mx-auto mb-4" />
        <p className="text-gray-400">大会を開催する主催者たち</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {organizers.map((org) => (
          <div key={org.id} className="glass-panel p-6 flex gap-6 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.image_url || ''} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={org.name} />
            <div>
              <h3 className="text-2xl font-bold mb-1">{org.name}</h3>
              <p className="text-[var(--color-brand-blue)] text-sm font-medium mb-3">{org.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{org.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
