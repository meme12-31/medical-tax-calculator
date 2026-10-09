import { MedicalItem, Person } from '@/types';

/**
 * CSV Injection対策（先頭が =, +, -, @ の場合はシングルクォートでエスケープ）
 */
function sanitizeCsvCell(value: string | number | boolean): string {
  let str = String(value ?? '').trim();
  if (str.length > 0 && ['=', '+', '-', '@', '\t', '\r'].includes(str.charAt(0))) {
    str = `'${str}`;
  }
  // ダブルクォートが含まれている場合はエスケープ
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CATEGORY_NAMES: Record<string, string> = {
  hospital: '診療・治療（病院）',
  pharmacy: '医薬品購入（薬局）',
  transport: '通院交通費（電車・バス等）',
  care: '介護保険・その他サービス',
};

/**
 * 医療費明細のCSV出力
 */
export function exportMedicalItemsToCsv(
  items: MedicalItem[],
  persons: Person[],
  filename = 'medical-deduction-items.csv'
): void {
  if (typeof window === 'undefined') return;

  const personMap = new Map<string, string>();
  for (const p of persons) {
    personMap.set(p.id, p.name);
  }

  const headers = [
    'No',
    '発生日/年月',
    '対象家族',
    '分類',
    '病院・薬局・支払先',
    '支払金額(円)',
    '保険金等補填額(円)',
    '実質負担額(円)',
    'セルフメディケーション対象',
  ];

  const rows = items.map((item, index) => {
    const personName = personMap.get(item.personId) || '不明';
    const categoryName = CATEGORY_NAMES[item.category] || item.category;
    const net = Math.max(0, (item.amount || 0) - (item.reimbursement || 0));
    const isSelfMed = item.isSelfMedication ? '対象' : '対象外';

    return [
      index + 1,
      item.date || '-',
      personName,
      categoryName,
      item.providerName || '-',
      item.amount || 0,
      item.reimbursement || 0,
      net,
      isSelfMed,
    ].map(sanitizeCsvCell).join(',');
  });

  // 合計行
  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalReimb = items.reduce((sum, item) => sum + (item.reimbursement || 0), 0);
  const totalNet = items.reduce((sum, item) => sum + Math.max(0, (item.amount || 0) - (item.reimbursement || 0)), 0);
  
  const totalRow = [
    '合計',
    '-',
    '-',
    '-',
    '-',
    totalAmount,
    totalReimb,
    totalNet,
    '-',
  ].map(sanitizeCsvCell).join(',');

  const csvContent = [
    headers.map(sanitizeCsvCell).join(','),
    ...rows,
    totalRow,
  ].join('\r\n');

  // UTF-8 BOM
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
