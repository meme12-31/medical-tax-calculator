'use client';

import React from 'react';
import { MedicalItem, Person } from '@/types';
import {
  Building2,
  Pill,
  Bus,
  HeartHandshake,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface MedicalItemListProps {
  items: MedicalItem[];
  persons: Person[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onExportCsv: () => void;
  onLoadDemo: () => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  hospital: {
    label: '診療・治療',
    icon: Building2,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  pharmacy: {
    label: '医薬品購入',
    icon: Pill,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  transport: {
    label: '通院交通費',
    icon: Bus,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  care: {
    label: '介護・その他',
    icon: HeartHandshake,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

export const MedicalItemList: React.FC<MedicalItemListProps> = ({
  items,
  persons,
  onDeleteItem,
  onClearAll,
  onExportCsv,
  onLoadDemo,
}) => {
  const personMap = new Map(persons.map((p) => [p.id, p.name]));

  // カテゴリ別集計
  const totalAmount = items.reduce((s, i) => s + (i.amount || 0), 0);
  const totalReimb = items.reduce((s, i) => s + (i.reimbursement || 0), 0);
  const totalNet = items.reduce(
    (s, i) => s + Math.max(0, (i.amount || 0) - (i.reimbursement || 0)),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* リストヘッダー */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">
            登録明細一覧
          </h3>
          <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
            {items.length}件
          </span>
        </div>

        {items.length > 0 && (
          <div className="no-print flex items-center gap-2">
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
              title="明細をCSV形式でダウンロード"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV保存</span>
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>全消去</span>
            </button>
          </div>
        )}
      </div>

      {/* サマリーバー */}
      {items.length > 0 && (
        <div className="bg-brand-50/50 px-5 py-3 border-b border-brand-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap text-slate-600">
            <span>
              支払合計: <strong className="text-slate-900 font-bold">{totalAmount.toLocaleString()}円</strong>
            </span>
            <span>-</span>
            <span>
              保険金補填: <strong className="text-slate-700 font-bold">{totalReimb.toLocaleString()}円</strong>
            </span>
          </div>

          <div className="text-brand-900 font-bold text-sm">
            実質自己負担額: <span className="text-brand-700 text-base">{totalNet.toLocaleString()}</span> 円
          </div>
        </div>
      )}

      {/* 空状態 */}
      {items.length === 0 ? (
        <div className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">
              医療費明細が登録されていません
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              上の入力フォームから、支払った医療費や薬代を入力して追加してください。
            </p>
          </div>
          <button
            type="button"
            onClick={onLoadDemo}
            className="no-print inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-300 rounded-lg transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>テスト用デモデータを読み込む</span>
          </button>
        </div>
      ) : (
        /* テーブル表示 (デスクトップ) & カード表示 (モバイル) */
        <div className="overflow-x-auto">
          {/* PC向けテーブル */}
          <table className="w-full text-left border-collapse hidden md:table text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-4">年月/日付</th>
                <th className="py-2.5 px-3">対象家族</th>
                <th className="py-2.5 px-3">区分</th>
                <th className="py-2.5 px-3">支払先・内容</th>
                <th className="py-2.5 px-3 text-right">支払金額</th>
                <th className="py-2.5 px-3 text-right">補填額</th>
                <th className="py-2.5 px-3 text-right">実質負担</th>
                <th className="py-2.5 px-3 text-center">OTC対象</th>
                <th className="no-print py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.hospital;
                const Icon = config.icon;
                const net = Math.max(0, (item.amount || 0) - (item.reimbursement || 0));

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                      {item.date || '-'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {personMap.get(item.personId) || '不明'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {item.providerName || '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800 whitespace-nowrap">
                      {item.amount.toLocaleString()}円
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 whitespace-nowrap">
                      {item.reimbursement > 0 ? `${item.reimbursement.toLocaleString()}円` : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-brand-600 whitespace-nowrap">
                      {net.toLocaleString()}円
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {item.isSelfMedication ? (
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          対象
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="no-print py-3 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="明細を削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* モバイル向けカード一覧 */}
          <div className="md:hidden divide-y divide-slate-100">
            {items.map((item) => {
              const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.hospital;
              const Icon = config.icon;
              const net = Math.max(0, (item.amount || 0) - (item.reimbursement || 0));

              return (
                <div key={item.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {personMap.get(item.personId) || '不明'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isSelfMedication && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          OTC
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="no-print p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 font-medium">
                    {item.providerName || '-'}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-400">{item.date || '-'}</span>
                    <div className="flex items-center gap-3">
                      {item.reimbursement > 0 && (
                        <span className="text-slate-400">
                          (補填 -{item.reimbursement.toLocaleString()}円)
                        </span>
                      )}
                      <span className="font-bold text-slate-900">
                        実質 <strong className="text-brand-600 font-bold">{net.toLocaleString()}円</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
