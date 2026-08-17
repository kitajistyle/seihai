import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP, Outfit } from 'next/font/google';
import './globals.css';

const BASE_URL = 'https://seisai.vercel.app';

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

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'せい祭 | トレーディングカードゲーム大会プラットフォーム',
    template: '%s | せい祭',
  },
  description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「せい祭」。大会参加登録、ランキング、イベントレポートを一元管理。',
  authors: [{ name: 'せい祭運営', url: BASE_URL }],
  creator: 'せい祭',
  publisher: 'せい祭',
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
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: BASE_URL,
    siteName: 'せい祭',
    title: 'せい祭 | トレーディングカードゲーム大会プラットフォーム',
    description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「せい祭」。大会参加登録、ランキング、イベントレポートを一元管理。',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'せい祭 - トレーディングカードゲーム大会プラットフォーム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'せい祭 | トレーディングカードゲーム大会プラットフォーム',
    description: '全国で開催されるカードゲーム大会・トレーディングカードゲーム大会の情報を発信するプラットフォーム「せい祭」。',
    images: [`${BASE_URL}/og-image.png`],
  },
  verification: {
    google: 'ulYgwo65_dR5Ti_ISHyurdA33nZwzLPfQzYTTRuiWEw',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'せい祭',
  alternateName: ['every1-fes', 'せい祭大会プラットフォーム'],
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
