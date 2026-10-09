'use client';

import React from 'react';
import { CalculationResult, Person } from '@/types';
import { Gift, AlertCircle, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface FurusatoImpactCardProps {
  calculation: CalculationResult;
  selectedPerson: Person;
}

export const FurusatoImpactCard: React.FC<FurusatoImpactCardProps> = ({
  calculation,
  selectedPerson,
}) => {
  const reduction = calculation.furusatoLimitReduction;
  const furusatoDonated = selectedPerson?.furusatoTax || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* カードヘッダー */}
      <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              ふるさと納税上限額への影響シミュレーション
            </h3>
            <p className="text-xs text-slate-400">
              医療費控除とふるさと納税を併用した場合の限度額変動目安
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* アラート通知 */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-950">
                医療費控除の適用により、ふるさと納税の上限枠が 約{reduction.toLocaleString()}円 減少します
              </p>
              <p className="text-xs text-amber-800/90 mt-1">
                医療費控除で住民税が安くなるため、自己負担2,000円で寄附できる上限額がわずかに下がります。
              </p>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-amber-200 text-center shrink-0 w-full sm:w-auto">
            <span className="text-[10px] text-slate-500 block font-semibold">上限減少の目安</span>
            <span className="text-lg font-black text-amber-600">
              - {reduction.toLocaleString()} <span className="text-xs font-normal text-slate-600">円</span>
            </span>
          </div>
        </div>

        {/* 注意事項とコラム導線 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-600" />
              ワンストップ特例は自動無効になります
            </span>
            <p className="leading-relaxed">
              医療費控除を受けるために確定申告書を提出すると、申請済みのワンストップ特例はすべて無効になります。確定申告書の中にふるさと納税の寄附金控除も必ず含めて申告してください。
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-600" />
              併用してもトータル節税額は必ずプラス！
            </span>
            <p className="leading-relaxed">
              ふるさと納税の上限が少し下がったとしても、医療費控除による所得税還付と住民税減額の合計効果（数万円）の方が圧倒的に大きいため、併用した方が確実に手取りが増えます。
            </p>
          </div>
        </div>

        <div className="no-print pt-2">
          <Link
            href="/column/furusato-tax-deduction-impact"
            className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-bold hover:underline"
          >
            <span>医療費控除とふるさと納税の併用ルールについて詳しく読む</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
