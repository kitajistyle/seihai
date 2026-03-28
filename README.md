# せい杯 (Seihai) - トレーディングカードゲーム大会プラットフォーム

「せい杯」は、全国で開催されるカードゲーム大会・トレーディングカードゲーム（TCG）大会、および eスポーツイベントの情報を発信し、大会参加登録、ランキング、イベントレポートを一元管理する総合プラットフォームです。

## 主な機能 (Features)

### 🟢 パブリック向け (公開画面)
- **大会一覧 (Tournaments)**
  - エントリー受付中、開催予定、終了済みなどのステータスに応じた大会リストの表示。
  - 大会ごとの詳細ページ（参加費用、地図情報、定員など）。
  - 大会へのエントリー申し込み（メールによる本人確認付き）。
- **プレイヤーランキング (Rankings)**
  - 大会実績に応じたポイント制による全国プレイヤートップランキング。
- **イベントレポート (Reports)**
  - 終了した大会の振り返り記事や、上位入賞プレイヤーの情報・デッキ写真などの掲載。
- **主催者一覧 (Organizers)**
  - 各大会の公式オーガナイザーや認定ジャッジなどの一覧と紹介。

### 🔴 管理者向け (コントロールパネル: `/admin`)
- **CRUD管理**
  - **大会管理**: 大会の新規作成、詳細編集、およびエントリーしてきたプレイヤーのステータス管理（承認・キャンセル）。
  - **プレイヤー管理**: プレイヤー名、アイコン画像、獲得ポイントの設定。
  - **レポート管理**: 大会終了後の結果レポートの作成、入賞者の手動登録。
  - **主催者管理**: 各オーガナイザーのプロフィール作成と、大会への紐付け管理。
- **画像一括アップロード**
  - Cloudinary と連携した直感的なサムネイルやアバター画像のアップロード。

## 技術スタック (Tech Stack)

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS Auth)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)
- **Email Delivery**: [Resend](https://resend.com/)
- **Deployment**: Vercel

## 開発環境のセットアップ (Getting Started)

### 1. リポジトリのクローンとパッケージインストール
```bash
git clone https://github.com/kitajistyle/seihai.git
cd seihai
npm install
```

### 2. 環境変数の設定
ルートディレクトリに `.env.local` を作成し、各種サービスの API キーを設定してください。  
（`supabase_schema.sql` を用いて、Supabase 上にテーブル等を構築しておく必要があります。）

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]   # サーバーサイドでのCRUD操作に必要

# Admin Authentication (Basic Auth for /admin)
ADMIN_USER=admin
ADMIN_PASSWORD=your_secure_password

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=[YOUR_CLOUD_NAME]
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=[YOUR_UNSIGNED_PRESET]

# Resend Configuration (Email Approval)
RESEND_API_KEY=re_[YOUR_RESEND_API_KEY]
RESEND_FROM_EMAIL=onboarding@resend.dev  # 本番運用時は検証済みドメインを指定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスすると、パブリック向けのページが表示されます。
管理者用ページには [http://localhost:3000/admin](http://localhost:3000/admin) からアクセス可能です（Basic 認証が必要です）。

## データベース設計 (Supabase Schema)

本プロジェクトのデータベース定義（DDL）は、ルートディレクトリの `supabase_schema.sql` にまとまっています。
プロジェクトを初期化する際は、Supabase の SQL Editor でこのファイルの中身を実行することで、必要なすべてのテーブル、RLSポリシー、および関連する構造が自動的に作成されます。

---
© Seihai Tournament System
