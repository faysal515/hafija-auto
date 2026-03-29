import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { generateRef, numberToWords, InvoiceData, InvoiceType } from '@/lib/invoiceUtils';
import { supabase, InvoiceRow } from '@/lib/supabase';

/**
 * ONE dynamic import for everything PDF-related.
 * PDFClient.tsx imports @react-pdf/renderer directly (no nested dynamic()).
 * This prevents LoadableComponent from being rendered inside the PDF reconciler,
 * which would crash with "dispatcher.useSyncExternalStore is not a function".
 */
const PDFDownloadButton = dynamic(
  () => import('@/components/invoice/PDFClient').then((m) => m.PDFDownloadButton),
  { ssr: false }
);
const PDFPreviewModal = dynamic(
  () => import('@/components/invoice/PDFClient').then((m) => m.PDFPreviewModal),
  { ssr: false }
);

// ─── Generic form field ───────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, placeholder = '', type = 'text', required = false,
}: {
  label: string; name: keyof InvoiceData; value: string | number;
  onChange: (n: keyof InvoiceData, v: string | number) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white
                   focus:outline-none focus:border-yellow-400 transition-colors placeholder-gray-500"
      />
    </div>
  );
}

// ─── Default state ────────────────────────────────────────────────────────────
function defaultData(): InvoiceData {
  return {
    type: 'QUOTATION',
    ref: generateRef(),
    date: new Date().toLocaleDateString('en-GB'),
    toCompany: '', toAddress: '', toAC: '',
    customerName: '', customerPhone: '', customerAddress: '',
    brand: '', model: '', grade: '', yearModel: '',
    chassisNo: '', engineNo: '', cc: '', color: '', options: '',
    qty: 1, unitPrice: 0, advancePayment: 0,
  };
}

