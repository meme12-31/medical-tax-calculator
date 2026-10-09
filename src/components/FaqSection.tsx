import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/faq';

export { FAQ_ITEMS };

export const FaqSection: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* セクションヘッダー */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center gap-2.5">
        <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            よくある質問（FAQ）
          </h2>
          <p className="text-xs text-slate-400">
            医療費控除の申請や計算でよくある疑問と回答
          </p>
        </div>
      </div>

      {/* アコーディオンリスト (HTML details/summaryによる完全SSR対応) */}
      <div className="p-5 sm:p-6 divide-y divide-slate-100">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="group py-4 first:pt-0 last:pb-0 cursor-pointer"
          >
            <summary className="flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 select-none hover:text-brand-600 transition-colors">
              <span className="flex items-start gap-2.5">
                <span className="text-brand-600 font-extrabold shrink-0">Q.</span>
                <span>{item.question}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0 chevron-icon" />
            </summary>

            <div className="mt-3 pl-6 pr-2 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-bold shrink-0">A.</span>
                <p>{item.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
