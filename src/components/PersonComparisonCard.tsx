'use client';

import React from 'react';
import { CalculationResult, Person } from '@/types';
import { Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PersonComparisonCardProps {
  calculation: CalculationResult;
  persons: Person[];
  onSelectPerson: (personId: string) => void;
}

export const PersonComparisonCard: React.FC<PersonComparisonCardProps> = ({
  calculation,
  persons,
  onSelectPerson,
}) => {
  if (persons.length <= 1) {
    return null;
  }

  const { personComparisons, bestPersonId, bestPersonSavingDiff } = calculation;
  const bestPerson = persons.find((p) => p.id === bestPersonId) || persons[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* カードヘッダー */}
      <div className="px-5 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              世帯内比較｜誰が申告すると一番得か？
            </h3>
            <p className="text-xs text-slate-400">
              生計を一にする家族の医療費を誰の名義で一括申請すべきかを比較
            </p>
          </div>
        </div>

        {bestPersonSavingDiff > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full shadow-xs">
            {bestPerson.name} が申告すると最大 {bestPersonSavingDiff.toLocaleString()}円 お得！
          </span>
        )}
      </div>

      {/* 比較カードグリッド */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {personComparisons.map((pc) => {
            const isBest = pc.personId === bestPersonId;
            const isSelected = pc.personId === calculation.selectedPersonId;
            const personObj = persons.find((p) => p.id === pc.personId);

            return (
              <div
                key={pc.personId}
                className={`rounded-xl p-4 border transition-all relative ${
                  isBest
                    ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/30'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                {isBest && (
                  <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    世帯No.1節税
                  </span>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">
                    {pc.personName}
                  </span>
                  <span className="text-xs text-slate-500">
                    年収 {(personObj?.annualIncome || 0).toLocaleString()}円
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>この人の節税額目安:</span>
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {pc.bestSaving.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    （{pc.bestSystem === 'regular' ? '通常控除' : 'セルフメディケーション'}適用時）
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => onSelectPerson(pc.personId)}
                    className={`w-full py-1.5 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                        <span>選択中</span>
                      </>
                    ) : (
                      <span>この人を結果に適用</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* アドバイス解説 */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-1">
            💡 共働き世帯・家族合算のポイント
          </p>
          <p>
            日本の所得税は累進課税のため、税率（年収）が高い家族がまとめて医療費を申告すると、同じ医療費でも戻ってくる還付金の額が最も多くなります。妻の治療費や子どもの歯科矯正代であっても、夫の名義でまとめて申告して問題ありません。
          </p>
        </div>
      </div>
    </div>
  );
};
