'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertAnnouncement } from '@/lib/db/mutations';
import { Save, ArrowLeft, Bell } from 'lucide-react';
import Link from 'next/link';
import { Announcement } from '@/types';

interface AnnouncementFormProps {
  initialData?: Partial<Announcement>;
}

export default function AnnouncementForm({ initialData }: AnnouncementFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await upsertAnnouncement({
        ...initialData,
        ...data,
        is_active: isActive,
      });
      router.push('/admin/announcements');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '保存に失敗しました。');
      setIsPending(false);
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-all placeholder:text-gray-600";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/announcements" className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
              <Bell size={22} className="text-[var(--color-brand-blue)]" />
              {initialData?.id ? 'お知らせを編集' : 'お知らせを作成'}
            </h1>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all disabled:opacity-50"
        >
          <Save size={16} /> {isPending ? '保存中...' : '保存'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="glass-panel p-6 space-y-6">
        <div>
          <label className={labelClass}>タイトル <span className="text-red-400">*</span></label>
          <input
            name="title"
            required
            defaultValue={initialData?.title}
            placeholder="お知らせのタイトルを入力"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>本文</label>
          <textarea
            name="content"
            rows={4}
            defaultValue={initialData?.content}
            placeholder="詳細な内容（任意）"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>種別</label>
            <select name="type" defaultValue={initialData?.type || 'info'} className={inputClass}>
              <option value="info">インフォ（青）</option>
              <option value="new">新着（緑）</option>
              <option value="warning">注意（黄）</option>
              <option value="success">完了（灰）</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>リンクURL</label>
            <input
              name="url"
              type="url"
              defaultValue={initialData?.url}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-[var(--color-brand-blue)]' : 'bg-white/10'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-400">
            {isActive ? '公開中' : '非公開'}
          </span>
        </div>
      </div>
    </form>
  );
}
