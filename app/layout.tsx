import type { Metadata } from 'next';
import { Noto_Sans_JP, Outfit } from 'next/font/google';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    default: 'せい祭 | トレーディングカードゲーム大会プラットフォーム',
    template: '%s | せい祭',
  },
  description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「せい祭」。大会参加登録、ランキング、イベントレポートを一元管理。',
  keywords: [
    'せい祭',
    'カードゲーム大会',
    'トレーディングカードゲーム',
    'トレーディングカードゲーム大会',
    'カードゲーム',
    'eスポーツ',
    '大会登録'
    // 'ランキング'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
