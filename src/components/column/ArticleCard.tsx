import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Calendar, ChevronRight, Tag } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
            <Tag className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {article.publishedAt}
          </span>
        </div>

        <Link href={`/column/${article.slug}`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-normal tracking-normal">
            {article.title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed tracking-normal">
          {article.description}
        </p>
      </div>

      <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">確定申告お役立ち解説</span>
        <Link
          href={`/column/${article.slug}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>記事を読む</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
};
