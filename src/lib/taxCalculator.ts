import {
  Person,
  MedicalItem,
  PersonTaxSummary,
  SystemResult,
  CalculationResult,
} from '@/types';

/**
 * 給与所得控除の計算 (令和2年分以降)
 */
export function calculateEmploymentDeduction(salaryIncome: number): number {
  if (salaryIncome <= 0) return 0;
  if (salaryIncome <= 550000) {
    return salaryIncome;
  }
  if (salaryIncome <= 1625000) {
    return 550000;
  }
  if (salaryIncome <= 1800000) {
    return Math.floor(salaryIncome * 0.4 - 100000);
  }
  if (salaryIncome <= 3600000) {
    return Math.floor(salaryIncome * 0.3 + 80000);
  }
  if (salaryIncome <= 6600000) {
    return Math.floor(salaryIncome * 0.2 + 440000);
  }
  if (salaryIncome <= 8500000) {
    return Math.floor(salaryIncome * 0.1 + 1100000);
  }
  return 1950000; // 850万円超は一律上限195万円
}

/**
 * 公的年金等控除の計算 (65歳以上標準基準)
 */
export function calculatePensionDeduction(pensionIncome: number): number {
  if (pensionIncome <= 0) return 0;
  if (pensionIncome <= 1100000) {
    return pensionIncome;
  }
  if (pensionIncome <= 3300000) {
    return 1100000;
  }
  if (pensionIncome <= 4100000) {
    return Math.floor(pensionIncome * 0.25 + 275000);
  }
  if (pensionIncome <= 7700000) {
    return Math.floor(pensionIncome * 0.15 + 685000);
  }
  if (pensionIncome <= 10000000) {
    return Math.floor(pensionIncome * 0.05 + 1455000);
  }
  return 1955000;
}

/**
 * 収入区分に応じた総所得金額の算出
 */
export function calculateGrossIncome(person: Person): {
  grossIncome: number;
  employmentDeduction: number;
} {
  const income = Math.max(0, person.annualIncome || 0);

  if (person.incomeType === 'salary') {
    const deduction = calculateEmploymentDeduction(income);
    const gross = Math.max(0, income - deduction);
    return { grossIncome: gross, employmentDeduction: deduction };
  } else if (person.incomeType === 'pension') {
    const deduction = calculatePensionDeduction(income);
    const gross = Math.max(0, income - deduction);
    return { grossIncome: gross, employmentDeduction: deduction };
  } else {
    // business (事業所得) - 簡易入力ではそのまま所得として扱う
    return { grossIncome: income, employmentDeduction: 0 };
  }
}

/**
 * 所得税の限界税率 (所得税の速算表)
 */
export function getIncomeTaxRate(taxableIncome: number): {
  rate: number;
  deduction: number;
} {
  if (taxableIncome <= 0) {
    return { rate: 0.05, deduction: 0 };
  }
  if (taxableIncome <= 1950000) {
    return { rate: 0.05, deduction: 0 };
  }
  if (taxableIncome <= 3300000) {
    return { rate: 0.10, deduction: 97500 };
  }
  if (taxableIncome <= 6950000) {
    return { rate: 0.20, deduction: 427500 };
  }
  if (taxableIncome <= 9000000) {
    return { rate: 0.23, deduction: 636000 };
  }
  if (taxableIncome <= 18000000) {
    return { rate: 0.33, deduction: 1536000 };
  }
  if (taxableIncome <= 40000000) {
    return { rate: 0.40, deduction: 2796000 };
  }
  return { rate: 0.45, deduction: 4796000 };
}

/**
 * 申告候補者の税制サマリー計算
 */
export function calculatePersonTaxSummary(person: Person): PersonTaxSummary {
  const { grossIncome, employmentDeduction } = calculateGrossIncome(person);
  
  // 基礎控除 (合計所得金額2400万円以下: 48万円)
  const basicDeduction = grossIncome > 24000000 ? 0 : 480000;
  
  // 社会保険料控除 (実額入力、未入力時は0)
  const socialInsuranceDeduction = Math.max(0, person.socialInsurance || 0);

  // 扶養控除概算 (一般扶養 38万円 × 人数)
  const dependentsDeduction = Math.max(0, (person.dependentsCount || 0) * 380000);

  // 課税所得金額 = 総所得金額 - 基礎控除 - 社会保険料控除 - 扶養控除 (1,000円未満切り捨て)
  const rawTaxable = grossIncome - basicDeduction - socialInsuranceDeduction - dependentsDeduction;
  const taxableIncome = Math.max(0, Math.floor(rawTaxable / 1000) * 1000);

  const { rate: incomeTaxRate } = getIncomeTaxRate(taxableIncome);
  const residentTaxRate = 0.10; // 住民税率 一律10% (所得割)

  // 医療費控除の足切り額: min(100,000, 総所得金額 × 5%)
  const thresholdDeduction = Math.min(100000, Math.floor(grossIncome * 0.05));

  return {
    person,
    grossIncome,
    employmentDeduction,
    basicDeduction,
    socialInsuranceDeduction,
    taxableIncome,
    incomeTaxRate,
    residentTaxRate,
    thresholdDeduction,
  };
}

