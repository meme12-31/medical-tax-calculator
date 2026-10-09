'use client';

import React from 'react';
import { CalculationResult, Person } from '@/types';
import {
  Sparkles,
  TrendingDown,
  Printer,
  FileSpreadsheet,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ResultDashboardProps {
  calculation: CalculationResult;
  persons: Person[];
  onExportCsv: () => void;
  onPrint: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  calculation,
  persons,
  onExportCsv,
  onPrint,
}) => {
  const selectedPerson = persons.find((p) => p.id === calculation.selectedPersonId) || persons[0];
  const isSelfMedBetter = calculation.betterSystem === 'selfMedication';
  const currentSystem = isSelfMedBetter ? calculation.selfMedicationSystem : calculation.regularSystem;

  const totalSaving = currentSystem.totalSaving;
  const incomeTaxRefund = currentSystem.incomeTaxRefund;
  const residentTaxSaving = currentSystem.residentTaxSaving;
  const deductionAmount = currentSystem.deductionAmount;

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-500 shadow-lg overflow-hidden sticky top-20">
      {/* ダッシュボードヘッダー */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-600 text-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
            {selectedPerson?.name || '申告者'} のシミュレーション結果
          </span>
          <span className="text-xs text-brand-100 font-medium">
            2026年分確定申告
          </span>
        </div>

        <div className="mt-3">
          <p className="text-xs sm:text-sm text-brand-100 font-medium">
            医療費控除による 世帯の合計節税額（目安）
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-normal text-white">
              {totalSaving.toLocaleString()}
            </span>
            <span className="text-lg sm:text-xl font-bold text-brand-100">円 お得</span>
          </div>
        </div>
      </div>

      {/* 内訳グリッド */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {/* 所得税還付額 */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              ① 所得税 還付見込み額
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {incomeTaxRefund.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              申告後、指定口座に直接振込
            </p>
          </div>

          {/* 住民税減額 */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">
              ② 翌年 住民税の軽減額
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {residentTaxSaving.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              翌年6月からの住民税が減額
            </p>
          </div>
        </div>

        {/* 控除計算サマリー */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>適用税制:</span>
            <span className="font-bold text-slate-900">
              {isSelfMedBetter ? 'セルフメディケーション税制' : '通常の医療費控除'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>実質医療費支払額:</span>
            <span className="font-semibold text-slate-900">
              {calculation.netExpense.toLocaleString()} 円
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>足切り額:</span>
            <span className="font-semibold text-slate-900">
              - {currentSystem.threshold.toLocaleString()} 円
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
            <span>確定申告 医療費控除額:</span>
            <span className="text-brand-600 text-sm">
              {deductionAmount.toLocaleString()} 円
            </span>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="no-print space-y-2 pt-2">
          <button
            type="button"
            onClick={onPrint}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-brand-400" />
            <span>A4用紙で結果を印刷する</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>医療費明細をCSV保存（Excel用）</span>
          </button>
        </div>
      </div>
    </div>
  );
};
