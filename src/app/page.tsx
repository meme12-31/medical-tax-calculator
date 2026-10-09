import React from 'react';
import { Metadata } from 'next';
import { MedicalCalculatorApp } from '@/components/MedicalCalculatorApp';
import { FaqSection } from '@/components/FaqSection';
import { FAQ_ITEMS } from '@/lib/faq';
import { ColumnPickupSection } from '@/components/ColumnPickupSection';
import { RelatedToolsCard } from '@/components/RelatedToolsCard';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Home,
  ChevronRight,
} from 'lucide-react';

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
};

export default function HomePage() {
  // 構造化データ (JSON-LD: BreadcrumbList + WebApplication + FAQPage)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'HITtools',
            item: 'https://hit-tool.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '医療費控除シミュレーター',
            item: 'https://hit-tool.com/medical-tax-calculator',
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: '医療費控除の還付額計算シミュレーター',
        url: 'https://hit-tool.com/medical-tax-calculator',
        description:
          '医療費控除の還付額と住民税軽減額を30秒で自動計算。1年間の医療費と年収を入力するだけで、家族合算やセルフメディケーション税制との比較判定、ふるさと納税上限額への影響も一発把握。無料・登録不要で使えます。',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* パンくずリスト */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          <ol className="flex items-center gap-2 flex-wrap">
            <li className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <a
                href="https://hit-tool.com/"
                className="hover:underline hover:text-slate-900 transition-colors"
              >
                ホーム
              </a>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </li>
            <li className="text-slate-800 font-bold" aria-current="page">
              医療費控除シミュレーター
            </li>
          </ol>
        </nav>

        {/* ページヒーロー・導入セクション (サーバーサイドレンダリング) */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>2026年（令和8年）確定申告対応 / 無料・登録不要</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-normal leading-normal">
            医療費控除の還付額計算シミュレーター
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed tracking-normal">
            1年間に支払った医療費や市販薬代から、確定申告で戻ってくる所得税の還付金と翌年の住民税軽減額を瞬時にシミュレーション。「通常控除 vs セルフメディケーション」の有利判定や、家族の中で誰が申告すべきかも自動判定します。
          </p>

          {/* 3つの主要メリットバッジ */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              家族合算で誰が一番得か判定
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              セルフメディケーション自動比較
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ふるさと納税上限への影響も表示
            </span>
          </div>
        </section>

        {/* 計算ツール本体（クライアントサイド・インタラクティブ） */}
        <MedicalCalculatorApp />

        {/* 使い方ガイド・解説セクション (初期HTML/サーバーサイドレンダリング) */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              医療費控除シミュレーターの使い方と3つのチェックポイント
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              確定申告で損をしないための最適な申告手順
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                世帯の年収を入力
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                確定申告をする本人および配偶者の年収を入力します。所得税率が自動算出され、どちらが申告した方が節税額が大きくなるかを判定します。
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                医療費・薬代を入力
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1年間に支払った病院代・薬代・通院交通費を入力します。保険金で補填された金額があれば入力すると、該当治療費から正しく差し引かれます。
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                有利判定と明細出力
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                「通常控除」と「セルフメディケーション税制」のどちらがお得かを確認し、明細データをCSV保存またはA4用紙に印刷して申告準備に活用できます。
              </p>
            </div>
          </div>
        </section>

        {/* よくある質問 (FAQアコーディオン - SSR初期HTMLレンダリング) */}
        <FaqSection />

        {/* お役立ちコラム最新3件ピックアップセクション */}
        <ColumnPickupSection />

        {/* おすすめWeb関連ツールカード (4枠) */}
        <RelatedToolsCard />
      </div>
    </>
  );
}
