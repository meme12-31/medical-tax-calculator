'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Person, MedicalItem } from '@/types';
import { calculateAll } from '@/lib/taxCalculator';
import {
  loadAppData,
  saveAppData,
  resetAppData,
  getDemoAppData,
  DEFAULT_PERSONS,
} from '@/lib/storage';
import { exportMedicalItemsToCsv } from '@/lib/csvExporter';
import { PersonInputCard } from '@/components/PersonInputCard';
import { MedicalItemForm } from '@/components/MedicalItemForm';
import { MedicalItemList } from '@/components/MedicalItemList';
import { ResultDashboard } from '@/components/ResultDashboard';
import { SystemComparisonCard } from '@/components/SystemComparisonCard';
import { PersonComparisonCard } from '@/components/PersonComparisonCard';
import { FurusatoImpactCard } from '@/components/FurusatoImpactCard';
import { PrintLayout } from '@/components/PrintLayout';
import { Sparkles, RotateCcw, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';

interface MedicalCalculatorAppProps {
  onRegisterHeaderActions?: (actions: { onLoadDemo: () => void; onReset: () => void }) => void;
}

export const MedicalCalculatorApp: React.FC<MedicalCalculatorAppProps> = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [persons, setPersons] = useState<Person[]>(DEFAULT_PERSONS);
  const [medicalItems, setMedicalItems] = useState<MedicalItem[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('person-1');
  const [activeInputTab, setActiveInputTab] = useState<'simple' | 'detailed'>('simple');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 初回マウント時に LocalStorage から復元
  useEffect(() => {
    const data = loadAppData();
    setPersons(data.persons);
    setMedicalItems(data.medicalItems);
    setSelectedPersonId(data.selectedPersonId);
    setActiveInputTab(data.activeInputTab);
    setIsLoaded(true);
  }, []);

  // データ変更時に自動保存 (300ms debounce)
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      saveAppData({
        persons,
        medicalItems,
        selectedPersonId,
        activeInputTab,
        version: 1,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [persons, medicalItems, selectedPersonId, activeInputTab, isLoaded]);

  // トースト表示タイマー
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // デモデータ読み込み
  const handleLoadDemo = () => {
    const demo = getDemoAppData();
    setPersons(demo.persons);
    setMedicalItems(demo.medicalItems);
    setSelectedPersonId(demo.selectedPersonId);
    setActiveInputTab('detailed');
    showToast('デモデータを読み込みました');
  };

  // データリセット
  const handleReset = () => {
    if (window.confirm('入力したデータをすべて消去して初期状態に戻しますか？')) {
      const reset = resetAppData();
      setPersons(reset.persons);
      setMedicalItems([]);
      setSelectedPersonId(reset.selectedPersonId);
      setActiveInputTab('simple');
      showToast('データを初期化しました');
    }
  };

  // 明細追加
  const handleAddItem = (item: Omit<MedicalItem, 'id'>) => {
    const newItem: MedicalItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setMedicalItems((prev) => [newItem, ...prev]);
    showToast('明細を追加しました');
  };

  // 明細削除
  const handleDeleteItem = (id: string) => {
    setMedicalItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 明細全消去
  const handleClearAllItems = () => {
    if (window.confirm('登録されているすべての医療費明細を削除しますか？')) {
      setMedicalItems([]);
      showToast('明細をクリアしました');
    }
  };

  // 簡易入力での一括反映
  const handleUpdateSimpleItems = (items: MedicalItem[]) => {
    setMedicalItems(items);
  };

  // CSVダウンロード
  const handleExportCsv = () => {
    exportMedicalItemsToCsv(medicalItems, persons);
  };

  // 印刷実行
  const handlePrint = () => {
    window.print();
  };

  // 計算のリアルタイム実行
  const calculation = useMemo(() => {
    return calculateAll(persons, medicalItems, selectedPersonId);
  }, [persons, medicalItems, selectedPersonId]);

  const selectedPerson = persons.find((p) => p.id === selectedPersonId) || persons[0];

  return (
    <>
      {/* トースト通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 印刷専用レイアウト */}
      <PrintLayout calculation={calculation} persons={persons} items={medicalItems} />

      {/* 画面表示用メインエリア */}
      <div className="no-print space-y-8">
        {/* クイックアクションバー (上部) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>リアルタイム自動計算中（変更は即座に反映・自動保存されます）</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>デモデータをセット</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>リセット</span>
            </button>
          </div>
        </div>

        {/* 2カラムレイアウト: 左側(入力・明細・比較) / 右側(結果ダッシュボード) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左カラム (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* ステップ1: 申告者・家族の収入設定 */}
            <PersonInputCard
              persons={persons}
              selectedPersonId={selectedPersonId}
              personSummaries={calculation.personSummaries}
              onUpdatePersons={setPersons}
              onSelectPerson={setSelectedPersonId}
            />

            {/* ステップ2: 医療費・薬代の入力 */}
            <MedicalItemForm
              persons={persons}
              medicalItems={medicalItems}
              activeTab={activeInputTab}
              onTabChange={setActiveInputTab}
              onAddItem={handleAddItem}
              onUpdateSimpleItems={handleUpdateSimpleItems}
            />

            {/* 明細リスト（詳細モード時、またはデータがあるとき） */}
            <MedicalItemList
              items={medicalItems}
              persons={persons}
              onDeleteItem={handleDeleteItem}
              onClearAll={handleClearAllItems}
              onExportCsv={handleExportCsv}
              onLoadDemo={handleLoadDemo}
            />

            {/* 比較カード 1: 通常控除 vs セルフメディケーション */}
            <SystemComparisonCard calculation={calculation} />

            {/* 比較カード 2: 申告者（夫 vs 妻）比較 */}
            <PersonComparisonCard
              calculation={calculation}
              persons={persons}
              onSelectPerson={setSelectedPersonId}
            />

            {/* ふるさと納税影響カード */}
            <FurusatoImpactCard
              calculation={calculation}
              selectedPerson={selectedPerson}
            />
          </div>

          {/* 右カラム (4〜5 cols: Sticky 結果パネル) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ResultDashboard
              calculation={calculation}
              persons={persons}
              onExportCsv={handleExportCsv}
              onPrint={handlePrint}
            />
          </div>
        </div>
      </div>
    </>
  );
};
