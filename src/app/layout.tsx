import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://medical-tax-calculator.vercel.app'),
  title: '医療費控除の還付額計算シミュレーター | HITtools',
  description: '医療費控除の還付額と住民税軽減額を30秒で自動計算。',
  alternates: {
    canonical: 'https://medical-tax-calculator.vercel.app/medical-tax-calculator',
  },
  openGraph: {
    title: '医療費控除の還付額計算シミュレーター | HITtools',
    description: '医療費控除の還付額と住民税軽減額を30秒で自動計算。',
    url: 'https://medical-tax-calculator.vercel.app/medical-tax-calculator',
    siteName: 'HITtools',
    images: [
      {
        url: 'https://medical-tax-calculator.vercel.app/images/ogp.png',
        width: 1200,
        height: 630,
        alt: '医療費控除の還付額計算シミュレーター',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://medical-tax-calculator.vercel.app/images/ogp.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/medical-tax-calculator/images/logo.png" />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans">
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
