'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertReport } from '@/lib/supabase/mutations';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';

interface ReportFormProps {
  initialData?: any;
  tournaments: any[];
}

export default function ReportForm({ initialData, tournaments }: ReportFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExternal, setIsExternal] = useState(initialData?.is_external || false);

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
      router.push('/admin/reports');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-panel p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">レポートタイトル *</label>
              <input 
                name="title" 
                defaultValue={initialData?.title} 
                className="admin-input w-full" 
                required 
                placeholder="例: 第1回 せい杯 決勝レポート"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">関連する大会</label>
              <select 
                name="tournament_id" 
                defaultValue={initialData?.tournament_id} 
                className="admin-input w-full"
              >
                <option value="">(なし)</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

            <div className="space-y-2">
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
                  className="admin-input w-full" 
                  required
                  placeholder="https://..."
                />
                <CloudinaryUpload 
                  folder="reports"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('image_url_input') as HTMLInputElement;
                    if (el) el.value = url;
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
                className="admin-input w-full h-64 resize-none py-4 font-mono text-sm" 
                placeholder="# 大会結果報告\n\n今回の優勝者は..."
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4">
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
