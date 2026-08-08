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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.827853458474!2d139.74454!3d35.68536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfbd89f700b%3A0x277c49ba34ed38!2z5p2x5Lqs6aeF!5e0!3m2!1sja!2sjp!4v1600000000000!5m2!1sja!2sjp"
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
