'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertTournament } from '@/lib/supabase/mutations';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';

interface TournamentFormProps {
  initialData?: any;
  organizers: any[];
}

export default function TournamentForm({ initialData, organizers }: TournamentFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Convert status to appropriate format if needed
    try {
      await upsertTournament({
        ...initialData,
        ...data,
        participants: parseInt(data.participants as string) || 0,
        max_participants: parseInt(data.max_participants as string) || 0,
      });
      router.push('/admin/tournaments');
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
        <Link href="/admin/tournaments" className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-white">{initialData ? '大会を編集' : '新規大会作成'}</h1>
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
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">大会タイトル *</label>
              <input 
                name="title" 
                defaultValue={initialData?.title} 
                className="admin-input w-full" 
                required 
                placeholder="例: 第1回 せい杯 予選"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">主催者 *</label>
              <select 
                name="organizer_id" 
                defaultValue={initialData?.organizer_id} 
                className="admin-input w-full"
                required
              >
                <option value="">選択してください</option>
                {organizers.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">開催日時 *</label>
              <input 
                type="datetime-local" 
                name="date" 
                defaultValue={initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : ''} 
                className="admin-input w-full" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">最大参加人数 *</label>
              <input 
                type="number" 
                name="max_participants" 
                defaultValue={initialData?.max_participants} 
                className="admin-input w-full" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ステータス</label>
              <select name="status" defaultValue={initialData?.status || 'upcoming'} className="admin-input w-full">
                <option value="upcoming">準備中 (Upcoming)</option>
                <option value="open">エントリー受付中 (Open)</option>
                <option value="closed">終了 (Closed)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">画像 URL</label>
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
                  placeholder="https://..."
                />
                <CloudinaryUpload 
                  folder="tournaments"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('image_url_input') as HTMLInputElement;
                    if (el) el.value = url;
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">大会概要 / 詳細</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description} 
              className="admin-input w-full h-32 resize-none py-4" 
              placeholder="大会の概要やルール、参加資格などを入力してください..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">開催場所</label>
              <input name="location" defaultValue={initialData?.location} className="admin-input w-full" placeholder="例: オンライン, 東京ビッグサイト" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">会場 URL (Google Maps等)</label>
              <input name="location_url" defaultValue={initialData?.location_url} className="admin-input w-full" placeholder="https://maps.google.com/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">参加費</label>
              <input name="entry_fee" defaultValue={initialData?.entry_fee} className="admin-input w-full" placeholder="例: 無料, 1500円" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">優勝景品</label>
              <input name="first_prize" defaultValue={initialData?.first_prize} className="admin-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">参加賞</label>
              <input name="participation_prize" defaultValue={initialData?.participation_prize} className="admin-input w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ゲスト</label>
              <input name="guests" defaultValue={initialData?.guests} className="admin-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">大会形式</label>
              <input name="format" defaultValue={initialData?.format} className="admin-input w-full" placeholder="例: スイスドロー, Bo3" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/admin/tournaments"
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            キャンセル
          </Link>
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? '保存中...' : '変更を保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
