import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { generateRef, numberToWords, InvoiceData, InvoiceType } from '@/lib/invoiceUtils';

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
    brand: '', model: '', grade: '', yearModel: '',
    chassisNo: '', engineNo: '', cc: '', color: '', options: '',
    qty: 1, unitPrice: 0,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvoicePage() {
  const [data, setData]         = useState<InvoiceData>(defaultData);
  const [preview, setPreview]   = useState(false);

  const update = useCallback((name: keyof InvoiceData, val: string | number) => {
    setData((p) => ({ ...p, [name]: val }));
  }, []);

  const total       = data.qty * data.unitPrice;
  const inWords     = numberToWords(total);
  const downloadName = `${data.type}-${data.ref.replace(/\//g, '-')}.pdf`;

  const btnCls =
    'px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded font-bold text-sm transition-colors disabled:opacity-60';

  return (
    <>
      <Head><title>Invoice / Quotation — Hafija Auto</title></Head>

      <div className="min-h-screen bg-gray-900 text-white">

        {/* ── Top bar ───────────────────────────────────── */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Hafija Auto" className="h-10 w-10 object-contain" />
            <div>
              <div className="font-bold text-yellow-400 text-lg leading-none">HAFIJA AUTO</div>
              <div className="text-xs text-gray-400">Invoice &amp; Quotation Generator</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(true)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Preview PDF
            </button>
            <PDFDownloadButton data={data} fileName={downloadName} className={btnCls} />
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

            {/* Document Info */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">Document Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Type */}
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

                {/* REF */}
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

                {/* Date */}
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

            {/* Recipient */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">Recipient</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company / Person" name="toCompany" value={data.toCompany} onChange={update} placeholder="e.g. Mutual Trust Bank PLC" />
                <Field label="Address"          name="toAddress" value={data.toAddress} onChange={update} placeholder="e.g. Aganagar, Keraniganj" />
                <Field label="A/C Name (opt.)"  name="toAC"      value={data.toAC}      onChange={update} placeholder="e.g. Fahmina Faroque" />
              </div>
            </section>

            {/* Vehicle */}
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Brand"      name="brand"     value={data.brand}     onChange={update} placeholder="e.g. Toyota"                  required />
                <Field label="Model"      name="model"     value={data.model}     onChange={update} placeholder="e.g. Corolla Fielder Hybrid"   required />
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
              {total > 0 && (
                <div className="mt-4 p-3 bg-gray-700 rounded text-sm font-bold text-white tracking-wide">
                  IN WORD: {inWords}
                </div>
              )}
            </section>

            {/* Bottom actions */}
            <div className="flex justify-end gap-3 pb-8">
              <button type="button" onClick={() => setData(defaultData())}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded font-medium text-sm transition-colors">
                Reset Form
              </button>
              <PDFDownloadButton data={data} fileName={downloadName} className={btnCls} />
            </div>

          </form>
        </div>
      </div>

      {preview && <PDFPreviewModal data={data} onClose={() => setPreview(false)} />}
    </>
  );
}
