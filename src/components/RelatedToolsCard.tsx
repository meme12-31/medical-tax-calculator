import React from 'react';
import {
  ExternalLink,
  Wrench,
  Banknote,
  FileText,
  Clock,
  Shirt,
  Calculator,
  LucideIcon,
} from 'lucide-react';
import toolsData from '@/content/relatedTools.json';

// アイコンマッピング
const iconMap: Record<string, LucideIcon> = {
  Banknote,
  FileText,
  Clock,
  Shirt,
  Calculator,
};

export const RelatedToolsCard: React.FC = () => {
  return (
    <section className="no-print bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              おすすめの無料Web関連ツール
            </h2>
            <p className="text-xs text-slate-400">
              HITtoolsポータルで人気の日常・計算・生活サポートツール
            </p>
          </div>
        </div>

        <a
          href="https://hit-tool.com/"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 hover:underline"
        >
          <span>ツール一覧</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* ツールカードグリッド */}
      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolsData.map((tool, index) => {
          const IconComponent = (tool.icon && iconMap[tool.icon]) ? iconMap[tool.icon] : Calculator;
          const categoryName = tool.category || 'Webツール';

          return (
            <a
              key={index}
              href={tool.url}
              className="group p-4 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200/80 hover:border-brand-500 transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
            >
              <div>
                {/* タイトル上部のカテゴリ用アイコン付きバッジ */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
                    <IconComponent className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{categoryName}</span>
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-500 shrink-0 transition-colors" />
                </div>

                {/* ツールタイトル */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                  {tool.name}
                </h3>

                {/* ツール説明文 */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* カード下部のリンクアクション */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-brand-600">
                <span>ツールを開く</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
