import React from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Sparkles } from 'lucide-react';

interface ToolCtaBannerProps {
  title?: string;
  description?: string;
  compact?: boolean;
}

export const ToolCtaBanner: React.FC<ToolCtaBannerProps> = ({
  title = '医療費控除の還付額をシミュレーションしてみませんか？',
  description = '年収と医療費・薬代を入力するだけで、所得税の還付額と住民税の減額分を30秒で自動試算。家族合算・セルフメディケーション比較も完全対応。',
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="my-6 p-4 bg-gradient-to-r from-brand-600 to-emerald-600 text-white rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 bg-white/20 rounded-lg shrink-0">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">{title}</p>
            <p className="text-xs text-brand-100">{description}</p>
          </div>
        </div>

        <Link
          href="/"
          className="shrink-0 px-4 py-2 bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
        >
          <span>無料で試算する</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="my-10 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white rounded-2xl shadow-md border border-brand-500/30 text-center space-y-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
        <span>無料・登録不要・ブラウザ内で即時計算</span>
      </div>

      <h3 className="text-lg sm:text-2xl font-black text-white max-w-xl mx-auto leading-normal tracking-normal">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed tracking-normal">
        {description}
      </p>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Calculator className="w-5 h-5" />
          <span>医療費控除の還付額を今すぐ計算する</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
