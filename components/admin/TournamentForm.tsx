'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertTournament } from '@/lib/supabase/mutations';
import { Save, ArrowLeft, Image as ImageIcon, Eye } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';
import PreviewModal from './PreviewModal';

interface TournamentFormProps {
  initialData?: any;
  organizers: any[];
}

export default function TournamentForm({ initialData, organizers }: TournamentFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<any>(initialData || {});
  const [selectedOrganizerIds, setSelectedOrganizerIds] = useState<string[]>(
    initialData?.tournament_organizers?.map((to: any) => to.organizers.id) || 
    (initialData?.organizer_id ? [initialData.organizer_id] : [])
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOrganizerToggle = (id: string) => {
    setSelectedOrganizerIds(prev => 
      prev.includes(id) ? prev.filter(orgId => orgId !== id) : [...prev, id]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    
    // Convert status to appropriate format if needed
    try {
      await upsertTournament({
        ...initialData,
        ...data,
        participants: parseInt(data.participants as string) || 0,
        max_participants: parseInt(data.max_participants as string) || 0,
        organizer_ids: selectedOrganizerIds,
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
      {showPreview && (
        <PreviewModal 
          type="tournament" 
          data={{
            ...formData,
            organizers: organizers.filter(o => selectedOrganizerIds.includes(o.id))
          }} 
          onClose={() => setShowPreview(false)} 
        />
      )}

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
                onChange={handleInputChange}
                className="admin-input w-full" 
                required 
                placeholder="例: 第1回 せい杯 予選"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">主催者 (複数選択可) *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {organizers.map(org => (
                <label 
                  key={org.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedOrganizerIds.includes(org.id) 
                      ? 'bg-blue-500/10 border-blue-500/50 text-white' 
                      : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedOrganizerIds.includes(org.id)}
                    onChange={() => handleOrganizerToggle(org.id)}
                  />
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img src={org.image_url || 'https://picsum.photos/seed/default/100'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold truncate">{org.name}</span>
                </label>
              ))}
            </div>
            {selectedOrganizerIds.length === 0 && (
              <p className="text-[10px] text-red-400">※主催者を少なくとも1つ選択してください</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">開催日時 *</label>
              <input 
                type="datetime-local" 
                name="date" 
                defaultValue={initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : ''} 
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="admin-input w-full" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ステータス</label>
              <select name="status" defaultValue={initialData?.status || 'upcoming'} onChange={handleInputChange} className="admin-input w-full">
                <option value="upcoming">準備中 (Upcoming)</option>
                <option value="open">エントリー受付中 (Open)</option>
                <option value="closed">終了 (Closed)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">画像 URL</label>
            <div className="flex gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center shrink-0 w-12 h-12 text-gray-500 overflow-hidden">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Icon" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div className="flex-grow space-y-2">
                <input 
                  id="image_url_input"
                  name="image_url" 
                  defaultValue={initialData?.image_url} 
                  onChange={handleInputChange}
                  className="admin-input w-full" 
                  placeholder="https://..."
                />
                <CloudinaryUpload 
                  folder="tournaments"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('image_url_input') as HTMLInputElement;
                    if (el) {
                      el.value = url;
                      setFormData((prev: any) => ({ ...prev, image_url: url }));
                    }
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
              onChange={handleInputChange}
              className="admin-input w-full h-32 resize-none py-4" 
              placeholder="大会の概要やルール、参加資格などを入力してください..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">開催場所</label>
              <input name="location" defaultValue={initialData?.location} onChange={handleInputChange} className="admin-input w-full" placeholder="例: オンライン, 東京ビッグサイト" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">会場 URL (Google Maps等)</label>
              <input name="location_url" defaultValue={initialData?.location_url} onChange={handleInputChange} className="admin-input w-full" placeholder="https://maps.google.com/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">参加費</label>
              <input name="entry_fee" defaultValue={initialData?.entry_fee} onChange={handleInputChange} className="admin-input w-full" placeholder="例: 無料, 1500円" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">優勝景品</label>
              <input name="first_prize" defaultValue={initialData?.first_prize} onChange={handleInputChange} className="admin-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">参加賞</label>
              <input name="participation_prize" defaultValue={initialData?.participation_prize} onChange={handleInputChange} className="admin-input w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ゲスト</label>
              <input name="guests" defaultValue={initialData?.guests} onChange={handleInputChange} className="admin-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">大会形式</label>
              <input name="format" defaultValue={initialData?.format} onChange={handleInputChange} className="admin-input w-full" placeholder="例: スイスドロー, Bo3" />
            </div>
          </div>
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
