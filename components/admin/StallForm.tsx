'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertStall } from '@/lib/db/mutations';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, ShoppingBag } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import Link from 'next/link';

interface StallFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export default function StallForm({ initialData }: StallFormProps) {
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
      await upsertStall({
        ...initialData,
        ...data,
        display_order: Number(data.display_order) || 0,
      });
      router.push('/admin/stalls');
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stalls" className="p-2 hover:bg-zinc-100 rounded-lg text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-zinc-900">{initialData ? '出店者を編集' : '新規出店者作成'}</h1>
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
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">出店者名 *</label>
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-gray-500" size={18} />
                <input
                  name="name"
                  defaultValue={initialData?.name}
                  className="admin-input w-full"
                  required
                  placeholder="例: TCGショップ 聖杯"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ジャンル</label>
              <input
                name="genre"
                defaultValue={initialData?.genre}
                className="admin-input w-full"
                placeholder="例: カードゲーム、フード、グッズ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">公式サイト URL</label>
            <div className="flex items-center gap-2">
              <LinkIcon className="text-gray-500" size={18} />
              <input
                name="url"
                defaultValue={initialData?.url}
                className="admin-input w-full"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">表示順</label>
            <input
              name="display_order"
              type="number"
              defaultValue={initialData?.display_order ?? 0}
              className="admin-input w-32"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">画像 URL</label>
            <div className="flex gap-2">
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 flex items-center justify-center shrink-0 w-12 h-12 text-zinc-500 overflow-hidden">
                {initialData?.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={initialData.image_url} alt="Stall" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div className="flex-grow space-y-2">
                <input
                  id="stall_image_url_input"
                  name="image_url"
                  defaultValue={initialData?.image_url}
                  className="admin-input w-full"
                  placeholder="https://..."
                />
                <CloudinaryUpload
                  folder="stalls"
                  onUploadSuccess={(url) => {
                    const el = document.getElementById('stall_image_url_input') as HTMLInputElement;
                    if (el) el.value = url;
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">説明</label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              className="admin-input w-full h-32 resize-none py-4"
              placeholder="出店者の紹介文を入力してください..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/stalls"
            className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isPending ? '保存中...' : '出店者を保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
