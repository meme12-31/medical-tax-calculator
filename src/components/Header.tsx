'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, RotateCcw, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onLoadDemo?: () => void;
  onReset?: () => void;
  showActions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadDemo,
  onReset,
  showActions = true,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側: アプリタイトル & アイコン */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group transition-colors"
          >
            <div className="p-1.5 bg-brand-500 text-white rounded-lg group-hover:bg-brand-600 transition-colors shadow-sm">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-slate-800 text-base sm:text-lg tracking-normal group-hover:text-brand-600">
              医療費控除の還付額計算
            </span>
          </Link>

          {/* 右側: リンク＆操作ボタン */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              2026年（令和8年）確定申告対応
            </span>

            <Link
              href="/column"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>解説コラム</span>
            </Link>

            {showActions && (
              <div className="flex items-center gap-1.5">
                {onLoadDemo && (
                  <button
                    type="button"
                    onClick={onLoadDemo}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors shadow-xs"
                    title="サンプルの医療費・年収データをセットします"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">デモデータ</span>
                  </button>
                )}

                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"
                    title="入力したデータをすべてクリアします"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">リセット</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
