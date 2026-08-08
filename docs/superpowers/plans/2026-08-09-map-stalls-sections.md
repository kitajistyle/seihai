# マップ・出店セクション追加 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ホームページにGoogle Maps埋め込みセクションと出店者一覧セクションを追加し、管理画面でCRUD操作できるようにする。

**Architecture:** `stalls`テーブルを新規作成してDBから出店者データを取得。`MapSection`（静的iframeコンポーネント）と`StallPickupSection`（動的カードグリッド）を既存のPickupSectionパターンに倣って実装。管理画面は`/admin/organizers`と同じ構造を複製する。

**Tech Stack:** Next.js 15 (App Router), TypeScript, Neon PostgreSQL (`@neondatabase/serverless` + `pg`), React Server Components, Tailwind CSS

## Global Constraints

- `'use server'` は mutations.ts のファイルトップにすでに宣言済み — 新しいexport関数に個別につけない
- クエリ関数は `cache()` from `react` でラップする
- 管理フォームは `'use client'` Client Component
- 画像アップロードは既存の `CloudinaryUpload` コンポーネントを使う
- スタイルは `glass-panel`, `admin-input`, `FadeInView` など既存クラスを使う
- `revalidatePath` は mutations の末尾で呼ぶ

---

## File Map

| 操作 | ファイル |
|------|---------|
| 新規作成 | `supabase_migration_add_stalls.sql` |
| 変更 | `types/index.ts` |
| 変更 | `lib/db/queries.ts` |
| 変更 | `lib/db/mutations.ts` |
| 新規作成 | `components/MapSection.tsx` |
| 新規作成 | `components/StallPickupSection.tsx` |
| 新規作成 | `components/admin/StallForm.tsx` |
| 新規作成 | `app/admin/stalls/page.tsx` |
| 新規作成 | `app/admin/stalls/new/page.tsx` |
| 新規作成 | `app/admin/stalls/[id]/edit/page.tsx` |
| 変更 | `app/(public)/page.tsx` |
| 変更 | `app/admin/layout.tsx` |

---

### Task 1: DBマイグレーション + 型定義

**Files:**
- Create: `supabase_migration_add_stalls.sql`
- Modify: `types/index.ts`

**Interfaces:**
- Produces: `Stall` 型（後続タスクすべてが使用）

- [ ] **Step 1: マイグレーションSQLを作成**

`supabase_migration_add_stalls.sql` を以下の内容で作成：

```sql
CREATE TABLE IF NOT EXISTS stalls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  image_url TEXT,
  url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public stalls are viewable by everyone." ON stalls FOR SELECT USING (true);
```

- [ ] **Step 2: `Stall` 型を `types/index.ts` に追加**

既存の `export interface Organizer { ... }` ブロックの直後に追加：

```ts
export interface Stall {
  id: string;
  name: string;
  genre: string | null;
  description: string | null;
  image_url: string | null;
  url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}
```

- [ ] **Step 3: コミット**

```bash
git add supabase_migration_add_stalls.sql types/index.ts
git commit -m "feat: stalls DB migration and Stall type"
```

---

### Task 2: DBクエリ・ミューテーション

**Files:**
- Modify: `lib/db/queries.ts`
- Modify: `lib/db/mutations.ts`

**Interfaces:**
- Consumes: `Stall` 型 from `types/index.ts`
- Produces:
  - `getStalls(): Promise<Stall[]>`
  - `getStallById(id: string): Promise<Stall | null>`
  - `upsertStall(formData: any): Promise<void>`
  - `deleteStall(id: string): Promise<void>`

- [ ] **Step 1: `getStalls` と `getStallById` を `lib/db/queries.ts` に追加**

ファイル末尾の `export const getOrganizerById = ...` ブロックの直後に追加：

```ts
export const getStalls = cache(async (): Promise<Stall[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM stalls
      ORDER BY display_order ASC, created_at ASC
    `;
    return rows as Stall[];
  } catch (error) {
    console.error('Error fetching stalls:', error);
    return [];
  }
});

export const getStallById = cache(async (id: string): Promise<Stall | null> => {
  try {
    const { rows } = await sql`SELECT * FROM stalls WHERE id = ${id}`;
    return (rows[0] as Stall) || null;
  } catch (error) {
    console.error('Error fetching stall:', error);
    return null;
  }
});
```

`Stall` をインポートに追加（ファイル先頭の import 行を修正）：
```ts
import { Tournament, PlayerRank, Organizer, EventReport, Registration, Announcement, Stall } from '@/types';
```

- [ ] **Step 2: `upsertStall` と `deleteStall` を `lib/db/mutations.ts` に追加**

ファイル末尾に追加：

```ts
/**
 * 出店者情報の作成・更新
 */
export async function upsertStall(formData: any) {
  const { id, ...rest } = formData;
  const client = await db.connect();
  try {
    if (id) {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE stalls SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(
        `INSERT INTO stalls (${cols}) VALUES (${placeholders})`,
        values
      );
    }
  } finally {
    client.release();
  }
  revalidatePath('/');
  revalidatePath('/admin/stalls');
}

