import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ─── Types matching the invoices table ───────────────────────────────────────
export interface InvoiceRow {
  id: string;
  ref: string;
  type: 'QUOTATION' | 'INVOICE';
  date: string;
  to_company: string | null;
  to_address: string | null;
  to_ac: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  brand: string | null;
  model: string | null;
  grade: string | null;
  year_model: string | null;
  chassis_no: string | null;
  engine_no: string | null;
  cc: string | null;
  color: string | null;
  options: string | null;
  qty: number;
  unit_price: number;
  advance_payment: number;
  total_price: number;
  created_at: string;
  created_by: string | null;
}
