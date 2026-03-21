// ─── REF Generator ───────────────────────────────────────────────────────────
export function generateRef(seq?: number): string {
  const year = new Date().getFullYear();
  const num = seq ?? Math.floor(Math.random() * 90) + 1; // 1–90 random until DB
  return `HA/${String(num).padStart(2, '0')}/${year}`;
}

// ─── Number to Words (BDT lakh system) ───────────────────────────────────────
const ones = [
  '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
  'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
  'SEVENTEEN', 'EIGHTEEN', 'NINETEEN',
];
const tens = [
  '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY',
];

function twoDigit(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
}

function threeDigit(n: number): string {
  if (n === 0) return '';
  if (n < 100) return twoDigit(n);
  return ones[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' ' + twoDigit(n % 100) : '');
}

export function numberToWords(amount: number): string {
  if (!amount || isNaN(amount)) return 'ZERO ONLY';
  const n = Math.floor(amount);

  if (n === 0) return 'ZERO ONLY';

  const crore = Math.floor(n / 10_000_000);
  const lakh  = Math.floor((n % 10_000_000) / 100_000);
  const thou  = Math.floor((n % 100_000) / 1_000);
  const hund  = n % 1_000;

  const parts: string[] = [];
  if (crore > 0) parts.push(threeDigit(crore) + ' CRORE');
  if (lakh  > 0) parts.push(twoDigit(lakh) + ' LACS');
  if (thou  > 0) parts.push(threeDigit(thou) + ' THOUSAND');
  if (hund  > 0) parts.push(threeDigit(hund));

  return parts.join(' ') + ' ONLY';
}

// ─── Invoice form data type ───────────────────────────────────────────────────
export type InvoiceType = 'QUOTATION' | 'INVOICE';

export interface InvoiceData {
  type: InvoiceType;
  ref: string;
  date: string;
  // Recipient
  toCompany: string;
  toAddress: string;
  toAC: string;
  // Vehicle
  brand: string;
  model: string;
  grade: string;
  yearModel: string;
  chassisNo: string;
  engineNo: string;
  cc: string;
  color: string;
  options: string;
  // Pricing
  qty: number;
  unitPrice: number;
}
