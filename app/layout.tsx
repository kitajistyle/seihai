import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'E-SPORTS HUB | eスポーツ大会プラットフォーム',
    template: '%s | E-SPORTS HUB',
  },
  description: '全国のeスポーツ・カードゲーム大会の情報を発信。大会参加登録、ランキング、イベントレポートを一元管理。',
  keywords: ['eスポーツ', 'ゲーム大会', 'カードゲーム', 'トーナメント', 'ランキング'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
