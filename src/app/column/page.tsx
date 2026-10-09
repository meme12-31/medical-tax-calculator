import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/columns';
import { ArticleCard } from '@/components/column/ArticleCard';
import { ToolCtaBanner } from '@/components/column/ToolCtaBanner';
import { RelatedToolsCard } from '@/components/RelatedToolsCard';
import { BookOpen, ChevronRight, Home, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: '医療費控除のお役立ち解説コラム一覧 | HITtools',
  description:
    '医療費控除の対象範囲や計算式、家族合算の裏ワザ、セルフメディケーション税制との比較までわかりやすく解説。確定申告の疑問を解消。無料・登録不要で試算可能。',
  alternates: {
    canonical: 'https://hit-tool.com/medical-tax-calculator/column',
  },
  openGraph: {
    title: '医療費控除のお役立ち解説コラム一覧 | HITtools',
    description:
      '医療費控除の対象範囲や計算式、家族合算の裏ワザ、セルフメディケーション税制との比較までわかりやすく解説。確定申告の疑問を解消。無料・登録不要で試算可能。',
    url: 'https://hit-tool.com/medical-tax-calculator/column',
    siteName: 'HITtools',
    images: [
      {
        url: 'https://hit-tool.com/medical-tax-calculator/images/logo.png',
        width: 1200,
        height: 630,
        alt: '医療費控除お役立ち解説コラム一覧',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function ColumnIndexPage() {
  const articles = getAllArticles();

  // 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: 'https://hit-tool.com/medical-tax-calculator',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '解説コラム一覧',
            item: 'https://hit-tool.com/medical-tax-calculator/column',
          },
        ],
      },
      {
        '@type': 'ItemList',
        itemListElement: articles.map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `https://hit-tool.com/medical-tax-calculator/column/${art.slug}`,
          name: art.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* パンくずリスト */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          <ol className="flex items-center gap-2 flex-wrap">
            <li className="flex items-center gap-1 hover:text-slate-800">
              <Home className="w-3.5 h-3.5" />
              <Link href="/">計算ツール</Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </li>
            <li className="text-slate-800 font-bold" aria-current="page">
              解説コラム一覧
            </li>
          </ol>
        </nav>

        {/* ヘッダーセクション */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200">
            <BookOpen className="w-3.5 h-3.5 text-brand-600" />
            <span>全10本の専門解説記事を公開中</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-normal leading-normal">
            医療費控除お役立ち解説コラム一覧
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed tracking-normal">
            医療費控除の基礎知識や計算方法、対象となる費用の境界線、家族合算で損をしない申告方法まで、税理士基準の分かりやすい解説をお届けします。
          </p>
        </div>

        {/* コラム記事グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* ツールへの誘導バナー */}
        <ToolCtaBanner
          title="あなたの医療費控除の還付額をシミュレーションしてみませんか？"
          description="年収と医療費を入力するだけで、所得税還付と住民税減額の目安を30秒で自動算出。家族の中で誰が申告すべきかも一目でわかります。"
        />

        {/* 関連Webツールカード */}
        <RelatedToolsCard />
      </div>
    </>
  );
}
