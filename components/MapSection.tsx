import FadeInView from '@/components/FadeInView';

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
          <iframe
            src="https://maps.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E7%AB%8B%E7%94%A3%E6%A5%AD%E8%B2%BF%E6%98%93%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E6%B5%9C%E6%9D%BE%E7%94%BA%E9%A4%A8&hl=ja&z=16&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="会場マップ"
          />
        </div>
      </FadeInView>
    </section>
  );
}
