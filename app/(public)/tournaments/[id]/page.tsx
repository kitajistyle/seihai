import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTournamentDetail } from '@/lib/db/queries';

export const revalidate = 60;
import {
  Calendar,
  MapPin,
  Gift,
  Users,
  ChevronRight,
  Clock,
  Megaphone,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import TournamentRegistrationForm from '@/components/TournamentRegistrationForm';
import SectionRenderer from '@/components/SectionRenderer';

const BASE_URL = 'https://every1-fes.vercel.app';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tournament = await getTournamentDetail(params.id);
  
  if (!tournament) return { title: '大会が見つかりません | せい祭' };

  const description = tournament.description
    || `せい祭で開催される「${tournament.title}」の大会詳細です。参加申し込み・ルール・景品をご確認いただけます。`;
  
  return {
    title: `${tournament.title} | せい祭`,
    description,
    alternates: { canonical: `${BASE_URL}/tournaments/${tournament.id}` },
    openGraph: {
      title: `${tournament.title} | せい祭`,
      description,
      url: `${BASE_URL}/tournaments/${tournament.id}`,
      siteName: 'せい祭',
      images: tournament.image_url
        ? [{ url: tournament.image_url, alt: tournament.title }]
        : [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: tournament.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tournament.title} | せい祭`,
      description,
      images: [tournament.image_url || `${BASE_URL}/og-image.png`],
    },
  };
}

export default async function TournamentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const tournament = await getTournamentDetail(params.id);
  
  if (!tournament) {
    notFound();
  }

  const isExpired = new Date(tournament.date) < new Date();
  const statusLabel = isExpired ? '終了' : tournament.status === 'open' ? 'エントリー受付中' : '準備中';
  const statusColor = isExpired ? 'bg-gray-500' : tournament.status === 'open' ? 'bg-green-500' : 'bg-yellow-500';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: tournament.title,
    description: tournament.description || `せい祭で開催される「${tournament.title}」の大会詳細です。`,
    url: `${BASE_URL}/tournaments/${tournament.id}`,
    startDate: tournament.date,
    location: {
      '@type': 'Place',
      name: tournament.location || 'オンライン',
    },
    organizer: {
      '@type': 'Organization',
      name: 'せい祭',
      url: BASE_URL,
    },
    image: tournament.image_url || `${BASE_URL}/og-image.png`,
  };

  return (
    <article className="relative min-h-screen pb-20 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Header */}
      <header className="relative w-full min-h-[45vh] md:h-[50vh] overflow-hidden bg-black flex items-center pt-24 pb-12">
        {/* 背景画像（ぼかし効果あり） */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tournament.image_url || 'https://picsum.photos/seed/tournament/1200/600'}
            alt="Tournament Cover Background"
            className="w-full h-full object-cover opacity-30 blur-md scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        
        {/* コンテンツコンテナ */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* 左側：メインの大会画像（アスペクト比維持、より大きく表示） */}
          <div className="w-full md:w-[55%] lg:w-[600px] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-zinc-950 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tournament.image_url || 'https://picsum.photos/seed/tournament/1200/600'}
              alt={tournament.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* 右側：タイトルとメタ情報 */}
          <div className="flex-grow text-center md:text-left w-full">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white ${statusColor} shadow-lg`}>
                {statusLabel}
              </span>
              <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                {tournament.format || 'トーナメント'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white drop-shadow-2xl mb-6 leading-tight">
              {tournament.title}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6 text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-brand-blue)]" />
                <span className="font-bold">
                  {new Date(tournament.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', timeZone: 'Asia/Tokyo' })}
                  {' '}
                  {new Date(tournament.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-brand-blue)]" />
                <span className="font-bold">定員 {tournament.max_participants} 人</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-3">
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            大会一覧に戻る
          </Link>
        </div>
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Overview Section */}
          <section className="glass-panel p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
              <div className="w-1.5 h-8 bg-black rounded-sm" />
              大会概要
            </h2>
            <div className="max-w-none text-black leading-loose text-lg whitespace-pre-wrap">
              {tournament.description || '大会の詳細情報は現在準備中です。'}
            </div>
          </section>

          {/* Rich Sections */}
          {tournament.sections && tournament.sections.length > 0 && (
            <section className="glass-panel p-8 md:p-10">
              <SectionRenderer sections={tournament.sections} />
            </section>
          )}

          {/* Entry Form Section */}
          {!isExpired && tournament.status === 'open' && !tournament.external_registration_url && (
            <section id="entry">
              <TournamentRegistrationForm
                tournamentId={tournament.id}
                tournamentTitle={tournament.title}
              />
            </section>
          )}

          {/* Details Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-black">
                <MapPin className="w-6 h-6" />
                <h3 className="font-bold text-lg text-black">開催場所</h3>
              </div>
              <div>
                <p className="text-black mb-2">{tournament.location || 'オンライン'}</p>
                {tournament.location_url && (
                  <a 
                    href={tournament.location_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Google マップで確認 <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-black">
                <Gift className="w-6 h-6" />
                <h3 className="font-bold text-lg text-black">参加費・賞品</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black">参加費</span>
                  <span className="font-bold text-black">{tournament.entry_fee || '無料'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">優勝賞品</span>
                  <span className="font-bold text-yellow-700">{tournament.first_prize || '称号'}</span>
                </div>
                {tournament.participation_prize && (
                  <div className="flex justify-between text-sm">
                    <span className="text-black">参加賞</span>
                    <span className="font-bold text-black">{tournament.participation_prize}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Extra Info */}
          {tournament.contact_info && (
            <section className="glass-panel p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-black">
                <Megaphone className="w-6 h-6 text-green-700" />
                注意事項
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-widest mb-2">注意事項 / 連絡先</p>
                  <p className="text-black leading-relaxed">{tournament.contact_info}</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1">
          {/* Action Card */}
          <section className="glass-panel p-8 text-center border-t-4 border-t-sky-400">
            <Clock className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4 text-black">参加申し込み</h3>
            <p className="text-sm text-black mb-8 leading-relaxed">
              {isExpired 
                ? 'この大会はすでに終了いたしました。たくさんのご参加ありがとうございました。'
                : tournament.status === 'open' 
                  ? '定員に達し次第、受付を終了いたします。お早めにエントリーください。'
                  : '現在は準備中です。エントリー開始まで今しばらくお待ちください。'}
            </p>
            
            {tournament.status === 'open' && !isExpired ? (
              tournament.external_registration_url ? (
                <a
                  href={tournament.external_registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-black text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                >
                  大会にエントリーする
                </a>
              ) : (
                <a
                  href="#entry"
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-black text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center shadow-md"
                >
                  大会にエントリーする
                </a>
              )
            ) : (
              <button disabled className="w-full py-4 bg-zinc-800 text-zinc-500 font-bold rounded-xl cursor-not-allowed">
                エントリー不可
              </button>
            )}

            {tournament.status === 'open' && !isExpired && (
              <p className="mt-4 text-[10px] text-black flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {tournament.external_registration_url ? '外部サイトへ移動します' : '公式フォームへ遷移します'}
              </p>
            )}
          </section>

          {/* Organizers Section */}
          {tournament.organizers && tournament.organizers.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-4 text-center">主催者</p>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {tournament.organizers.map((org: any) => (
                  <div key={org.id} className="glass-panel p-6">
                    <div className="flex items-center gap-4 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={org.image_url || `https://unavatar.io/x/${org.name}`}
                        alt={org.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <h4 className="font-bold text-lg text-black">{org.name}</h4>
                        <p className="text-xs text-black">{org.title}</p>
                      </div>
                    </div>
                    {org.description && (
                      <p className="text-sm text-black leading-relaxed mb-6">
                        {org.description}
                      </p>
                    )}
                    {org.x_id && (
                      <a 
                        href={`https://x.com/${org.x_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-bold transition-transform hover:scale-[1.02]"
                      >
                        𝕏 @{org.x_id} をフォロー
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Report Link (if exists) */}
          <Link 
            href="/reports" 
            className="block glass-panel p-6 group hover:border-black transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">アーカイブ</p>
                <h4 className="font-bold text-sm text-black">過去の大会レポートを見る</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-black group-hover:text-black transition-colors" />
            </div>
          </Link>
        </aside>
      </main>
    </article>
  );
}
