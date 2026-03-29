'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { syncTournamentResults, upsertReport } from '@/lib/supabase/mutations';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText, Plus, Trash2, Trophy, Eye } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';
import PreviewModal from './PreviewModal';

interface ReportFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialResults?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tournaments: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  players: any[];
}

export default function ReportForm({ initialData, initialResults = [], tournaments, players }: ReportFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExternal, setIsExternal] = useState(initialData?.is_external || false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>(initialResults);
  const [selectedTournamentId, setSelectedTournamentId] = useState(initialData?.tournament_id || '');
  const [showPreview, setShowPreview] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(initialData || {});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await upsertReport({
        ...initialData,
        ...data,
        is_external: isExternal,
      });

      // 入賞者情報の同期 (大会IDが紐づいている場合)
      const tournamentId = data.tournament_id as string;
      if (tournamentId) {
        await syncTournamentResults(tournamentId, results);
      }

      router.push('/admin/reports');
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  }

  const addResult = () => {
    setResults([...results, { rank: results.length + 1, player_id: '', display_name: '' }]);
  };

  const removeResult = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateResult = (index: number, field: string, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {showPreview && (
        <PreviewModal 
          type="report" 
          data={{
            report: { ...formData, is_external: isExternal },
            tournament: tournaments.find(t => t.id === selectedTournamentId),
            organizers: tournaments.find(t => t.id === selectedTournamentId)?.organizers || [],
            results: results,
            players: players
          }} 
          onClose={() => setShowPreview(false)} 
        />
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/reports" className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-white">{initialData ? 'レポートを編集' : '新規レポート作成'}</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 flex items-center gap-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="glass-panel p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">レポートタイトル *</label>
              <input 
                name="title" 
                defaultValue={initialData?.title} 
                onChange={handleInputChange}
                className="admin-input w-full" 
                required 
                placeholder="例: 第1回 せい杯 決勝レポート"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">関連する大会</label>
              <select 
                name="tournament_id" 
                value={selectedTournamentId}
                onChange={(e) => {
                  setSelectedTournamentId(e.target.value);
                  handleInputChange(e);
                }}
                className="admin-input w-full"
              >
                <option value="">(なし)</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 入賞者管理セクション (大会が選択されている場合のみ) */}
          {selectedTournamentId && (
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--color-brand-blue)] uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={14} /> 入賞者管理
                </label>
                <button 
                  type="button"
                  onClick={addResult}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 rounded-lg transition-all"
                >
                  <Plus size={14} /> 追加
                </button>
              </div>

              <div className="space-y-3">
                {results.length === 0 && (
                  <p className="text-[10px] text-gray-600 italic">入賞者データはありません。「追加」ボタンで登録してください。</p>
                )}
                {results.sort((a,b) => a.rank - b.rank).map((res, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-white/5 p-4 rounded-xl relative group">
                    <div className="flex items-center gap-3">
                      <div className="w-10">
                        <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">順位</label>
                        <input 
                          type="number"
                          value={res.rank}
                          onChange={(e) => updateResult(idx, 'rank', parseInt(e.target.value))}
                          className="admin-input w-full px-2"
                        />
                      </div>
                      <div className="flex-grow min-w-[150px]">
                        <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">登録プレイヤー</label>
                        <select 
                          value={res.player_id || ''}
                          onChange={(e) => updateResult(idx, 'player_id', e.target.value)}
                          className="admin-input w-full text-xs"
                        >
                          <option value="">(未登録プレイヤーまたは選択解除)</option>
                          {players.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {!res.player_id && (
                      <div className="flex-grow">
                        <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">表示名（未登録時）</label>
                        <input 
                          type="text"
                          value={res.display_name || ''}
                          onChange={(e) => updateResult(idx, 'display_name', e.target.value)}
                          placeholder="例: 一般参加者A"
                          className="admin-input w-full text-xs"
                        />
                      </div>
                    )}

                    <button 
                      type="button"
                      onClick={() => removeResult(idx)}
                      className="absolute top-2 right-2 p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 pt-6 border-t border-white/5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">レポート形式</label>
              <div className="flex gap-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setIsExternal(false)}
                  className={`flex-grow flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all ${!isExternal ? 'bg-[var(--color-brand-blue)] border-transparent text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                >
                  <FileText size={14} /> 内部コンテンツ
                </button>
                <button 
                  type="button"
                  onClick={() => setIsExternal(true)}
                  className={`flex-grow flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all ${isExternal ? 'bg-blue-500 border-transparent text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                >
                  <LinkIcon size={14} /> 外部リンク (X, Note等)
                </button>
              </div>
            </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">画像 URL *</label>
            <div className="flex gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center shrink-0 w-12 h-12 text-gray-500">
                <ImageIcon size={20} />
              </div>
              <div className="flex-grow space-y-2">
                <input 
                  id="image_url_input"
                  name="image_url" 
                  defaultValue={initialData?.image_url} 
                  onChange={handleInputChange}
                  className="admin-input w-full" 
                  required
                  placeholder="https://..."
                />
                <CloudinaryUpload 
                  folder="reports"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('image_url_input') as HTMLInputElement;
                    if (el) {
                      el.value = url;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setFormData((prev: any) => ({ ...prev, image_url: url }));
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {isExternal ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">外部リンク URL *</label>
              <input 
                name="url" 
                defaultValue={initialData?.url} 
                onChange={handleInputChange}
                className="admin-input w-full" 
                required={isExternal}
                placeholder="https://x.com/... または https://note.com/..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">レポート本文 (Markdown形式)</label>
              <textarea 
                name="content" 
                defaultValue={initialData?.content} 
                onChange={handleInputChange}
                className="admin-input w-full h-64 resize-none py-4 font-mono text-sm" 
                placeholder="# 大会結果報告\n\n今回の優勝者は..."
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4">
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all"
          >
            <Eye size={18} /> プレビュー
          </button>
          <Link 
            href="/admin/reports"
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            キャンセル
          </Link>
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
}
