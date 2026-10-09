export type IncomeType = 'salary' | 'business' | 'pension';

export type MedicalCategory = 'hospital' | 'pharmacy' | 'transport' | 'care';

export interface Person {
  id: string;
  name: string;
  incomeType: IncomeType;
  annualIncome: number; // 年間収入額 (円)
  socialInsurance: number; // 社会保険料支払額 (円)
  dependentsCount: number; // 扶養親族人数
  furusatoTax: number; // ふるさと納税寄付金額 (円)
}

export interface MedicalItem {
  id: string;
  personId: string;
  date: string; // YYYY-MM-DD or YYYY-MM
  category: MedicalCategory;
  providerName: string; // 病院・薬局名など
  amount: number; // 支払った医療費 (円)
  reimbursement: number; // 保険金等で補填される金額 (円)
  isSelfMedication: boolean; // セルフメディケーション対象か
}

export interface PersonTaxSummary {
  person: Person;
  grossIncome: number; // 総所得金額等
  employmentDeduction: number; // 給与所得控除 / 公的年金等控除
  basicDeduction: number; // 基礎控除 (48万円)
  socialInsuranceDeduction: number; // 社会保険料控除
  taxableIncome: number; // 課税所得金額
  incomeTaxRate: number; // 限界所得税率 (0.05, 0.10, 0.20, etc.)
  residentTaxRate: number; // 住民税率 (0.10)
  thresholdDeduction: number; // 足切り額 (min(10万, 総所得×5%))
}

export interface SystemResult {
  eligibleAmount: number; // 制度の対象となる実質支払額
  threshold: number; // 足切り額
  deductionAmount: number; // 医療費控除額
  incomeTaxRefund: number; // 所得税還付見込み額 (復興特別所得税 1.021 含む)
  residentTaxSaving: number; // 住民税軽減額 (10%)
  totalSaving: number; // 合計節税額
}

export interface CalculationResult {
  personSummaries: Record<string, PersonTaxSummary>;
  selectedPersonId: string;
  // 医療費集計
  totalExpense: number; // 支払総額
  totalReimbursement: number; // 補填総額
  netExpense: number; // 実質負担額 (項目別 max(0, amount - reimbursement) の合計)
  selfMedicationExpense: number; // セルフメディケーション対象の実質負担額
  
  // 通常控除 vs セルフメディケーション比較 (選択中の申告者基準)
  regularSystem: SystemResult;
  selfMedicationSystem: SystemResult;
  betterSystem: 'regular' | 'selfMedication' | 'equal';
  systemSavingDiff: number; // 差額

  // 世帯内比較 (各Personが申告した場合の節税額)
  personComparisons: {
    personId: string;
    personName: string;
    regularTotalSaving: number;
    selfMedTotalSaving: number;
    bestSaving: number;
    bestSystem: 'regular' | 'selfMedication';
  }[];
  bestPersonId: string;
  bestPersonSavingDiff: number;

  // ふるさと納税影響
  furusatoLimitReduction: number; // ふるさと納税上限額の減少目安
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string; // Markdown / HTML
  publishedAt: string;
  updatedAt: string;
  faq?: { question: string; answer: string }[];
}

export interface RelatedTool {
  name: string;
  url: string;
  description: string;
  category?: string;
  icon?: string;
}

export interface AppStorageData {
  persons: Person[];
  medicalItems: MedicalItem[];
  selectedPersonId: string;
  activeInputTab: 'simple' | 'detailed';
  version: number;
}