/**
 * 医療費明細の集計
 * 注意: 保険金等の補填額は該当項目からのみ引く (max(0, amount - reimbursement))
 */
export function aggregateMedicalExpenses(items: MedicalItem[]): {
  totalExpense: number;
  totalReimbursement: number;
  netExpense: number;
  selfMedicationExpense: number;
} {
  let totalExpense = 0;
  let totalReimbursement = 0;
  let netExpense = 0;
  let selfMedicationExpense = 0;

  for (const item of items) {
    const amt = Math.max(0, item.amount || 0);
    const reimb = Math.max(0, item.reimbursement || 0);
    const net = Math.max(0, amt - reimb);

    totalExpense += amt;
    totalReimbursement += reimb;
    netExpense += net;

    if (item.isSelfMedication) {
      selfMedicationExpense += net;
    }
  }

  return {
    totalExpense,
    totalReimbursement,
    netExpense,
    selfMedicationExpense,
  };
}

/**
 * 特定の申告者に対する通常医療費控除とセルフメディケーション税制の計算
 */
export function calculateSystemResults(
  summary: PersonTaxSummary,
  netExpense: number,
  selfMedicationExpense: number
): { regular: SystemResult; selfMed: SystemResult } {
  // 1. 通常医療費控除
  // 足切り額 = min(10万円, 総所得金額の5%)
  const regularThreshold = summary.thresholdDeduction;
  const rawRegularEligible = Math.max(0, netExpense - regularThreshold);
  const regularDeduction = Math.min(2000000, rawRegularEligible); // 上限200万円

  // 所得税還付見込み額 = 控除額 × 所得税率 × 1.021 (復興特別所得税)
  const regularIncomeTaxRefund = Math.floor(regularDeduction * summary.incomeTaxRate * 1.021);
  // 住民税軽減額 = 控除額 × 10%
  const regularResidentTaxSaving = Math.floor(regularDeduction * summary.residentTaxRate);
  const regularTotalSaving = regularIncomeTaxRefund + regularResidentTaxSaving;

  const regular: SystemResult = {
    eligibleAmount: netExpense,
    threshold: regularThreshold,
    deductionAmount: regularDeduction,
    incomeTaxRefund: regularIncomeTaxRefund,
    residentTaxSaving: regularResidentTaxSaving,
    totalSaving: regularTotalSaving,
  };

  // 2. セルフメディケーション税制
  // 足切り額: 12,000円固定
  const selfMedThreshold = 12000;
  const rawSelfMedEligible = Math.max(0, selfMedicationExpense - selfMedThreshold);
  const selfMedDeduction = Math.min(88000, rawSelfMedEligible); // 上限88,000円

  const selfMedIncomeTaxRefund = Math.floor(selfMedDeduction * summary.incomeTaxRate * 1.021);
  const selfMedResidentTaxSaving = Math.floor(selfMedDeduction * summary.residentTaxRate);
  const selfMedTotalSaving = selfMedIncomeTaxRefund + selfMedResidentTaxSaving;

  const selfMed: SystemResult = {
    eligibleAmount: selfMedicationExpense,
    threshold: selfMedThreshold,
    deductionAmount: selfMedDeduction,
    incomeTaxRefund: selfMedIncomeTaxRefund,
    residentTaxSaving: selfMedResidentTaxSaving,
    totalSaving: selfMedTotalSaving,
  };

  return { regular, selfMed };
}

/**
 * ふるさと納税上限額への影響シミュレーション
 * 医療費控除による住民税所得割額の減少に伴う上限額減少目安
 */