/**
 * 出店者の削除
 */
export async function deleteStall(id: string) {
  await sql`DELETE FROM stalls WHERE id = ${id}`;
  revalidatePath('/');
  revalidatePath('/admin/stalls');
}
```

- [ ] **Step 3: コミット**

```bash
git add lib/db/queries.ts lib/db/mutations.ts
git commit -m "feat: stalls DB queries and mutations"
```

---

### Task 3: MapSection コンポーネント

**Files:**
- Create: `components/MapSection.tsx`

**Interfaces:**
- Produces: `<MapSection />` — props なし、静的コンポーネント

- [ ] **Step 1: `components/MapSection.tsx` を作成**

```tsx
import FadeInView from '@/components/FadeInView';

export default function MapSection() {
  return (
    <section className="relative py-24">
      <div className="text-center mb-16 relative">
        <FadeInView>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-tighter text-gradient-premium">
            会場アクセス
          </h2>
          <div className="w-32 h-3 bg-gradient-to-r from-white to-zinc-450 mx-auto mb-6 rounded-sm" />
          <p className="text-white font-medium tracking-widest">全大会は同一会場で開催されます</p>
        </FadeInView>
      </div>

      <FadeInView>
        <div className="glass-panel overflow-hidden rounded-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.827853458474!2d139.74454!3d35.68536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfbd89f700b%3A0x277c49ba34ed38!2z5p2x5Lqs6aeF!5e0!3m2!1sja!2sjp!4v1600000000000!5m2!1sja!2sjp"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="会場マップ"
          />
        </div>
      </FadeInView>
    </section>
  );
}
```

> **Note:** `src` の URL は会場が確定したら差し替える。現在は東京駅をプレースホルダーとして使用。

- [ ] **Step 2: コミット**

```bash
git add components/MapSection.tsx
git commit -m "feat: MapSection component with placeholder embed"
```

---

### Task 4: StallPickupSection コンポーネント

**Files:**
- Create: `components/StallPickupSection.tsx`

**Interfaces:**
- Consumes: `Stall` 型 from `types/index.ts`
- Produces: `<StallPickupSection stalls={Stall[]} />` — データ0件なら呼び出し側で非表示

- [ ] **Step 1: `components/StallPickupSection.tsx` を作成**

```tsx
import FadeInView from '@/components/FadeInView';
import { Stall } from '@/types';
import { ExternalLink, ShoppingBag } from 'lucide-react';

interface StallPickupSectionProps {
  stalls: Stall[];
}

