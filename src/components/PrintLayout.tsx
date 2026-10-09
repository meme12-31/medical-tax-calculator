import React from 'react';
import { CalculationResult, Person, MedicalItem } from '@/types';

interface PrintLayoutProps {
  calculation: CalculationResult;
  persons: Person[];
  items: MedicalItem[];
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  calculation,
  persons,
  items,
}) => {
  const selectedPerson = persons.find((p) => p.id === calculation.selectedPersonId) || persons[0];
  const isSelfMed = calculation.betterSystem === 'selfMedication';
  const sys = isSelfMed ? calculation.selfMedicationSystem : calculation.regularSystem;
  const personMap = new Map(persons.map((p) => [p.id, p.name]));

  return (
    <div className="print-only p-4 space-y-4">
      {/* 印刷ヘッダー */}
      <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            医療費控除 還付額シミュレーション結果明細書
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            HITtools 医療費控除計算シミュレーター（2026年 令和8年確定申告対応）
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          作成日: {new Date().toLocaleDateString('ja-JP')}
        </div>
      </div>

      {/* サマリーカード */}
      <div className="print-card grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded">
        <div>
          <span className="text-xs text-slate-500 block">申告対象者</span>
          <span className="text-sm font-bold text-slate-900">{selectedPerson.name}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">適用税制</span>
          <span className="text-sm font-bold text-slate-900">
            {isSelfMed ? 'セルフメディケーション税制' : '通常の医療費控除'}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">世帯の合計節税見込み額</span>
          <span className="text-base font-extrabold text-slate-900">
            {sys.totalSaving.toLocaleString()} 円
          </span>
        </div>
      </div>

      {/* 控除内訳テーブル */}
      <div>
        <h2 className="text-xs font-bold text-slate-800 mb-1">【控除・還付額内訳】</h2>
        <table className="print-table">
          <thead>
            <tr>
              <th>項目</th>
              <th>金額</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1年間の実質医療費負担額</td>
              <td className="text-right font-bold">{calculation.netExpense.toLocaleString()} 円</td>
              <td>総支払額から保険金補填を差し引いた額</td>
            </tr>
            <tr>
              <td>医療費控除の足切り額</td>
              <td className="text-right">- {sys.threshold.toLocaleString()} 円</td>
              <td>10万円 または 総所得の5%</td>
            </tr>
            <tr>
              <td>確定申告 医療費控除額</td>
              <td className="text-right font-bold">{sys.deductionAmount.toLocaleString()} 円</td>
              <td>課税所得から差し引かれる金額（上限200万円）</td>
            </tr>
            <tr>
              <td>所得税 還付見込み額</td>
              <td className="text-right font-bold text-slate-900">{sys.incomeTaxRefund.toLocaleString()} 円</td>
              <td>復興特別所得税（1.021）を含む即時振込見込み</td>
            </tr>
            <tr>
              <td>翌年 住民税 軽減額</td>
              <td className="text-right font-bold text-slate-900">{sys.residentTaxSaving.toLocaleString()} 円</td>
              <td>翌年度の住民税所得割額から減額（10%）</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 明細テーブル */}
      {items.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-slate-800 mb-1">【医療費支出明細一覧】</h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>No</th>
                <th>日付/年月</th>
                <th>対象家族</th>
                <th>支払先・内容</th>
                <th className="text-right">支払金額</th>
                <th className="text-right">補填額</th>
                <th className="text-right">実質負担</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{item.date || '-'}</td>
                  <td>{personMap.get(item.personId) || '家族'}</td>
                  <td>{item.providerName || '-'}</td>
                  <td className="text-right">{item.amount.toLocaleString()}円</td>
                  <td className="text-right">{item.reimbursement > 0 ? `${item.reimbursement.toLocaleString()}円` : '-'}</td>
                  <td className="text-right font-bold">
                    {Math.max(0, item.amount - item.reimbursement).toLocaleString()}円
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* フッター注意書き */}
      <div className="text-[9pt] text-slate-500 pt-2 border-t border-slate-300">
        ※本明細書はシミュレーションの控え用です。確定申告の際は国税庁指定の「医療費控除の明細書」に転記またはe-Taxに入力してください。領収書は5年間自宅で保管してください。
      </div>
    </div>
  );
};
