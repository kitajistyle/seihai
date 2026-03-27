'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertOrganizer } from '@/lib/supabase/mutations';
import { Save, ArrowLeft, Image as ImageIcon, Globe, User } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';

interface OrganizerFormProps {
  initialData?: any;
}

export default function OrganizerForm({ initialData }: OrganizerFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await upsertOrganizer({
        ...initialData,
        ...data,
      });
      router.push('/admin/organizers');
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
        <Link href="/admin/organizers" className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-white">{initialData ? '主催者を編集' : '新規主催者作成'}</h1>
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
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">主催者名 *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  name="name" 
                  defaultValue={initialData?.name} 
                  className="admin-input w-full pl-10" 
                  required 
                  placeholder="例: 高橋 誠"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">肩書き</label>
              <input 
                name="title" 
                defaultValue={initialData?.title} 
                className="admin-input w-full" 
                placeholder="例: 日本代表監督、エースゲーミング代表"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">X (Twitter) ID</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                name="x_id" 
                defaultValue={initialData?.x_id} 
                className="admin-input w-full pl-10" 
                placeholder="Twitter ID（@なし）"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">アイコン画像 URL</label>
            <div className="flex gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center shrink-0 w-12 h-12 text-gray-500 overflow-hidden">
                {initialData?.image_url ? (
                  <img src={initialData.image_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} />
                )}
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
                  folder="organizers"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('image_url_input') as HTMLInputElement;
                    if (el) el.value = url;
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">自己紹介 / 説明</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description} 
              className="admin-input w-full h-32 resize-none py-4" 
              placeholder="主催者の紹介文を入力してください..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/admin/organizers"
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            キャンセル
          </Link>
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? '保存中...' : '主催者を保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
