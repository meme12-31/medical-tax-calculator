'use client';

import React, { useState } from 'react';
import { Person, MedicalItem, MedicalCategory } from '@/types';
import { Receipt, ListPlus, Calculator, HelpCircle, AlertCircle, PlusCircle } from 'lucide-react';

interface MedicalItemFormProps {
  persons: Person[];
  medicalItems: MedicalItem[];
  activeTab: 'simple' | 'detailed';
  onTabChange: (tab: 'simple' | 'detailed') => void;
  onAddItem: (item: Omit<MedicalItem, 'id'>) => void;
  onUpdateSimpleItems: (items: MedicalItem[]) => void;
}

export const MedicalItemForm: React.FC<MedicalItemFormProps> = ({
  persons,
  medicalItems,
  activeTab,
  onTabChange,
  onAddItem,
  onUpdateSimpleItems,
}) => {
  // 詳細入力フォームの状態
  const [personId, setPersonId] = useState<string>(persons[0]?.id || '1');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [category, setCategory] = useState<MedicalCategory>('hospital');
  const [providerName, setProviderName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [reimbursement, setReimbursement] = useState<string>('');
  const [isSelfMedication, setIsSelfMedication] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');

  // 簡易入力用ローカルステート（人ごとの集計）
  const [simpleValues, setSimpleValues] = useState<Record<string, { hospital: number; reimbursement: number; otc: number }>>(() => {
    const init: Record<string, { hospital: number; reimbursement: number; otc: number }> = {};
    for (const p of persons) {
      // 既存明細から人ごとの合計を初期抽出
      const pItems = medicalItems.filter((m) => m.personId === p.id);
      const regularAmt = pItems.filter(m => !m.isSelfMedication).reduce((s, m) => s + m.amount, 0);
      const reimb = pItems.reduce((s, m) => s + m.reimbursement, 0);
      const otcAmt = pItems.filter(m => m.isSelfMedication).reduce((s, m) => s + m.amount, 0);
      init[p.id] = {
        hospital: regularAmt || 0,
        reimbursement: reimb || 0,
        otc: otcAmt || 0,
      };
    }
    return init;
  });

  // 詳細明細の追加
  const handleDetailedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount, 10);
    const parsedReimbursement = parseInt(reimbursement, 10) || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setWarningMessage('支払金額を正しく入力してください。');
      return;
    }

    if (parsedReimbursement > parsedAmount) {
      setWarningMessage('補填額が支払金額を超えています。実際の治療費を超える補填金は、この項目の支払額と同額まで差し引きます。');
    } else {
      setWarningMessage('');
    }

    onAddItem({
      personId: personId || persons[0]?.id || '1',
      date,
      category,
      providerName: providerName.trim() || (category === 'hospital' ? '病院・診療所' : category === 'pharmacy' ? '薬局' : '通院交通費'),
      amount: parsedAmount,
      reimbursement: parsedReimbursement,
      isSelfMedication,
    });

    // フォームの一部リセット
    setAmount('');
    setReimbursement('');
    setProviderName('');
    setIsSelfMedication(false);
  };

  // 簡易入力の変更反映
  const handleSimpleChange = (
    pid: string,
    field: 'hospital' | 'reimbursement' | 'otc',
    val: number
  ) => {
    const newSimple = {
      ...simpleValues,
      [pid]: {
        ...(simpleValues[pid] || { hospital: 0, reimbursement: 0, otc: 0 }),
        [field]: Math.max(0, val),
      },
    };
    setSimpleValues(newSimple);

    // MedicalItems 配列を再生成して親に通知
    const generatedItems: MedicalItem[] = [];
    let counter = 1;

    for (const p of persons) {
      const vals = newSimple[p.id] || { hospital: 0, reimbursement: 0, otc: 0 };
      if (vals.hospital > 0 || vals.reimbursement > 0) {
        generatedItems.push({
          id: `simple-hosp-${p.id}-${counter++}`,
          personId: p.id,
          date: '2026年分',
          category: 'hospital',
          providerName: `${p.name}の医療費・病院代`,
          amount: vals.hospital,
          reimbursement: vals.reimbursement,
          isSelfMedication: false,
        });
      }
      if (vals.otc > 0) {
        generatedItems.push({
          id: `simple-otc-${p.id}-${counter++}`,
          personId: p.id,
          date: '2026年分',
          category: 'pharmacy',
          providerName: `${p.name}のOTC市販薬（セルフメディケーション対象）`,
          amount: vals.otc,
          reimbursement: 0,
          isSelfMedication: true,
        });
      }
    }

    onUpdateSimpleItems(generatedItems);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* カードヘッダー */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-950 px-2 py-0.5 rounded border border-brand-800/60">
                ステップ 2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                医療費・薬代の入力
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              病院代・処方薬・通院交通費・対象の市販薬（スイッチOTC医薬品）を入力します
            </p>
          </div>
        </div>

        {/* 簡易 / 詳細 切り替えタブ */}
        <div className="no-print bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
          <button
            type="button"
            onClick={() => onTabChange('simple')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'simple'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>簡易まとめ入力</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('detailed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'detailed'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>詳細明細入力（領収書ごと）</span>
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="p-5 sm:p-6">
        {activeTab === 'simple' ? (
          /* ================= 簡易入力モード ================= */
          <div className="space-y-6">
            <div className="bg-brand-50/70 border border-brand-200/80 rounded-xl p-3.5 text-xs text-brand-900 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>簡易まとめ入力:</strong> 1年間の合計金額を家族ごとにおおまかに入力して手軽に還付額をシミュレーションできます。領収書ごとの詳細な管理やCSV出力を行いたい場合は「詳細明細入力」をご利用ください。
              </span>
            </div>

            <div className="space-y-4">
              {persons.map((person) => {
                const values = simpleValues[person.id] || { hospital: 0, reimbursement: 0, otc: 0 };
                return (
                  <div
                    key={person.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        {person.name} の医療費
                      </span>
                      <span className="text-xs text-slate-500">
                        実質自己負担: <strong className="text-slate-900 font-bold">{Math.max(0, values.hospital - values.reimbursement + values.otc).toLocaleString()}円</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      {/* 通常医療費 */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label className="text-xs font-bold text-slate-600 block">
                          年間医療費・病院代（通常分）
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={values.hospital || ''}
                            onChange={(e) =>
                              handleSimpleChange(
                                person.id,
                                'hospital',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-full text-sm font-semibold pr-7 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                            placeholder="0"
                          />
                          <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">円</span>
                        </div>
                      </div>

                      {/* 保険金補填額 */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label className="text-xs font-bold text-slate-600 block">
                          保険金等の補填額（入院給付等）
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={values.reimbursement || ''}
                            onChange={(e) =>
                              handleSimpleChange(
                                person.id,
                                'reimbursement',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-full text-sm font-semibold pr-7 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                            placeholder="0"
                          />
                          <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">円</span>
                        </div>
                      </div>

                      {/* スイッチOTC薬代 */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label className="text-xs font-bold text-slate-600 block">
                          対象市販薬（OTC医薬品）
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={values.otc || ''}
                            onChange={(e) =>
                              handleSimpleChange(
                                person.id,
                                'otc',
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-full text-sm font-semibold pr-7 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                            placeholder="0"
                          />
                          <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">円</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= 詳細明細入力モード ================= */
          <form onSubmit={handleDetailedSubmit} className="space-y-4">
            {warningMessage && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 対象家族 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">対象の家族</label>
                <select
                  value={personId}
                  onChange={(e) => setPersonId(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 outline-hidden"
                >
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 発生年月 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">受診・支払年月</label>
                <input
                  type="month"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                />
              </div>

              {/* 分類 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">医療費の分類</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MedicalCategory)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 outline-hidden"
                >
                  <option value="hospital">診療・治療（病院・歯科）</option>
                  <option value="pharmacy">医薬品購入（調剤・薬局）</option>
                  <option value="transport">通院交通費（電車・バス）</option>
                  <option value="care">介護保険・その他医療サービス</option>
                </select>
              </div>

              {/* 病院・薬局名 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  病院・薬局・支払先名
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="例: ○○総合病院、△△薬局"
                  className="w-full text-sm font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-end">
              {/* 支払金額 */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-xs font-bold text-slate-700 block">
                  支払金額 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="例: 12000"
                    className="w-full text-sm font-bold pr-7 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                    required
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">円</span>
                </div>
              </div>

              {/* 保険金補填額 */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>保険金等補填額</span>
                  <span className="text-[11px] font-normal text-slate-400">なければ0</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={reimbursement}
                    onChange={(e) => setReimbursement(e.target.value)}
                    placeholder="0"
                    className="w-full text-sm font-bold pr-7 pl-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">円</span>
                </div>
              </div>

              {/* セルフメディケーションフラグ & 追加ボタン */}
              <div className="flex flex-col justify-end space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none pb-1">
                  <input
                    type="checkbox"
                    checked={isSelfMedication}
                    onChange={(e) => setIsSelfMedication(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <span>スイッチOTC対象医薬品</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>明細を追加する</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
