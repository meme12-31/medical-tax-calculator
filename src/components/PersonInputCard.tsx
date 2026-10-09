'use client';

import React, { useState } from 'react';
import { Person, IncomeType, PersonTaxSummary } from '@/types';
import { User, Users, Plus, Trash2, HelpCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface PersonInputCardProps {
  persons: Person[];
  selectedPersonId: string;
  personSummaries: Record<string, PersonTaxSummary>;
  onUpdatePersons: (persons: Person[]) => void;
  onSelectPerson: (personId: string) => void;
}

export const PersonInputCard: React.FC<PersonInputCardProps> = ({
  persons,
  selectedPersonId,
  personSummaries,
  onUpdatePersons,
  onSelectPerson,
}) => {
  const [activePersonTab, setActivePersonTab] = useState<string>(persons[0]?.id || '1');

  // 人物の追加
  const handleAddPerson = () => {
    const newId = `person-${Date.now()}`;
    const newPerson: Person = {
      id: newId,
      name: persons.length === 1 ? '配偶者（妻）' : `家族${persons.length + 1}`,
      incomeType: 'salary',
      annualIncome: 0,
      socialInsurance: 0,
      dependentsCount: 0,
      furusatoTax: 0,
    };
    const updated = [...persons, newPerson];
    onUpdatePersons(updated);
    setActivePersonTab(newId);
  };

  // 人物の削除
  const handleDeletePerson = (id: string) => {
    if (persons.length <= 1) return;
    const updated = persons.filter((p) => p.id !== id);
    onUpdatePersons(updated);
    if (activePersonTab === id) {
      setActivePersonTab(updated[0].id);
    }
    if (selectedPersonId === id) {
      onSelectPerson(updated[0].id);
    }
  };

  // フィールドの更新
  const handleFieldChange = (
    id: string,
    field: keyof Person,
    value: string | number
  ) => {
    const updated = persons.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        [field]: value,
      };
    });
    onUpdatePersons(updated);
  };

  const currentPerson = persons.find((p) => p.id === activePersonTab) || persons[0];
  const currentSummary = personSummaries[currentPerson.id];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* カードヘッダー */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-950 px-2 py-0.5 rounded border border-brand-800/60">
                ステップ 1
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                申告者・家族の収入設定
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              世帯で誰が申告すると一番得になるかを判定するため、家族の収入を入力します
            </p>
          </div>
        </div>

        {persons.length < 5 && (
          <button
            type="button"
            onClick={handleAddPerson}
            className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>家族を追加</span>
          </button>
        )}
      </div>

      {/* 家族切り替えタブ */}
      <div className="no-print border-b border-slate-200 bg-slate-50/70 px-4 pt-2.5 flex items-center gap-2 overflow-x-auto">
        {persons.map((person) => {
          const isSelected = activePersonTab === person.id;
          const isPrimary = selectedPersonId === person.id;
          return (
            <button
              key={person.id}
              type="button"
              onClick={() => setActivePersonTab(person.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-t border-x -mb-px shrink-0 ${
                isSelected
                  ? 'bg-white text-slate-900 border-slate-200 shadow-xs'
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{person.name || '家族'}</span>
              {isPrimary && (
                <span className="text-[10px] font-bold bg-brand-100 text-brand-800 px-1.5 py-0.2 rounded">
                  メイン
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* フォーム入力エリア */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* 名前 & メイン申告者切り替え */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-600 shrink-0">表示名:</label>
            <input
              type="text"
              value={currentPerson.name}
              onChange={(e) => handleFieldChange(currentPerson.id, 'name', e.target.value)}
              className="text-sm font-medium px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden"
              placeholder="例: 本人（夫）"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => onSelectPerson(currentPerson.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedPersonId === currentPerson.id
                  ? 'bg-brand-50 text-brand-700 border border-brand-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${selectedPersonId === currentPerson.id ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{selectedPersonId === currentPerson.id ? 'メイン申告者に設定中' : 'この人をメイン申告者にする'}</span>
            </button>

            {persons.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeletePerson(currentPerson.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="この家族を削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 収入・控除フォーム */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 収入区分 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>収入区分</span>
            </label>
            <select
              value={currentPerson.incomeType}
              onChange={(e) =>
                handleFieldChange(currentPerson.id, 'incomeType', e.target.value as IncomeType)
              }
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden"
            >
              <option value="salary">給与所得（会社員・パート）</option>
              <option value="business">事業所得（自営業・フリーランス）</option>
              <option value="pension">公的年金等（年金受給者）</option>
            </select>
          </div>

          {/* 年間収入額 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>年間収入額（年収）</span>
              <span className="text-[11px] font-normal text-slate-500">額面</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10000"
                value={currentPerson.annualIncome || ''}
                onChange={(e) =>
                  handleFieldChange(
                    currentPerson.id,
                    'annualIncome',
                    Math.max(0, parseInt(e.target.value, 10) || 0)
                  )
                }
                className="w-full text-sm font-semibold pr-8 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden"
                placeholder="0"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">円</span>
            </div>
          </div>

          {/* 社会保険料（任意） */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>社会保険料等の支払額</span>
              <span className="text-[11px] font-normal text-slate-400">任意</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10000"
                value={currentPerson.socialInsurance || ''}
                onChange={(e) =>
                  handleFieldChange(
                    currentPerson.id,
                    'socialInsurance',
                    Math.max(0, parseInt(e.target.value, 10) || 0)
                  )
                }
                className="w-full text-sm font-semibold pr-8 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden"
                placeholder="0"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">円</span>
            </div>
          </div>

          {/* 扶養人数 & ふるさと納税 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                扶養親族
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={currentPerson.dependentsCount || ''}
                  onChange={(e) =>
                    handleFieldChange(
                      currentPerson.id,
                      'dependentsCount',
                      Math.max(0, parseInt(e.target.value, 10) || 0)
                    )
                  }
                  className="w-full text-sm font-semibold pr-7 pl-2.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden"
                  placeholder="0"
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">人</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                ふるさと納税
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={currentPerson.furusatoTax || ''}
                  onChange={(e) =>
                    handleFieldChange(
                      currentPerson.id,
                      'furusatoTax',
                      Math.max(0, parseInt(e.target.value, 10) || 0)
                    )
                  }
                  className="w-full text-sm font-semibold pr-7 pl-2 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden"
                  placeholder="0"
                />
                <span className="absolute right-2 top-2.5 text-xs text-slate-400">円</span>
              </div>
            </div>
          </div>
        </div>

        {/* 概算所得・所得税率サマリーインフォ */}
        {currentSummary && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="font-bold text-slate-700">
                {currentPerson.name} の試算基準:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-600">
              <div>
                総所得金額等: <span className="font-bold text-slate-900">{currentSummary.grossIncome.toLocaleString()}円</span>
              </div>
              <div>
                課税所得: <span className="font-bold text-slate-900">{currentSummary.taxableIncome.toLocaleString()}円</span>
              </div>
              <div>
                限界所得税率: <span className="font-bold text-brand-600">{Math.round(currentSummary.incomeTaxRate * 100)}%</span>
              </div>
              <div>
                医療費足切り額: <span className="font-bold text-slate-900">{currentSummary.thresholdDeduction.toLocaleString()}円</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
