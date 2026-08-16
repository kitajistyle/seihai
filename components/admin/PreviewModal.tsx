'use client';

import { X, Trophy, Calendar, MapPin, Gift, Users, Award, Clock, Megaphone, ChevronRight } from 'lucide-react';
import SectionRenderer from '@/components/SectionRenderer';

interface PreviewModalProps {
  type: 'tournament' | 'report';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onClose: () => void;
}

export default function PreviewModal({ type, data, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-6xl h-full bg-gray-50 rounded-3xl border border-zinc-200 shadow-2xl flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white ${type === 'tournament' ? 'bg-[var(--color-brand-blue)]' : 'bg-blue-600'}`}>
              PREVIEW MODE
            </div>
            <span className="text-xs font-bold text-black">※これはプレビューです。実際の公開画面に近いイメージを確認できます。</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-150 rounded-full text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>
 
        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar bg-zinc-950">
          {type === 'tournament' ? (
            <TournamentPreview data={data} />
          ) : (
            <ReportPreview data={data} />
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TournamentPreview({ data }: { data: any }) {
  const isExpired = data.date && new Date(data.date) < new Date();
  const statusLabel = isExpired ? '終了' : data.status === 'open' ? 'エントリー受付中' : '準備中';
  const statusColor = isExpired ? 'bg-gray-500' : data.status === 'open' ? 'bg-green-500' : 'bg-yellow-500';

  const organizers = (Array.isArray(data.organizers) ? data.organizers : [data.organizers]).filter(Boolean);

  return (
    <div className="min-h-screen text-gray-200 pointer-events-none pb-20">
       <header className="relative w-full h-[45vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image_url || 'https://picsum.photos/seed/tournament/1200/600'}
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
                {data.format || 'トーナメント'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl mb-4">
              {data.title || '大会タイトル'}
            </h1>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-brand-blue)]" />
                <span className="font-bold">
                  {data.date ? new Date(data.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', timeZone: 'Asia/Tokyo' }) : '開催日時未設定'}
                  {' '}
                  {data.date ? new Date(data.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' }) : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-brand-blue)]" />
                <span className="font-bold">定員 {data.max_participants || 0} 人</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="glass-panel p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
              <div className="w-1.5 h-8 bg-black rounded-sm" />
              大会概要
            </h2>
            <div className="prose max-w-none text-black leading-loose text-lg whitespace-pre-wrap">
              {data.description || '大会の詳細情報は現在準備中です。'}
            </div>
          </section>

          {data.sections && data.sections.length > 0 && (
            <section className="glass-panel p-8 md:p-10">
              <SectionRenderer sections={data.sections} />
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-zinc-900">
                <MapPin className="w-6 h-6" />
                <h3 className="font-bold text-lg text-zinc-900">開催場所</h3>
              </div>
              <div>
                <p className="text-black mb-2">{data.location || 'オンライン'}</p>
                {data.location_url && (
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                    Google マップで確認 <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-zinc-900">
                <Gift className="w-6 h-6" />
                <h3 className="font-bold text-lg text-zinc-900">参加費・賞品</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black">参加費</span>
                  <span className="font-bold text-zinc-900">{data.entry_fee || '無料'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">優勝賞品</span>
                  <span className="font-bold text-amber-600">{data.first_prize || '称号'}</span>
                </div>
                {data.participation_prize && (
                  <div className="flex justify-between text-sm">
                    <span className="text-black">参加賞</span>
                    <span className="font-bold text-zinc-900">{data.participation_prize}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {(data.guests || data.contact_info) && (
            <section className="glass-panel p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-zinc-900">
                <Megaphone className="w-6 h-6 text-green-650" />
                ゲスト・注意事項
              </h2>
              <div className="space-y-6">
                {data.guests && (
                  <div>
                    <p className="text-sm font-bold text-black uppercase tracking-widest mb-2">スペシャルゲスト</p>
                    <p className="text-green-700 font-bold text-lg">{data.guests}</p>
                  </div>
                )}
                {data.contact_info && (
                  <div>
                    <p className="text-sm font-bold text-black uppercase tracking-widest mb-2">注意事項 / 連絡先</p>
                    <p className="text-black leading-relaxed">{data.contact_info}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section className="glass-panel p-8 text-center border-t-4 border-t-zinc-900">
            <Clock className="w-12 h-12 text-zinc-900 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4 text-zinc-900">参加申し込み</h3>
            <p className="text-sm text-black mb-8 leading-relaxed">
              プレビューモードのため、エントリーボタンの操作は無効化されています。実際の公開画面では有効になります。
            </p>
            <button disabled className="w-full py-4 bg-zinc-100 text-zinc-400 border border-zinc-200 font-bold rounded-xl cursor-not-allowed">
              エントリー不可
            </button>
          </section>

          {organizers.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">主催者</p>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {organizers.map((org: any, idx: number) => (
                  <div key={idx} className="glass-panel p-6">
                    <div className="flex items-center gap-4 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={org.image_url || `https://unavatar.io/x/${org.name}`}
                        alt={org.name}
                        className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                      />
                      <div>
                        <h4 className="font-bold text-lg text-zinc-900">{org.name}</h4>
                        <p className="text-xs text-black">{org.title}</p>
                      </div>
                    </div>
                    {org.description && (
                      <p className="text-sm text-black leading-relaxed">
                        {org.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReportPreview({ data }: { data: any }) {
  const { report, tournament, organizers = [], results = [] } = data;

  return (
    <div className="min-h-screen pb-20 text-gray-200 pointer-events-none">
      <header className="relative w-full h-[40vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={report.image_url || 'https://picsum.photos/seed/default/1200/500'} alt="Report Cover" className="w-full h-full object-cover opacity-40 blur-sm scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark)] via-[var(--color-bg-dark)]/60 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30 backdrop-blur-md shadow-lg">
              EVENT REPORT
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
              {report.title || 'タイトル未設定'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 flex flex-col gap-8">
        {tournament && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
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
                <p className="font-medium text-lg text-white">
                  {tournament.date ? new Date(tournament.date).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '-'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><MapPin className="w-4 h-4"/> 開催場所</p>
                <p className="font-medium text-lg text-white">{tournament.location || '未定'}</p>
              </div>
              {tournament.format && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Users className="w-4 h-4"/> 形式</p>
                  <p className="font-medium text-lg text-white">{tournament.format}</p>
                </div>
              )}
              {tournament.entry_fee && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center text-sm font-semibold text-gray-400 gap-1"><Gift className="w-4 h-4"/> 参加費</p>
                  <p className="font-medium text-lg text-white">{tournament.entry_fee}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {results.length > 0 && (
              <section className="glass-panel p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
                  <Award className="w-7 h-7 text-yellow-500" />
                  大会上位入賞者
                </h2>
                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {results.sort((a: any, b: any) => a.rank - b.rank).map((res: any, idx: number) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const playerData = res.player_id ? data.players?.find((p: any) => p.id === res.player_id) : null;
                    return (
                      <div key={idx} className="flex items-center gap-5 bg-zinc-50 p-4 md:px-6 md:py-5 rounded-xl border border-zinc-200">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0
                          ${res.rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' :
                            res.rank === 2 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-black shadow-[0_0_15px_rgba(156,163,175,0.3)]' :
                            res.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-800 text-white shadow-[0_0_15px_rgba(180,83,9,0.3)]' : 'bg-zinc-200 text-black'}`}>
                          {res.rank}
                        </div>
                        
                        {playerData ? (
                          <div className="flex items-center gap-4 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={playerData.avatar_url || `https://unavatar.io/x/${playerData.name}`} alt="" className="w-12 h-12 rounded-full border-2 border-zinc-200 object-cover" />
                            <div>
                              <p className="font-extrabold text-xl text-zinc-900">{playerData.name}</p>
                              {playerData.x_id && <p className="text-sm text-blue-600">𝕏 @{playerData.x_id}</p>}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-xl text-black">{res.display_name || '一般参加プレイヤー'}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-6 text-zinc-900 tracking-widest uppercase border-b border-zinc-200 pb-4">Report</h2>
              <div className="prose prose-lg prose-blue max-w-none text-black">
                {report.content ? report.content.split('\n').map((line: string, idx: number) => {
                  if (line.startsWith('## ')) return <h3 key={idx} className="text-2xl font-bold mt-8 mb-4 text-zinc-900">{line.replace('## ', '')}</h3>;
                  if (line.startsWith('**') && line.endsWith('**')) return <strong key={idx} className="block mt-6 mb-2 text-xl text-blue-700">{line.replace(/\*\*/g, '')}</strong>;
                  if (!line.trim()) return <br key={idx} className="my-2" />;
                  return <p key={idx} className="mb-4 text-black leading-loose">{line}</p>;
                }) : <p className="text-zinc-550 italic">本文はありません</p>}
              </div>
            </section>

            {report.sections && report.sections.length > 0 && (
              <section className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                <SectionRenderer sections={report.sections} />
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {organizers.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Organizers</p>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {organizers.map((org: any, idx: number) => (
                  <section key={idx} className="glass-panel p-6 text-center shadow-xl">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"></div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={org.image_url || `https://unavatar.io/x/${org.name}`} alt="" className="relative w-full h-full rounded-full border-2 border-zinc-200 object-cover shadow-lg" />
                    </div>
                    <p className="text-xl font-extrabold text-black mb-2">{org.name}</p>
                    <p className="text-sm font-semibold text-blue-700 mb-4 bg-blue-50 inline-block px-3 py-1 rounded-full">{org.title}</p>
                    {org.description && <p className="text-sm text-black leading-relaxed mb-6">{org.description}</p>}
                    {org.x_id && (
                      <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white rounded-lg text-sm font-bold border border-white/10">
                        𝕏 Follow @{org.x_id}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