export function calculateFurusatoImpact(
  summary: PersonTaxSummary,
  deductionAmount: number
): number {
  if (deductionAmount <= 0) return 0;
  
  // 限界税率に応じた減少比率（約2%〜5%）
  // 簡易式: 医療費控除額 × (0.10 / (1 - 0.10 - (所得税率 × 1.021))) × 0.20
  const denom = 1 - 0.10 - summary.incomeTaxRate * 1.021;
  if (denom <= 0) return 0;

  const factor = (0.10 / denom) * 0.20;
  const reduction = Math.round(deductionAmount * factor);
  return Math.max(0, reduction);
}

/**
 * 全体の計算実行（世帯比較、制度比較、ふるさと納税影響）
 */
export function calculateAll(
  persons: Person[],
  medicalItems: MedicalItem[],
  selectedPersonId: string
): CalculationResult {
  const defaultPersonId = persons[0]?.id || '1';
  const activePersonId = persons.find(p => p.id === selectedPersonId)?.id || defaultPersonId;

  // 1. 各人の税制サマリー計算
  const personSummaries: Record<string, PersonTaxSummary> = {};
  for (const person of persons) {
    personSummaries[person.id] = calculatePersonTaxSummary(person);
  }

  // 2. 医療費集計
  const { totalExpense, totalReimbursement, netExpense, selfMedicationExpense } =
    aggregateMedicalExpenses(medicalItems);

  // 3. 選択中の申告者における計算
  const currentSummary = personSummaries[activePersonId] || calculatePersonTaxSummary({
    id: 'default',
    name: '申告者',
    incomeType: 'salary',
    annualIncome: 0,
    socialInsurance: 0,
    dependentsCount: 0,
    furusatoTax: 0,
  });

  const { regular: regularSystem, selfMed: selfMedicationSystem } = calculateSystemResults(
    currentSummary,
    netExpense,
    selfMedicationExpense
  );

  let betterSystem: 'regular' | 'selfMedication' | 'equal' = 'equal';
  let systemSavingDiff = 0;

  if (regularSystem.totalSaving > selfMedicationSystem.totalSaving) {
    betterSystem = 'regular';
    systemSavingDiff = regularSystem.totalSaving - selfMedicationSystem.totalSaving;
  } else if (selfMedicationSystem.totalSaving > regularSystem.totalSaving) {
    betterSystem = 'selfMedication';
    systemSavingDiff = selfMedicationSystem.totalSaving - regularSystem.totalSaving;
  }

  // 4. 世帯内比較 (各Personが一括申告した場合)
  const personComparisons = persons.map(p => {
    const sum = personSummaries[p.id];
    const { regular, selfMed } = calculateSystemResults(sum, netExpense, selfMedicationExpense);
    const bestSaving = Math.max(regular.totalSaving, selfMed.totalSaving);
    const bestSys = regular.totalSaving >= selfMed.totalSaving ? 'regular' : 'selfMedication';
    return {
      personId: p.id,
      personName: p.name,
      regularTotalSaving: regular.totalSaving,
      selfMedTotalSaving: selfMed.totalSaving,
      bestSaving,
      bestSystem: bestSys as 'regular' | 'selfMedication',
    };
  });

  // 最も節税額が大きいPersonの特定
  let bestPersonId = activePersonId;
  let maxSaving = -1;
  let minSaving = Infinity;

  for (const pc of personComparisons) {
    if (pc.bestSaving > maxSaving) {
      maxSaving = pc.bestSaving;
      bestPersonId = pc.personId;
    }
    if (pc.bestSaving < minSaving) {
      minSaving = pc.bestSaving;
    }
  }

  const bestPersonSavingDiff = personComparisons.length > 1 && maxSaving > 0
    ? maxSaving - (minSaving === Infinity ? 0 : minSaving)
    : 0;

  // 5. ふるさと納税影響 (選択中の制度の控除額に基づく)
  const appliedDeduction = betterSystem === 'selfMedication'
    ? selfMedicationSystem.deductionAmount
    : regularSystem.deductionAmount;

  const furusatoLimitReduction = calculateFurusatoImpact(currentSummary, appliedDeduction);

  return {
    personSummaries,
    selectedPersonId: activePersonId,
    totalExpense,
    totalReimbursement,
    netExpense,
    selfMedicationExpense,
    regularSystem,
    selfMedicationSystem,
    betterSystem,
    systemSavingDiff,
    personComparisons,
    bestPersonId,
    bestPersonSavingDiff,
    furusatoLimitReduction,
  };
}
