import { AppStorageData, Person, MedicalItem } from '@/types';

export const STORAGE_KEY = 'med_tax_calc_data_v1';

export const DEFAULT_PERSONS: Person[] = [
  {
    id: 'person-1',
    name: '本人（夫）',
    incomeType: 'salary',
    annualIncome: 0,
    socialInsurance: 0,
    dependentsCount: 0,
    furusatoTax: 0,
  },
  {
    id: 'person-2',
    name: '配偶者（妻）',
    incomeType: 'salary',
    annualIncome: 0,
    socialInsurance: 0,
    dependentsCount: 0,
    furusatoTax: 0,
  },
];

export const DEMO_PERSONS: Person[] = [
  {
    id: 'person-1',
    name: '本人（夫）',
    incomeType: 'salary',
    annualIncome: 5000000, // 500万円
    socialInsurance: 750000,
    dependentsCount: 1,
    furusatoTax: 50000,
  },
  {
    id: 'person-2',
    name: '配偶者（妻）',
    incomeType: 'salary',
    annualIncome: 3000000, // 300万円
    socialInsurance: 450000,
    dependentsCount: 0,
    furusatoTax: 20000,
  },
];

export const DEMO_MEDICAL_ITEMS: MedicalItem[] = [
  {
    id: 'item-1',
    personId: 'person-1',
    date: '2026-02-10',
    category: 'hospital',
    providerName: '中央総合病院（内科・検査）',
    amount: 65000,
    reimbursement: 10000,
    isSelfMedication: false,
  },
  {
    id: 'item-2',
    personId: 'person-1',
    date: '2026-03-15',
    category: 'pharmacy',
    providerName: 'みどり薬局（処方薬）',
    amount: 18000,
    reimbursement: 0,
    isSelfMedication: false,
  },
  {
    id: 'item-3',
    personId: 'person-2',
    date: '2026-05-20',
    category: 'hospital',
    providerName: 'さくら歯科クリニック（インプラント治療）',
    amount: 120000,
    reimbursement: 30000,
    isSelfMedication: false,
  },
  {
    id: 'item-4',
    personId: 'person-2',
    date: '2026-07-08',
    category: 'transport',
    providerName: 'JR東日本・都営地下鉄（通院交通費）',
    amount: 6400,
    reimbursement: 0,
    isSelfMedication: false,
  },
  {
    id: 'item-5',
    personId: 'person-1',
    date: '2026-09-12',
    category: 'pharmacy',
    providerName: 'ドラッグストア（スイッチOTC医薬品・風邪薬等）',
    amount: 24000,
    reimbursement: 0,
    isSelfMedication: true,
  },
];

export const INITIAL_STORAGE_DATA: AppStorageData = {
  persons: DEFAULT_PERSONS,
  medicalItems: [],
  selectedPersonId: 'person-1',
  activeInputTab: 'simple',
  version: 1,
};

/**
 * LocalStorageからデータを読み込む
 */
export function loadAppData(): AppStorageData {
  if (typeof window === 'undefined') {
    return INITIAL_STORAGE_DATA;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STORAGE_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return INITIAL_STORAGE_DATA;
    }
    // バリデーション＆フォールバック
    const persons = Array.isArray(parsed.persons) && parsed.persons.length > 0
      ? parsed.persons
      : DEFAULT_PERSONS;
    const medicalItems = Array.isArray(parsed.medicalItems)
      ? parsed.medicalItems
      : [];
    const selectedPersonId = typeof parsed.selectedPersonId === 'string' && parsed.selectedPersonId
      ? parsed.selectedPersonId
      : persons[0].id;
    const activeInputTab = parsed.activeInputTab === 'detailed' ? 'detailed' : 'simple';

    return {
      persons,
      medicalItems,
      selectedPersonId,
      activeInputTab,
      version: 1,
    };
  } catch (error) {
    console.error('Failed to load storage data:', error);
    return INITIAL_STORAGE_DATA;
  }
}

/**
 * LocalStorageにデータを保存する
 */
export function saveAppData(data: AppStorageData): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save storage data:', error);
    return false;
  }
}

/**
 * データを初期状態にリセット
 */
export function resetAppData(): AppStorageData {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_STORAGE_DATA;
}

/**
 * デモデータをロード
 */
export function getDemoAppData(): AppStorageData {
  return {
    persons: DEMO_PERSONS,
    medicalItems: DEMO_MEDICAL_ITEMS,
    selectedPersonId: 'person-1',
    activeInputTab: 'detailed',
    version: 1,
  };
}
