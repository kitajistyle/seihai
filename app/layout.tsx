import type { Metadata } from 'next';
import { Noto_Sans_JP, Outfit } from 'next/font/google';
import './globals.css';

const BASE_URL = 'https://every1-fes.vercel.app';

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
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'EVERY1 FES | トレーディングカードゲーム大会プラットフォーム',
    template: '%s | EVERY1 FES',
  },
  description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「EVERY1 FES」。大会参加登録、ランキング、イベントレポートを一元管理。',
  authors: [{ name: 'EVERY1 FES運営', url: BASE_URL }],
  creator: 'EVERY1 FES',
  publisher: 'EVERY1 FES',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: BASE_URL,
    siteName: 'EVERY1 FES',
    title: 'EVERY1 FES | トレーディングカードゲーム大会プラットフォーム',
    description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「EVERY1 FES」。大会参加登録、ランキング、イベントレポートを一元管理。',
    images: [
      {
        url: '/seisai-bg.png',
        width: 1200,
        height: 630,
        alt: 'EVERY1 FES - トレーディングカードゲーム大会プラットフォーム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EVERY1 FES | トレーディングカードゲーム大会プラットフォーム',
    description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「EVERY1 FES」。',
    images: ['/seisai-bg.png'],
  },
  verification: {
    google: 'ulYgwo65_dR5Ti_ISHyurdA33nZwzLPfQzYTTRuiWEw',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EVERY1 FES',
  alternateName: ['every1-fes', 'EVERY1 FES大会プラットフォーム'],
  url: BASE_URL,
  description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム。',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/tournaments?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
