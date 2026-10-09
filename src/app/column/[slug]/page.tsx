import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/columns';
import { ToolCtaBanner } from '@/components/column/ToolCtaBanner';
import { RelatedToolsCard } from '@/components/RelatedToolsCard';
import { FaqSection } from '@/components/FaqSection';
import {
  Calendar,
  ChevronRight,
  Home,
  Tag,
  BookOpen,
  Calculator,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: '記事が見つかりません | HITtools',
    };
  }

  // 32文字以内調整 (キーワード優先)
  let metaTitle = `${article.title} | HITtools`;
  if (metaTitle.length > 32) {
    metaTitle = `${article.title.slice(0, 29)}...`;
  }

  return {
    title: metaTitle,
    description: article.description,
    alternates: {
      canonical: `https://hit-tool.com/medical-tax-calculator/column/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: article.description,
      url: `https://hit-tool.com/medical-tax-calculator/column/${slug}`,
      siteName: 'HITtools',
      images: [
        {
          url: 'https://hit-tool.com/medical-tax-calculator/ogp.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'ja_JP',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: article.description,
      images: ['https://hit-tool.com/medical-tax-calculator/ogp.png'],
    },
  };
}

/**
 * インラインMarkdownパーサー
 * **太字**, [リンク](URL), `コード` を React ノードに変換
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // トークン分割: **太字**, [label](url), `code`
  const tokenRegex = /(\*\*[\s\S]+?\*\*|\[[\s\S]+?\]\(.+?\)|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-900">
          {renderInlineMarkdown(inner)}
        </strong>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([\s\S]+?)\]\((.+?)\)$/);
      if (match) {
        const [, label, href] = match;
        // 内部リンク
        if (href.startsWith('/') || href.startsWith('#')) {
          return (
            <Link
              key={index}
              href={href}
              className="text-brand-600 hover:text-brand-700 underline font-semibold transition-colors"
            >
              {label}
            </Link>
          );
        }
        return (
          <a
            key={index}
            href={href}
            className="text-brand-600 hover:text-brand-700 underline font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        );
      }
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Markdownブロックパーサー（サーバーサイドHTML生成用）
 */
function renderMarkdownContent(content: string) {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let keyIndex = 0;

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentTable: string[][] = [];

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul
            key={`ul-${keyIndex++}`}
            className="my-4 space-y-2 list-disc list-outside ml-6 text-sm sm:text-base text-slate-700 leading-relaxed tracking-normal"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`ol-${keyIndex++}`}
            className="my-4 space-y-2 list-decimal list-outside ml-6 text-sm sm:text-base text-slate-700 leading-relaxed tracking-normal"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      const header = currentTable[0];
      const body = currentTable.slice(2); // ヘッダー行 + 区切り行(---)の次から

      elements.push(
        <div key={`table-${keyIndex++}`} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                {header.map((th, i) => (
                  <th
                    key={i}
                    className="py-3 px-4 font-bold text-slate-900 border-r border-slate-200 last:border-r-0 whitespace-nowrap"
                  >
                    {renderInlineMarkdown(th.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="py-3 px-4 border-r border-slate-200 last:border-r-0 text-slate-700"
                    >
                      {renderInlineMarkdown(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
    }
  };

  const flushAll = () => {
    flushList();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 空行
    if (!trimmed) {
      flushAll();
      continue;
    }

    // テーブル行 (| col | col |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed.split('|').slice(1, -1);
      currentTable.push(cells);
      continue;
    } else {
      flushTable();
    }

    // 順不同リスト (- 項目 または * 項目)
    if (/^[-*]\s+/.test(trimmed)) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmed.replace(/^[-*]\s+/, ''));
      continue;
    }

    // 順序付きリスト (1. 項目)
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // リストが終了
    flushList();

    // H2 見出し
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={keyIndex++}
          className="text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 tracking-normal leading-normal"
        >
          <span className="w-1.5 h-6 bg-brand-500 rounded-full inline-block shrink-0" />
          <span>{renderInlineMarkdown(trimmed.replace('## ', ''))}</span>
        </h2>
      );
      continue;
    }

    // H3 見出し
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={keyIndex++}
          className="text-base sm:text-lg font-bold text-slate-800 mt-6 mb-3 tracking-normal leading-normal"
        >
          {renderInlineMarkdown(trimmed.replace('### ', ''))}
        </h3>
      );
      continue;
    }

    // 水平線
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={keyIndex++} className="my-8 border-slate-200" />);
      continue;
    }

    // 【計算式】や【減少目安】などのハイライトブロック
    if (
      trimmed.startsWith('【計算式】') ||
      trimmed.startsWith('【減少目安】') ||
      trimmed.startsWith('【節税効果の比較】') ||
      trimmed.startsWith('【正しい計算結果】')
    ) {
      elements.push(
        <div
          key={keyIndex++}
          className="my-3 p-3.5 bg-emerald-50/80 border-l-4 border-brand-500 rounded-r-xl text-slate-800"
        >
          <span className="text-xs font-bold text-brand-800 block tracking-normal">
            {trimmed}
          </span>
        </div>
      );
      continue;
    }

    // 通常の段落
    elements.push(
      <p
        key={keyIndex++}
        className="text-sm sm:text-base text-slate-700 leading-relaxed tracking-normal my-4"
      >
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushAll();

  return elements;
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

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
            name: 'コラム一覧',
            item: 'https://hit-tool.com/medical-tax-calculator/column',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: `https://hit-tool.com/medical-tax-calculator/column/${slug}`,
          },
        ],
      },
      {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        url: `https://hit-tool.com/medical-tax-calculator/column/${slug}`,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
          '@type': 'Organization',
          name: 'HITtools 編集部',
          url: 'https://hit-tool.com/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'HITtools',
          url: 'https://hit-tool.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://hit-tool.com/medical-tax-calculator/images/logo.png',
          },
        },
      },
      ...(article.faq && article.faq.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: article.faq.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
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
            <li className="hover:text-slate-800">
              <Link href="/column">コラム一覧</Link>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </li>
            <li className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* 記事ヘッダー */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-md border border-brand-200">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              公開日: {article.publishedAt} / 最終更新: {article.updatedAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-normal leading-normal">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed tracking-normal">
            {article.description}
          </p>
        </header>

        {/* 記事内ツール誘導CTA (上部) */}
        <ToolCtaBanner compact={true} />

        {/* 記事本文 (完全サーバーサイドレンダリング) */}
        <article className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          <div className="prose prose-slate max-w-none">
            {renderMarkdownContent(article.content)}
          </div>
        </article>

        {/* 記事個別FAQアコーディオン */}
        {article.faq && article.faq.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-400" />
              <h2 className="text-base sm:text-lg font-bold">この記事に関するよくある質問</h2>
            </div>
            <div className="p-5 sm:p-6 divide-y divide-slate-100">
              {article.faq.map((f, i) => (
                <details key={i} className="group py-3 first:pt-0 last:pb-0 cursor-pointer">
                  <summary className="font-bold text-sm sm:text-base text-slate-900 flex justify-between items-center hover:text-brand-600">
                    <span>Q. {f.question}</span>
                    <span className="text-xs text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* 記事下部 ツール誘導大型バナー */}
        <ToolCtaBanner
          title="医療費控除の還付額をシミュレーションしてみませんか？"
          description="年収と医療費・薬代を入力するだけで、所得税還付と住民税減額を30秒で自動算出。家族合算・セルフメディケーション比較も完全対応。"
        />

        {/* 関連記事カード */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            あわせて読みたい関連コラム
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/column/${rel.slug}`}
                className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-500 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 mb-2 inline-block">
                    {rel.category}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 line-clamp-2">
                    {rel.title}
                  </p>
                </div>
                <span className="text-[11px] text-brand-600 font-semibold mt-3 flex items-center gap-1">
                  <span>記事を読む</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* おすすめWebツールカード */}
        <RelatedToolsCard />
      </div>
    </>
  );
}
