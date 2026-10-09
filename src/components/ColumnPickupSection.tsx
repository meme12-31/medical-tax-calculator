import React from 'react';
import Link from 'next/link';
import { COLUMNS } from '@/lib/columns';
import { BookOpen, Clock, Calendar, ChevronRight, Tag, ArrowRight } from 'lucide-react';

/**
 * 本文の文字数から読了目安時間を算出（約500文字/分）
 */
function getReadingTime(content: string): string {
  const charCount = content.replace(/\s+/g, '').length;
  const minutes = Math.max(3, Math.ceil(charCount / 500));
  return `読了目安: 約${minutes}分`;
}

export const ColumnPickupSection: React.FC = () => {
  // 最新3記事を取得
  const latestArticles = COLUMNS.slice(0, 3);

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* セクションヘッダー */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              医療費控除のお役立ち解説コラム
            </h2>
            <p className="text-xs text-slate-400">
              確定申告の疑問や節税のポイントをわかりやすく解説
            </p>
          </div>
        </div>

        <Link
          href="/column"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 hover:underline"
        >
          <span>全10記事</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3記事の全幅縦一列リスト */}
      <div className="p-5 sm:p-6 space-y-6">
        <div className="divide-y divide-slate-100">
          {latestArticles.map((article) => (
            <article
              key={article.slug}
              className="py-5 first:pt-0 last:pb-0 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2.5 grow">
                  {/* メタ情報バッジ */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {getReadingTime(article.content)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {article.publishedAt}
                    </span>
                  </div>

                  {/* タイトル */}
                  <Link href={`/column/${article.slug}`} className="block">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-normal tracking-normal">
                      {article.title}
                    </h3>
                  </Link>

                  {/* 概要文 */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed tracking-normal line-clamp-2 sm:line-clamp-3">
                    {article.description}
                  </p>
                </div>

                {/* 記事を読むリンク */}
                <div className="shrink-0 flex sm:flex-col justify-end items-end sm:self-center pt-1 sm:pt-0">
                  <Link
                    href={`/column/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-all bg-brand-50 hover:bg-brand-100 sm:bg-transparent sm:hover:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg"
                  >
                    <span>記事を読む</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 一覧遷移ボタン（全幅グレー系背景ボタン） */}
        <div className="pt-2">
          <Link
            href="/column"
            className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-2xs hover:shadow-xs"
          >
            <span>お役立ちコラム一覧を見る →</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
