import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'せい杯 | トレーディングカードゲーム大会プラットフォーム',
    template: '%s | せい杯',
  },
  description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「せい杯」。大会参加登録、ランキング、イベントレポートを一元管理。',
  keywords: [
    'せい杯',
    'カードゲーム大会',
    'トレーディングカードゲーム',
    'トレーディングカードゲーム大会',
    'カードゲーム',
    'eスポーツ',
    '大会登録',
    'ランキング'
  ],
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
