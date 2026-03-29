'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertPlayer } from '@/lib/supabase/mutations';
import { Save, ArrowLeft, UserCircle } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';

interface PlayerFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export default function PlayerForm({ initialData }: PlayerFormProps) {
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
      await upsertPlayer({
        ...initialData,
        ...data,
        points: parseInt(data.points as string) || 0,
      });
      router.push('/admin/players');
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/players" className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-white">{initialData ? 'プレイヤーを編集' : '新規プレイヤー作成'}</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 flex items-center gap-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-panel p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">プレイヤー名 *</label>
            <input 
              name="name" 
              defaultValue={initialData?.name} 
              className="admin-input w-full" 
              required 
              placeholder="例: KAZUYA"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ランキングポイント</label>
            <input 
              type="number" 
              name="points" 
              defaultValue={initialData?.points || 0} 
              className="admin-input w-full" 
              required 
            />
            <p className="text-[10px] text-gray-500 mt-1">このポイントを元にランキングが自動計算されます。</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">X (Twitter) ID</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold">@</span>
              <input 
                name="x_id" 
                defaultValue={initialData?.x_id} 
                className="admin-input w-full" 
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">アバター画像 URL</label>
            <div className="flex gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center shrink-0 w-12 h-12 text-gray-500">
                <UserCircle size={20} />
              </div>
              <div className="flex-grow space-y-2">
                <input 
                  id="avatar_url_input"
                  name="avatar_url" 
                  defaultValue={initialData?.avatar_url} 
                  className="admin-input w-full" 
                  placeholder="https://..."
                />
                <CloudinaryUpload 
                  folder="players"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('avatar_url_input') as HTMLInputElement;
                    if (el) el.value = url;
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/admin/players"
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
