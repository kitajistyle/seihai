import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTournamentDetail } from '@/lib/supabase/queries';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Gift, 
  Users, 
  Award, 
  ChevronRight, 
  Clock, 
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import TournamentRegistrationForm from '@/components/TournamentRegistrationForm';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tournament = await getTournamentDetail(params.id);
  
  if (!tournament) return { title: '大会が見つかりません | せい杯' };
  
  return {
    title: `${tournament.title}`,
    description: tournament.description || `${tournament.title}の大会詳細情報です。参加申し込み、ルール、景品などを確認できます。`,
  };
}

export default async function TournamentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const tournament = await getTournamentDetail(params.id);
  
  if (!tournament) {
    notFound();
  }

  const organizer = tournament.organizers;
  const isExpired = new Date(tournament.date) < new Date();
  const statusLabel = isExpired ? '終了' : tournament.status === 'open' ? 'エントリー受付中' : '準備中';
  const statusColor = isExpired ? 'bg-gray-500' : tournament.status === 'open' ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <article className="min-h-screen pb-20 text-gray-200">
      {/* Hero Header */}
      <header className="relative w-full h-[45vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={tournament.image_url || 'https://picsum.photos/seed/tournament/1200/600'} 
            alt="Tournament Cover" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark)] via-[var(--color-bg-dark)]/40 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-end justify-center pb-12 px-6">
          <div className="max-w-4xl w-full">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white ${statusColor} shadow-lg`}>
                {statusLabel}
              </span>
              <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                {tournament.format || 'トーナメント'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl mb-4">
              {tournament.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300">
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
                <span className="font-bold">{tournament.participants || 0} / {tournament.max_participants} 人</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Overview Section */}
          <section className="glass-panel p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[var(--color-brand-red)]" />
              大会概要
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-loose text-lg whitespace-pre-wrap">
              {tournament.description || '大会の詳細情報は現在準備中です。'}
            </div>
          </section>

          {/* Entry Form Section */}
          {!isExpired && tournament.status === 'open' && (
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
              <div className="flex items-center gap-3 text-[var(--color-brand-blue)]">
                <MapPin className="w-6 h-6" />
                <h3 className="font-bold text-lg text-white">開催場所</h3>
              </div>
              <div>
                <p className="text-gray-300 mb-2">{tournament.location || 'オンライン'}</p>
                {tournament.location_url && (
                  <a 
                    href={tournament.location_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Google マップで確認 <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[var(--color-brand-blue)]">
                <Gift className="w-6 h-6" />
                <h3 className="font-bold text-lg text-white">参加費・賞品</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">参加費</span>
                  <span className="font-bold text-white">{tournament.entry_fee || '無料'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">優勝賞品</span>
                  <span className="font-bold text-yellow-500">{tournament.first_prize || '称号'}</span>
                </div>
                {tournament.participation_prize && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">参加賞</span>
                    <span className="font-bold text-white">{tournament.participation_prize}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Extra Info */}
          {(tournament.guests || tournament.contact_info) && (
            <section className="glass-panel p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-green-400" />
                ゲスト・注意事項
              </h2>
              <div className="space-y-6">
                {tournament.guests && (
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">スペシャルゲスト</p>
                    <p className="text-green-300 font-bold text-lg">{tournament.guests}</p>
                  </div>
                )}
                {tournament.contact_info && (
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">注意事項 / 連絡先</p>
                    <p className="text-gray-400 leading-relaxed">{tournament.contact_info}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="space-y-8">
          {/* Action Card */}
          <section className="glass-panel p-8 text-center border-t-4 border-t-[var(--color-brand-blue)] sticky">
            <Clock className="w-12 h-12 text-[var(--color-brand-blue)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">参加申し込み</h3>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              {isExpired 
                ? 'この大会はすでに終了いたしました。たくさんのご参加ありがとうございました。'
                : tournament.status === 'open' 
                  ? '定員に達し次第、受付を終了いたします。お早めにエントリーください。'
                  : '現在は準備中です。エントリー開始まで今しばらくお待ちください。'}
            </p>
            
            {tournament.status === 'open' && !isExpired ? (
              <a 
                href="#entry"
                className="block w-full py-4 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-black text-lg rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center"
              >
                大会にエントリーする
              </a>
            ) : (
              <button disabled className="w-full py-4 bg-white/5 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                エントリー不可
              </button>
            )}

            {tournament.status === 'open' && !isExpired && (
              <p className="mt-4 text-[10px] text-gray-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 外部サイトまたは公式フォームへ遷移します
              </p>
            )}
          </section>

          {/* Organizers Section */}
          {tournament.organizers && tournament.organizers.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">主催者</p>
              <div className="space-y-4">
                {tournament.organizers.map((org: any) => (
                  <div key={org.id} className="glass-panel p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <img 
                        src={org.image_url || `https://unavatar.io/x/${org.name}`} 
                        alt={org.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="font-bold text-lg">{org.name}</h4>
                        <p className="text-xs text-[var(--color-brand-blue)]">{org.title}</p>
                      </div>
                    </div>
                    {org.description && (
                      <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        {org.description}
                      </p>
                    )}
                    {org.x_id && (
                      <a 
                        href={`https://x.com/${org.x_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-black hover:bg-gray-900 border border-white/10 text-white rounded-lg text-sm font-bold transition-transform hover:scale-102"
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
            className="block glass-panel p-6 group hover:border-[var(--color-brand-blue)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">アーカイブ</p>
                <h4 className="font-bold text-sm">過去の大会レポートを見る</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[var(--color-brand-blue)] transition-colors" />
            </div>
          </Link>
        </aside>
      </main>
    </article>
  );
}