export default function StallPickupSection({ stalls }: StallPickupSectionProps) {
  return (
    <section className="relative py-24">
      <div className="text-center mb-16 relative">
        <FadeInView>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-tighter text-gradient-premium flex items-center justify-center gap-2">
            出店一覧
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
          </h2>
          <div className="w-32 h-3 bg-gradient-to-r from-white to-zinc-450 mx-auto mb-6 rounded-sm" />
          <p className="text-white font-medium tracking-widest">イベント会場で出店中のショップ</p>
        </FadeInView>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stalls.map((stall, index) => (
          <FadeInView
            key={stall.id}
            delay={index * 0.15}
            className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 transition-all duration-300 group"
          >
            {stall.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stall.image_url}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl object-cover group-hover:scale-105 transition-all duration-500 shadow-md shrink-0"
                alt={stall.name}
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                <ShoppingBag className="text-zinc-500 w-8 h-8" />
              </div>
            )}
            <div className="flex-grow min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 text-black transition-all">{stall.name}</h3>
              {stall.genre && (
                <p className="text-black text-sm font-bold mb-3 tracking-wide">{stall.genre}</p>
              )}
              {stall.description && (
                <p className="text-black text-sm leading-relaxed line-clamp-2 font-medium">{stall.description}</p>
              )}
              {stall.url && (
                <a
                  href={stall.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-white hover:underline"
                >
                  <ExternalLink size={12} /> 公式サイト
                </a>
              )}
            </div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: コミット**

```bash
git add components/StallPickupSection.tsx
git commit -m "feat: StallPickupSection component"
```

---

### Task 5: Admin StallForm コンポーネント

**Files:**
- Create: `components/admin/StallForm.tsx`

**Interfaces:**
- Consumes: `upsertStall` from `lib/db/mutations`
- Produces: `<StallForm initialData?: any />` — 新規作成・編集を兼ねる

- [ ] **Step 1: `components/admin/StallForm.tsx` を作成**

```tsx
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
```

- [ ] **Step 2: コミット**

```bash
git add components/admin/StallForm.tsx
git commit -m "feat: admin StallForm component"
```

---

### Task 6: Admin 出店者管理ページ (一覧・新規・編集)

**Files:**
- Create: `app/admin/stalls/page.tsx`
- Create: `app/admin/stalls/new/page.tsx`
- Create: `app/admin/stalls/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `getStalls()`, `getStallById()` from `lib/db/queries`
- Consumes: `deleteStall()` from `lib/db/mutations`
- Consumes: `<StallForm />` from `components/admin/StallForm`

- [ ] **Step 1: `app/admin/stalls/page.tsx` を作成（一覧ページ）**

```tsx
import { getStalls } from '@/lib/db/queries';
import { deleteStall } from '@/lib/db/mutations';
import Link from 'next/link';
import { Plus, Edit, Trash2, ShoppingBag, ExternalLink } from 'lucide-react';

export default async function AdminStallsPage() {
  const stalls = await getStalls();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">出店者管理</h1>
          <p className="text-sm text-black mt-1">イベントに出店する店舗情報を管理します</p>
        </div>
        <Link
          href="/admin/stalls/new"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <Plus size={18} /> 新規作成
        </Link>
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">出店者</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">ジャンル</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">表示順</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {stalls.map((stall) => (
              <tr key={stall.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                      {stall.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={stall.image_url} alt={stall.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="text-zinc-500" size={20} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-black block">{stall.name}</span>
                      {stall.url && (
                        <a href={stall.url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 flex items-center gap-1 hover:text-black">
                          <ExternalLink size={10} /> サイト
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-black">{stall.genre || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-black">{stall.display_order}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/stalls/${stall.id}/edit`}
                      className="p-2 text-zinc-750 hover:text-[var(--color-brand-blue)] hover:bg-zinc-100 rounded-lg transition-all"
                    >
                      <Edit size={18} />
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteStall(stall.id);
                    }}>
                      <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {stalls.map((stall) => (
          <div key={stall.id} className="glass-panel p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                {stall.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={stall.image_url} alt={stall.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="text-zinc-500" size={24} />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-black">{stall.name}</h3>
                <p className="text-xs text-black">{stall.genre || 'ジャンル未設定'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
              <span className="text-xs text-zinc-500">表示順: {stall.display_order}</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/stalls/${stall.id}/edit`}
                  className="p-2 text-zinc-700 hover:text-black"
                >
                  <Edit size={20} />
                </Link>
                <form action={async () => {
                  'use server';
                  await deleteStall(stall.id);
                }}>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `app/admin/stalls/new/page.tsx` を作成**

```tsx
import StallForm from '@/components/admin/StallForm';

export default function NewStallPage() {
  return <StallForm />;
}
```

- [ ] **Step 3: `app/admin/stalls/[id]/edit/page.tsx` を作成**

```tsx
import StallForm from '@/components/admin/StallForm';
import { getStallById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

export default async function EditStallPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const stall = await getStallById(params.id);

  if (!stall) {
    notFound();
  }

  return <StallForm initialData={stall} />;
}
```

- [ ] **Step 4: コミット**

```bash
git add app/admin/stalls/
git commit -m "feat: admin stalls CRUD pages"
```

---

### Task 7: ホームページ + Admin ナビ へ組み込み

**Files:**
- Modify: `app/(public)/page.tsx`
- Modify: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: `getStalls()` from `lib/db/queries`
- Consumes: `<MapSection />` from `components/MapSection`
- Consumes: `<StallPickupSection />` from `components/StallPickupSection`

- [ ] **Step 1: `app/(public)/page.tsx` を更新**

インポートに追加：
```tsx
import MapSection from '@/components/MapSection';
import StallPickupSection from '@/components/StallPickupSection';
```

`Promise.all` に `getStalls()` を追加：
```tsx
const [tournaments, organizers, reports, heroTournaments, announcements, stalls] = await Promise.all([
  getTournaments(),
  getOrganizers(),
  getReports(5),
  getHeroTournaments(),
  getAnnouncements(true),
  getStalls(),
]);
```

JSX の `<NewsSection>` の直後（`<TournamentPickupSection>` の前）に追加：
```tsx
<MapSection />
{stalls && stalls.length > 0 && <StallPickupSection stalls={stalls} />}
```

- [ ] **Step 2: `app/admin/layout.tsx` の Admin ナビに出店者管理リンクを追加**

`SidebarContent` の「コンテンツ管理」セクション内、`<AdminNavLink href="/admin/announcements" ...>お知らせ管理</AdminNavLink>` の直後に追加：

```tsx
<AdminNavLink href="/admin/stalls" icon={<ShoppingBag size={18} />} onClick={onItemClick}>出店者管理</AdminNavLink>
```

`ShoppingBag` を lucide-react のインポートに追加：
```tsx
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Bell,
  ShoppingBag,
} from 'lucide-react';
```

- [ ] **Step 3: ビルドエラーがないか確認**

```bash
cd /Users/na/ghq/github.com/kitajistyle/seihai && npx tsc --noEmit
```

エラーがあれば修正する。

- [ ] **Step 4: コミット**

```bash
git add "app/(public)/page.tsx" app/admin/layout.tsx
git commit -m "feat: wire up MapSection and StallPickupSection to home page and admin nav"
```
