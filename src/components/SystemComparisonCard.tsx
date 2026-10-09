'use client';

import React from 'react';
import { CalculationResult } from '@/types';
import { Scale, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface SystemComparisonCardProps {
  calculation: CalculationResult;
}

export const SystemComparisonCard: React.FC<SystemComparisonCardProps> = ({
  calculation,
}) => {
  const { regularSystem, selfMedicationSystem, betterSystem, systemSavingDiff } = calculation;

  const isRegularBetter = betterSystem === 'regular';
  const isSelfMedBetter = betterSystem === 'selfMedication';
  const isEqual = betterSystem === 'equal';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* カードヘッダー */}
      <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              通常医療費控除 vs セルフメディケーション税制
            </h3>
            <p className="text-xs text-slate-400">
              どちらの制度を選択して確定申告するのがお得かを自動判定
            </p>
          </div>
        </div>

        {/* 判定バッジ */}
        <div>
          {isRegularBetter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              通常控除が {systemSavingDiff.toLocaleString()}円 お得
            </span>
          )}
          {isSelfMedBetter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              セルフメディケーションが {systemSavingDiff.toLocaleString()}円 お得
            </span>
          )}
          {isEqual && (
            <span className="inline-flex items-center px-3 py-1 bg-slate-700 text-slate-200 text-xs font-bold rounded-full">
              節税額は同額（どちらでも可）
            </span>
          )}
        </div>
      </div>

      {/* 2カラム比較表 */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 通常の医療費控除 */}
        <div
          className={`rounded-xl p-4 border transition-all ${
            isRegularBetter
              ? 'bg-brand-50/50 border-brand-300 ring-2 ring-brand-500/20'
              : 'bg-slate-50 border-slate-200 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900">
              ① 通常の医療費控除
            </span>
            {isRegularBetter && (
              <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded">
                おすすめ
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>対象実質負担額:</span>
              <span className="font-semibold text-slate-900">
                {regularSystem.eligibleAmount.toLocaleString()} 円
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>足切り基準額:</span>
              <span className="font-semibold text-slate-900">
                - {regularSystem.threshold.toLocaleString()} 円
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>医療費控除額:</span>
              <span className="font-bold text-slate-900">
                {regularSystem.deductionAmount.toLocaleString()} 円
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex justify-between items-baseline font-bold">
              <span className="text-slate-800">合計節税額:</span>
              <span className="text-base text-brand-700 font-extrabold">
                {regularSystem.totalSaving.toLocaleString()} 円
              </span>
            </div>
          </div>
        </div>

        {/* セルフメディケーション税制 */}
        <div
          className={`rounded-xl p-4 border transition-all ${
            isSelfMedBetter
              ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-slate-50 border-slate-200 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900">
              ② セルフメディケーション税制
            </span>
            {isSelfMedBetter && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                おすすめ
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>対象OTC医薬品購入額:</span>
              <span className="font-semibold text-slate-900">
                {selfMedicationSystem.eligibleAmount.toLocaleString()} 円
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>足切り基準額:</span>
              <span className="font-semibold text-slate-900">
                - {selfMedicationSystem.threshold.toLocaleString()} 円
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>制度控除額:</span>
              <span className="font-bold text-slate-900">
                {selfMedicationSystem.deductionAmount.toLocaleString()} 円
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex justify-between items-baseline font-bold">
              <span className="text-slate-800">合計節税額:</span>
              <span className="text-base text-emerald-700 font-extrabold">
                {selfMedicationSystem.totalSaving.toLocaleString()} 円
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 text-[11px] text-slate-500">
        ※通常の医療費控除とセルフメディケーション税制は併用できません。どちらか一方を選択して申告します。
      </div>
    </div>
  );
};
