import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReportDetail } from '@/lib/supabase/queries';
import { Trophy, Calendar, MapPin, Gift, Users, Award, ExternalLink } from 'lucide-react';

// Generate dynamic SEO metadata
export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const data = await getReportDetail(params.id);
  
  if (!data) return { title: '見つかりません | せい杯' };
  
  const tournamentTitle = data.tournament ? data.tournament.title : data.report.title;
  const description = data.tournament 
    ? `${tournamentTitle}のイベントレポートです。大会結果、優勝・上位入賞者、会場（${data.tournament.location || 'オンライン'}）の白熱した様子などの詳細をお届けします。` 
    : '大会のイベントレポート詳細ページです。';

  return {
    title: `${data.report.title}`,
    description,
    openGraph: {
      title: data.report.title,
      description,
      images: [data.report.image_url],
      type: 'article',
    },
  };
}

export default async function ReportDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getReportDetail(params.id);
  
  if (!data) {
    notFound();
  }

  const { report, tournament, organizer, results } = data;

  return (
    <article id={`report-article-${report.id}`} className="min-h-screen pb-20 text-gray-200">
      {/* Header Banner */}
      <header id="report-header" className="relative w-full h-[40vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={report.image_url || 'https://picsum.photos/seed/default/1200/500'} alt="Report Cover" className="w-full h-full object-cover opacity-40 blur-sm scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark)] via-[var(--color-bg-dark)]/60 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full text-center space-y-4">
            <span id="report-badge" className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30 backdrop-blur-md shadow-lg">
              EVENT REPORT
            </span>
            <h1 id="report-title" className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
              {report.title}
            </h1>
          </div>
        </div>
      </header>

      <main id="report-main-content" className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 flex flex-col gap-8">
        
        {/* Tournament Meta Info */}
        {tournament && (
          <section id="tournament-info" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl hover:border-white/20 transition-colors">
            <h2 id="tournament-info-title" className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Trophy className="w-6 h-6 text-blue-400" />
              大会詳細情報
            </h2>
            
            {tournament.description && (
              <div className="mb-8 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-sm font-semibold text-blue-300 mb-2 tracking-wider">大会概要</p>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base">{tournament.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Calendar className="w-4 h-4"/> 開催日時</p>
                <p className="font-medium text-lg">{tournament.date}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><MapPin className="w-4 h-4"/> 開催場所</p>
                <p className="font-medium text-lg">
                  {tournament.location || '未定'}
                  {tournament.location_url && (
                    <a href={tournament.location_url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-block text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      [MAP]
                    </a>
                  )}
                </p>
              </div>
              {tournament.format && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Users className="w-4 h-4"/> 形式</p>
                  <p className="font-medium text-lg">{tournament.format}</p>
                </div>
              )}
              {tournament.entry_fee && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Gift className="w-4 h-4"/> 参加費</p>
                  <p className="font-medium text-lg">{tournament.entry_fee}</p>
                </div>
              )}
              {tournament.first_prize && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Award className="w-4 h-4 text-yellow-500"/> 優勝賞品</p>
                  <p className="font-medium text-sm leading-relaxed">{tournament.first_prize}</p>
                </div>
              )}
              {tournament.participation_prize && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Gift className="w-4 h-4"/> 参加賞</p>
                  <p className="font-medium text-sm leading-relaxed">{tournament.participation_prize}</p>
                </div>
              )}
            </div>

            {(tournament.guests || tournament.contact_info) && (
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournament.guests && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-gray-400">ゲスト・出演者</p>
                    <p className="font-medium text-green-300">{tournament.guests}</p>
                  </div>
                )}
                {tournament.contact_info && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-gray-400">特記事項・連絡先</p>
                    <p className="font-medium text-gray-300 text-sm leading-relaxed">{tournament.contact_info}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Winners Section */}
            {results.length > 0 && (
              <section id="tournament-winners" className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                <h2 id="winners-title" className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Award className="w-7 h-7 text-yellow-500" />
                  大会上位入賞者
                </h2>
                <div className="space-y-4">
                  {results.map((res: any) => (
                    <div key={res.id} id={`winner-row-${res.id}`} className="group flex items-center gap-5 bg-white/5 p-4 md:px-6 md:py-5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0
                        ${res.rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' :
                          res.rank === 2 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-black shadow-[0_0_15px_rgba(156,163,175,0.3)]' :
                          res.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-800 text-white shadow-[0_0_15px_rgba(180,83,9,0.3)]' : 'bg-white/10 text-gray-400'}`}>
                        {res.rank}
                      </div>
                      
                      {res.players ? (
                        <div className="flex items-center gap-4 w-full">
                          <img src={res.players.avatar_url || `https://i.pravatar.cc/150?u=${res.players.id}`} alt={`${res.players.name} icon`} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-blue-400/50 transition-colors object-cover" />
                          <div>
                            <p className="font-extrabold text-xl text-white">{res.players.name}</p>
                            {res.players.x_id && (
                              <a href={`https://x.com/${res.players.x_id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                𝕏 @{res.players.x_id}
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-xl text-gray-200">{res.display_name}</p>
                          <p className="text-sm text-gray-500">一般参加プレイヤー</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Report Content */}
            {report.content && (
              <section id="report-content-section" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                <h2 id="report-content-title" className="text-xl font-bold mb-6 text-white tracking-widest uppercase border-b border-white/10 pb-4">Report</h2>
                <div className="prose prose-invert prose-lg prose-blue max-w-none">
                  {/* Simplistic markdown rendering mapping \n to <br> for mock data */}
                  {report.content.split('\n').map((line: string, idx: number) => {
                    if (line.startsWith('## ')) return <h3 key={idx} className="text-2xl font-bold mt-8 mb-4 text-white">{line.replace('## ', '')}</h3>;
                    if (line.startsWith('**') && line.endsWith('**')) return <strong key={idx} className="block mt-6 mb-2 text-xl text-blue-300">{line.replace(/\*\*/g, '')}</strong>;
                    if (!line.trim()) return <br key={idx} className="my-2" />;
                    return <p key={idx} className="mb-4 text-gray-300 leading-loose">{line}</p>;
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside id="report-sidebar" className="space-y-6">
            {/* Organizer Section */}
            {organizer && (
              <section id="organizer-sidebar-card" className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center shadow-xl">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Organizer</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse"></div>
                  <img src={organizer.imageUrl} alt={organizer.name} className="relative w-full h-full rounded-full border-2 border-white/20 object-cover shadow-lg" />
                </div>
                <p className="text-xl font-extrabold text-white mb-2">{organizer.name}</p>
                <p className="text-sm font-semibold text-blue-400 mb-4 bg-blue-500/10 inline-block px-3 py-1 rounded-full">{organizer.title}</p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">{organizer.description}</p>
                {organizer.x_id && (
                  <a href={`https://x.com/${organizer.x_id}`} target="_blank" rel="noopener noreferrer" id={`btn-org-twitter-${organizer.id}`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#000000] hover:bg-[#111111] text-white rounded-lg text-sm font-bold transition-transform hover:scale-105 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]">
                    𝕏 Follow @{organizer.x_id}
                  </a>
                )}
              </section>
            )}
            
            {/* Action Card */}
            {report.is_external && report.url && (
              <section id="external-link-card" className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/40 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                 <h3 className="font-bold text-white mb-3 text-lg">外部サイトで続きを読む</h3>
                 <p className="text-sm text-gray-300 mb-6 leading-relaxed">このレポートの完全版は主催者の公式Webサイト、または外部メディアで公開されています。</p>
                 <a href={report.url} target="_blank" rel="noopener noreferrer" id="btn-external-report" className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-[0_4px_20px_rgba(59,130,246,0.5)]">
                   公式記事を読む <ExternalLink className="w-5 h-5 drop-shadow" />
                 </a>
              </section>
            )}
          </aside>
        </div>
      </main>
    </article>
  )
}