// ─── Saved invoices sidebar item ──────────────────────────────────────────────
function InvoiceItem({
  row,
  onLoad,
}: {
  row: InvoiceRow;
  onLoad: (row: InvoiceRow) => void;
}) {
  return (
    <button
      onClick={() => onLoad(row)}
      className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700
                 border border-gray-700 hover:border-yellow-500 transition-colors group"
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-mono text-yellow-400">{row.ref}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          row.type === 'QUOTATION' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
        }`}>{row.type}</span>
      </div>
      <div className="text-xs text-gray-400 truncate">{row.to_company || '—'}</div>
      <div className="text-xs text-gray-500">{row.date}</div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvoicePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail]     = useState('');
  const [userId, setUserId]           = useState('');

  const [data, setData]           = useState<InvoiceData>(defaultData);
  const [preview, setPreview]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  const [savedList, setSavedList] = useState<InvoiceRow[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: s }) => {
      if (!s.session) {
        router.replace('/login');
      } else {
        setUserEmail(s.session.user.email ?? '');
        setUserId(s.session.user.id);
        setAuthChecked(true);
      }
    });

    // Keep auth state in sync (e.g. token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login');
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  // ── Load saved invoices ─────────────────────────────────────────────────────
  const fetchSaved = useCallback(async () => {
    setLoadingList(true);
    const { data: rows } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setSavedList(rows ?? []);
    setLoadingList(false);
  }, []);

  useEffect(() => {
    if (authChecked) fetchSaved();
  }, [authChecked, fetchSaved]);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const update = useCallback((name: keyof InvoiceData, val: string | number) => {
    setData((p) => ({ ...p, [name]: val }));
  }, []);

  // ── Load a saved invoice into the form ──────────────────────────────────────
  const loadRow = useCallback((row: InvoiceRow) => {
    setData({
      type:            row.type,
      ref:             row.ref,
      date:            row.date,
      toCompany:       row.to_company      ?? '',
      toAddress:       row.to_address      ?? '',
      toAC:            row.to_ac           ?? '',
      customerName:    row.customer_name   ?? '',
      customerPhone:   row.customer_phone  ?? '',
      customerAddress: row.customer_address ?? '',
      brand:           row.brand           ?? '',
      model:           row.model           ?? '',
      grade:           row.grade           ?? '',
      yearModel:       row.year_model      ?? '',
      chassisNo:       row.chassis_no      ?? '',
      engineNo:        row.engine_no       ?? '',
      cc:              row.cc              ?? '',
      color:           row.color           ?? '',
      options:         row.options         ?? '',
      qty:             row.qty,
      unitPrice:       row.unit_price,
      advancePayment:  row.advance_payment ?? 0,
    });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Save to DB ──────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    const total = data.qty * data.unitPrice;

    const payload = {
      ref:             data.ref,
      type:            data.type,
      date:            data.date,
      to_company:      data.toCompany       || null,
      to_address:      data.toAddress       || null,
      to_ac:           data.toAC            || null,
      customer_name:   data.customerName    || null,
      customer_phone:  data.customerPhone   || null,
      customer_address: data.customerAddress || null,
      brand:           data.brand           || null,
      model:           data.model           || null,
      grade:           data.grade           || null,
      year_model:      data.yearModel       || null,
      chassis_no:      data.chassisNo       || null,
      engine_no:       data.engineNo        || null,
      cc:              data.cc              || null,
      color:           data.color           || null,
      options:         data.options         || null,
      qty:             data.qty,
      unit_price:      data.unitPrice,
      advance_payment: data.advancePayment  || 0,
      total_price:     total,
      created_by:      userId,
    };

    // Upsert on ref so re-saving an existing one updates it
    const { error } = await supabase
      .from('invoices')
      .upsert(payload, { onConflict: 'ref' });

    if (error) {
      setSaveMsg({ ok: false, text: error.message });
    } else {
      setSaveMsg({ ok: true, text: 'Saved successfully!' });
      fetchSaved();
      setTimeout(() => setSaveMsg(null), 3000);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const total        = data.qty * data.unitPrice;
  const inWords      = numberToWords(total);
  const downloadName = `${data.type}-${data.ref.replace(/\//g, '-')}.pdf`;
  const btnYellow    = 'px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded font-bold text-sm transition-colors disabled:opacity-60';

  // ── Auth loading ─────────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Invoice / Quotation — Hafija Auto</title></Head>

      <div className="min-h-screen bg-gray-900 text-white">

        {/* ── Top bar ─────────────────────────────────────── */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <NextImage src="/logo.png" alt="Hafija Auto" width={36} height={36} className="object-contain" />
            <div>
              <div className="font-bold text-yellow-400 text-base leading-none">HAFIJA AUTO</div>
              <div className="text-xs text-gray-400">Invoice &amp; Quotation</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Saved invoices toggle */}
            <button
              onClick={() => { setSidebarOpen(true); fetchSaved(); }}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              📋 Saved ({savedList.length})
            </button>

            <button
              onClick={() => setPreview(true)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Preview PDF
            </button>

            <PDFDownloadButton data={data} fileName={downloadName} className={btnYellow} />

            {/* User + sign out */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-600">
              <span className="text-xs text-gray-400 hidden sm:block">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 bg-gray-700 hover:bg-red-800 rounded text-xs font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Save feedback banner ─────────────────────────── */}
        {saveMsg && (
          <div className={`px-4 py-2.5 text-sm font-medium text-center ${
            saveMsg.ok ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {saveMsg.text}
          </div>
        )}

        {/* ── Form ────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

            {/* Document Info */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">Document Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Document Type</label>
                  <div className="flex rounded overflow-hidden border border-gray-600">
                    {(['QUOTATION', 'INVOICE'] as InvoiceType[]).map((t) => (
                      <button key={t} type="button" onClick={() => update('type', t)}
                        className={`flex-1 py-2 text-sm font-bold transition-colors ${
                          data.type === t ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">REF (auto)</label>
                  <div className="flex gap-2">
                    <input value={data.ref} readOnly
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" />
                    <button type="button" title="Regenerate"
                      onClick={() => setData((p) => ({ ...p, ref: generateRef() }))}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-sm transition-colors">
                      ↻
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Date</label>
                  <input type="date"
                    value={data.date.includes('/') ? data.date.split('/').reverse().join('-') : data.date}
                    onChange={(e) => { const [y,m,d] = e.target.value.split('-'); update('date', `${d}/${m}/${y}`); }}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white
                               focus:outline-none focus:border-yellow-400 transition-colors" />
                </div>
              </div>
            </section>

            {/* Recipient / Customer */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">
                {data.type === 'QUOTATION' ? 'Recipient' : 'Customer Details'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.type === 'QUOTATION' ? (
                  <>
                    <Field label="Company / Person" name="toCompany" value={data.toCompany} onChange={update} placeholder="e.g. Mutual Trust Bank PLC" />
                    <Field label="Address"          name="toAddress" value={data.toAddress} onChange={update} placeholder="e.g. Aganagar, Keraniganj" />
                    <Field label="A/C Name (opt.)"  name="toAC"      value={data.toAC}      onChange={update} placeholder="e.g. Fahmina Faroque" />
                  </>
                ) : (
                  <>
                    <Field label="Customer Name"    name="customerName"    value={data.customerName}    onChange={update} placeholder="e.g. John Doe" required />
                    <Field label="Phone Number"     name="customerPhone"   value={data.customerPhone}   onChange={update} placeholder="e.g. +8801712345678" required />
                    <div className="sm:col-span-2">
                      <Field label="Address"        name="customerAddress" value={data.customerAddress} onChange={update} placeholder="e.g. House 10, Road 5, Dhanmondi, Dhaka" required />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Vehicle */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Brand"      name="brand"     value={data.brand}     onChange={update} placeholder="e.g. Toyota"                required />
                <Field label="Model"      name="model"     value={data.model}     onChange={update} placeholder="e.g. Corolla Fielder Hybrid" required />
                <Field label="Grade"      name="grade"     value={data.grade}     onChange={update} placeholder="e.g. EX" />
                <Field label="Year Model" name="yearModel" value={data.yearModel} onChange={update} placeholder="e.g. 2020" />
                <Field label="Chassis No" name="chassisNo" value={data.chassisNo} onChange={update} placeholder="e.g. NKE165-7231825" />
                <Field label="Engine No"  name="engineNo"  value={data.engineNo}  onChange={update} placeholder="e.g. 1NZ-B123456" />
                <Field label="CC"         name="cc"        value={data.cc}        onChange={update} placeholder="e.g. 1500" />
                <Field label="Color"      name="color"     value={data.color}     onChange={update} placeholder="e.g. Silver" />
                <div className="sm:col-span-2">
                  <Field label="Options" name="options" value={data.options} onChange={update} placeholder="e.g. TV, ABS, PS, PW" />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Quantity"       name="qty"       value={data.qty}       onChange={update} type="number" />
                <Field label="Unit Price (৳)" name="unitPrice" value={data.unitPrice} onChange={update} type="number" placeholder="e.g. 2700000" required />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Total</label>
                  <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm font-bold text-yellow-300">
                    {total > 0 ? `৳ ${total.toLocaleString()}` : '—'}
                  </div>
                </div>
              </div>

              {/* Advance Payment & Due Amount for INVOICE */}
              {data.type === 'INVOICE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Field label="Advance Payment (৳)" name="advancePayment" value={data.advancePayment} onChange={update} type="number" placeholder="e.g. 1000000" />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Due Amount</label>
                    <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm font-bold text-red-400">
                      {total > 0 ? `৳ ${(total - (data.advancePayment || 0)).toLocaleString()}` : '—'}
                    </div>
                  </div>
                </div>
              )}

              {total > 0 && (
                <div className="mt-4 p-3 bg-gray-700 rounded text-sm font-bold text-white tracking-wide">
                  IN WORD: {data.type === 'INVOICE' ? numberToWords(total - (data.advancePayment || 0)) : inWords}
                </div>
              )}
            </section>

            {/* Bottom actions */}
            <div className="flex justify-end gap-3 pb-8">
              <button type="button" onClick={() => setData(defaultData())}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded font-medium text-sm transition-colors">
                Reset
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-gray-600 hover:bg-gray-500 border border-gray-500 rounded font-bold text-sm transition-colors disabled:opacity-60">
                {saving ? 'Saving…' : '💾 Save to DB'}
              </button>
              <PDFDownloadButton data={data} fileName={downloadName} className={btnYellow} />
            </div>

          </form>
        </div>
      </div>

      {/* ── PDF Preview Modal ─────────────────────────────── */}
      {preview && <PDFPreviewModal data={data} onClose={() => setPreview(false)} />}

      {/* ── Saved Invoices Sidebar ────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
          {/* Panel */}
          <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <span className="font-bold text-yellow-400">Saved Invoices</span>
              <button onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loadingList && (
                <p className="text-xs text-gray-500 text-center py-4">Loading…</p>
              )}
              {!loadingList && savedList.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No saved invoices yet.</p>
              )}
              {savedList.map((row) => (
                <InvoiceItem key={row.id} row={row} onLoad={loadRow} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

InvoicePage.noLayout = true;
