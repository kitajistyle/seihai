import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'せい杯 | eスポーツ大会プラットフォーム',
    template: '%s | せい杯',
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
