import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://hit-tool.com'),
  title: '医療費控除の還付額計算 | 確定申告で戻る税金を簡単シミュレーション',
  description:
    '医療費控除の還付額と住民税軽減額を30秒で自動計算。1年間の医療費と年収を入力するだけで、家族合算やセルフメディケーション税制との比較判定、ふるさと納税上限額への影響も一発把握。無料・登録不要で使えます。',
  alternates: {
    canonical: 'https://hit-tool.com/medical-tax-calculator',
  },
  openGraph: {
    title: '医療費控除の還付額計算 | 確定申告で戻る税金を簡単シミュレーション',
    description:
      '医療費控除の還付額と住民税軽減額を30秒で自動計算。1年間の医療費と年収を入力するだけで、家族合算やセルフメディケーション税制との比較判定、ふるさと納税上限額への影響も一発把握。無料・登録不要で使えます。',
    url: 'https://hit-tool.com/medical-tax-calculator',
    siteName: '医療費控除シミュレーター',
    images: [
      {
        url: 'https://hit-tool.com/medical-tax-calculator/ogp.png',
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
    title: '医療費控除の還付額計算 | 確定申告で戻る税金を簡単シミュレーション',
    description:
      '医療費控除の還付額と住民税軽減額を30秒で自動計算。1年間の医療費と年収を入力するだけで、家族合算やセルフメディケーション税制との比較判定、ふるさと納税上限額への影響も一発把握。無料・登録不要で使えます。',
    images: ['https://hit-tool.com/medical-tax-calculator/ogp.png'],
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
        {/* Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KXFP18WL67"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KXFP18WL67');
            `,
          }}
        />
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
