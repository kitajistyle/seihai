import FadeInView from '@/components/FadeInView';
import Image from 'next/image';

export default function MapSection() {
  return (
    <section className="relative py-24">
      <div className="text-center mb-16 relative">
        <FadeInView>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-tighter text-gradient-premium">
            会場アクセス
          </h2>
          <div className="w-32 h-3 bg-gradient-to-r from-white to-zinc-450 mx-auto mb-6 rounded-sm" />
          <p className="text-white font-medium tracking-widest">全大会は同一会場で開催されます</p>
        </FadeInView>
      </div>

      <FadeInView>
        <div className="glass-panel overflow-hidden rounded-2xl">
          <Image
            src="/venue-map.png"
            alt="せい祭 会場MAP — 都立産業貿易センター浜松町館 5階 展示室"
            width={1200}
            height={675}
            className="w-full h-auto"
          />
        </div>
        <div className="text-center mt-6">
          <a
            href="https://maps.app.goo.gl/myFmgfmRZmzvtHUGA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-bold tracking-wider transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Google マップで見る
          </a>
          <p className="text-white/60 text-sm mt-3 tracking-wider">都立産業貿易センター浜松町館 5階 展示室</p>
        </div>
      </FadeInView>
    </section>
  );
}
