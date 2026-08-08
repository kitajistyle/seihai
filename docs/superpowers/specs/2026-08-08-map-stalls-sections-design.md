# ホームページ: マップ・出店セクション追加

## 概要

せい祭トップページに「会場マップ」と「出店者一覧」の2セクションを追加する。全大会は同一会場で開催されるためマップは静的。出店者データはDBで管理し、管理画面からCRUD操作できる。

---

## 1. DBスキーマ

### `stalls` テーブル（新規）

```sql
CREATE TABLE stalls (
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

---

## 2. 型定義

`types/index.ts`（または同等のファイル）に追加：

```ts
export type Stall = {
  id: string;
  name: string;
  genre: string | null;
  description: string | null;
  image_url: string | null;
  url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};
```

---

## 3. DB クエリ・ミューテーション

### `lib/db/queries.ts`

```ts
export const getStalls = cache(async (): Promise<Stall[]> => {
  // SELECT * FROM stalls ORDER BY display_order ASC, created_at ASC
});
```

### `lib/db/mutations.ts`

- `createStall(data)`
- `updateStall(id, data)`
- `deleteStall(id)`

---

## 4. コンポーネント

### `components/MapSection.tsx`（新規・静的）

- Google Maps iframe埋め込み（`<iframe src="https://www.google.com/maps/embed?..." />`）
- アドレスはプレースホルダー（後で会場URLに差し替え）
- スタイル: `py-24` / `FadeInView` / 既存セクションと統一

### `components/StallPickupSection.tsx`（新規・動的）

- Props: `stalls: Stall[]`
- `OrganizerPickupSection` と同様のカードグリッドレイアウト
- 各カードに: 画像、名前、ジャンル、説明を表示
- URLがある場合は外部リンクを表示
- データが0件のときはセクション自体を非表示

---

## 5. Admin管理画面

### 追加するページ

| パス | 役割 |
|------|------|
| `/admin/stalls` | 出店者一覧 |
| `/admin/stalls/new` | 新規作成フォーム |
| `/admin/stalls/[id]/edit` | 編集フォーム |

既存の `/admin/organizers/` と同じコード構造・UIパターンを踏襲。

AdminサイドバーナビゲーションにSidebarリンクを追加。

---

## 6. ホームページへの組み込み

`app/(public)/page.tsx` の変更：

- `getStalls()` を `Promise.all` に追加
- セクション表示順:

```
HeroSection
NewsSection
MapSection          ← 新規（静的）
StallPickupSection  ← 新規（stalls.length > 0 の場合のみ表示）
TournamentPickupSection
OrganizerPickupSection
ReportPickupSection
```

---

## 7. 対象外（スコープ外）

- 会場の実際のGoogle Maps URL（後で設定）
- マップURLの管理画面からの動的設定
- 出店者の詳細ページ
