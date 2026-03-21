/**
 * PDFClient.tsx — ALL @react-pdf/renderer usage lives here.
 *
 * Loaded via a SINGLE dynamic({ ssr: false }) in invoice.tsx.
 * No nested dynamic() calls — that would put LoadableComponent inside the PDF
 * reconciler and crash with "useSyncExternalStore is not a function".
 *
 * Key fixes vs naive implementation:
 *  1. Logo is embedded as base64 — relative paths (/logo.png) cause the PDF
 *     renderer to hang indefinitely in loading:true state.
 *  2. VRow uses React.createElement to avoid JSX whitespace text nodes (`''`)
 *     that produce "Invalid string child outside <Text>" warnings.
 *  3. usePDF hook instead of PDFDownloadLink render-prop — gives a stable blob
 *     URL we can attach to a plain <button> with no reconciler conflicts.
 */
import React, { useEffect, useRef, useCallback } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  usePDF,
  PDFViewer,
} from '@react-pdf/renderer';
import { InvoiceData, numberToWords } from '@/lib/invoiceUtils';
import LOGO_BASE64 from '@/lib/logoBase64';

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLACK = '#000000';
const GREY  = '#666666';

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: '28pt 36pt 24pt 36pt',
    color: BLACK,
    backgroundColor: '#ffffff',
  },

  // Header
  headerRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingBottom: 6, borderBottom: '2pt solid #000000' },
  logoBox:        { width: 70, height: 70, marginRight: 12, flexShrink: 0 },
  logo:           { width: '100%', height: '100%', objectFit: 'contain' },
  headerMiddle:   { flex: 1, justifyContent: 'center' },
  tagline:        { fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 0.4, marginBottom: 2 },
  companyName:    { fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  subTagline:     { fontSize: 7, color: GREY },
  headerRight:    { width: 130, alignItems: 'flex-end', justifyContent: 'center' },
  proprietorName: { fontSize: 11, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  proprietorTitle:{ fontSize: 8, color: GREY, textAlign: 'right' },

  // REF / Date bar
  refBar:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 6 },
  refText:  { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  dateText: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // Title
  titleBox: { alignItems: 'center', marginBottom: 10 },
  title:    { fontSize: 18, fontFamily: 'Helvetica-BoldOblique', letterSpacing: 2, textDecoration: 'underline' },

  // TO section
  toLabel:  { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  toLine:   { fontSize: 9, fontFamily: 'Helvetica-BoldOblique', marginLeft: 16, lineHeight: 1.4 },
  acLine:   { fontSize: 9, fontFamily: 'Helvetica-BoldOblique', marginLeft: 16, marginTop: 4 },
  dearLine: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 6, marginBottom: 2 },
  bodyText: { fontSize: 8.5, fontFamily: 'Helvetica-BoldOblique', lineHeight: 1.4, marginBottom: 8 },

  // Table
  table:        { width: '100%', borderTop: '1.5pt solid #000000', borderLeft: '1.5pt solid #000000', borderRight: '1.5pt solid #000000' },
  tableHeaderRow: { flexDirection: 'row', borderBottom: '1.5pt solid #000000' },
  tableRow:     { flexDirection: 'row', borderBottom: '1pt solid #000000' },
  tableLastRow: { flexDirection: 'row', borderBottom: '1.5pt solid #000000' },

  colDesc:  { flex: 1, borderRight: '1pt solid #000000', padding: '4pt 6pt' },
  colQty:   { width: 30, borderRight: '1pt solid #000000', padding: '4pt 4pt', alignItems: 'center' },
  colUnit:  { width: 70, borderRight: '1pt solid #000000', padding: '4pt 6pt', alignItems: 'center' },
  colTotal: { width: 70, padding: '4pt 6pt', alignItems: 'center' },

  headerCell: { fontSize: 8, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center' },
  descLine:   { fontSize: 8.5, fontFamily: 'Helvetica-BoldOblique', lineHeight: 1.5 },
  descVal:    { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  priceText:  { fontSize: 10, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center' },
  termsText:  { fontSize: 7.5, fontFamily: 'Helvetica-BoldOblique', lineHeight: 1.4 },
  totalLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  totalVal:   { fontSize: 10, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center' },

  // In word
  inWordRow:   { flexDirection: 'row', marginTop: 8, marginBottom: 10 },
  inWordLabel: { fontSize: 9, fontFamily: 'Helvetica-BoldOblique', marginRight: 4 },
  inWordValue: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // Footer
  footer:      { borderTop: '1pt solid #000000', paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  footerLeft:  { flex: 1 },
  footerLine:  { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  footerIcon:  { width: 10, fontSize: 8, marginRight: 6, textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  footerText:  { fontSize: 8 },
  footerSig:   { fontSize: 8, fontFamily: 'Helvetica-BoldOblique', textAlign: 'right', marginTop: 16 },
});

// ─── VRow: use createElement to avoid JSX whitespace '' text nodes ────────────
// JSX like <Text>{label}<Text>{value}</Text></Text> emits whitespace children
// between elements, which @react-pdf treats as invalid string nodes outside <Text>.
function VRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return React.createElement(
    Text, { style: s.descLine },
    label,
    React.createElement(Text, { style: s.descVal }, value.toUpperCase()),
  );
}

// ─── The PDF document ─────────────────────────────────────────────────────────
function InvoiceDocument({ data }: { data: InvoiceData }) {
  const total = data.qty * data.unitPrice;

  const terms = data.type === 'QUOTATION'
    ? 'PAYMENT: 100% PAYMENT SHOULD BE MADE IN CASH/P.O/D.D/T.T IN FAVOR OF HAFIJA AUTO AT THE TIME OF DELIVERY.\nDELIVERY: WITHIN 7 (SEVEN) DAYS AFTER RECEIVING PURCHASE/WORD ORDER.\nWARRANTY: WE SHALL PROVIDE FREE AFTER SALES SERVICE FOR ONE YEAR WITHOUT SPARE PARTS.\nVALIDITY: VALID FOR 20 (TWENTY) DAYS FROM THE DATE OF ISSUE.'
    : 'PAYMENT: 100% PAYMENT HAS BEEN RECEIVED IN CASH/P.O/D.D/T.T IN FAVOR OF HAFIJA AUTO.\nDELIVERY: VEHICLE DELIVERED AS PER AGREED TERMS.\nWARRANTY: FREE AFTER SALES SERVICE FOR ONE YEAR WITHOUT SPARE PARTS.';

  return (
    <Document title={`${data.type} ${data.ref}`} author="Hafija Auto">
      <Page size="A4" style={s.page}>

        {/* HEADER */}
        <View style={s.headerRow}>
          <View style={s.logoBox}>
            {/* base64 src — avoids HTTP fetch that hangs PDF generation */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={s.logo} src={LOGO_BASE64} />
          </View>
          <View style={s.headerMiddle}>
            <Text style={s.tagline}>ALL KIND OF RECONDITIONED CAR RETAILER &amp; WHOLESALER</Text>
            <Text style={s.companyName}>HAFIJA AUTO</Text>
            <Text style={s.subTagline}>Just Buy and Run</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.proprietorName}>FARDIN ISLAM ALAMIN</Text>
            <Text style={s.proprietorTitle}>Proprietor</Text>
          </View>
        </View>

        {/* REF / DATE */}
        <View style={s.refBar}>
          <Text style={s.refText}>{'REF: ' + data.ref}</Text>
          <Text style={s.dateText}>{'DATE: ' + data.date}</Text>
        </View>

        {/* TITLE */}
        <View style={s.titleBox}>
          <Text style={s.title}>{data.type}</Text>
        </View>

        {/* TO */}
        <View style={{ marginBottom: 8 }}>
          <Text style={s.toLabel}>TO,</Text>
          {!!data.toCompany && <Text style={s.toLine}>{data.toCompany.toUpperCase()}</Text>}
          {!!data.toAddress && <Text style={s.toLine}>{data.toAddress.toUpperCase()}</Text>}
          {!!data.toAC      && <Text style={s.acLine}>{'A/C: ' + data.toAC.toUpperCase()}</Text>}
          <Text style={s.dearLine}>DEAR SIR,</Text>
          <Text style={s.bodyText}>
            {data.type === 'QUOTATION'
              ? 'WE ARE PLEASED TO OFFER YOU THE UNDER MENTION VEHICLE WITH THE FOLLOWING TERM & CONDITION:'
              : 'WE ARE PLEASED TO CONFIRM THE SALE OF THE UNDER MENTIONED VEHICLE AS PER THE FOLLOWING DETAILS:'}
          </Text>
        </View>

        {/* TABLE */}
        <View style={s.table}>
          {/* Header */}
          <View style={s.tableHeaderRow}>
            <View style={s.colDesc}><Text style={s.headerCell}>DESCRIPTION OF VEHICLE</Text></View>
            <View style={s.colQty}><Text style={s.headerCell}>QTY</Text></View>
            <View style={s.colUnit}><Text style={s.headerCell}>{'UNIT\nPRICE'}</Text></View>
            <View style={s.colTotal}><Text style={s.headerCell}>{'TOTAL\nPRICE'}</Text></View>
          </View>

          {/* Vehicle row */}
          <View style={s.tableRow}>
            <View style={s.colDesc}>
              <VRow label="BRAND NAME: " value={data.brand} />
              <VRow label="MODEL: "      value={data.model} />
              <VRow label="GRADE: "      value={data.grade} />
              <VRow label="YEAR MODEL: " value={data.yearModel} />
              <VRow label="CHASSIS NO: " value={data.chassisNo} />
              <VRow label="ENGINE NO: "  value={data.engineNo} />
              <VRow label="CC: "         value={data.cc} />
              <VRow label="COLOR: "      value={data.color} />
              <VRow label="OPTIONS: "    value={data.options} />
            </View>
            <View style={s.colQty}>
              <Text style={s.priceText}>{String(data.qty)}</Text>
            </View>
            <View style={s.colUnit}>
              <Text style={s.priceText}>{data.unitPrice.toLocaleString()}</Text>
            </View>
            <View style={s.colTotal}>
              <Text style={s.priceText}>{total.toLocaleString()}</Text>
            </View>
          </View>

          {/* Terms row */}
          <View style={s.tableRow}>
            <View style={{ flex: 1, padding: '4pt 6pt' }}>
              <Text style={s.termsText}>{'TERMS & CONDITION:\n' + terms}</Text>
            </View>
            <View style={s.colQty} />
            <View style={s.colUnit} />
            <View style={s.colTotal} />
          </View>

          {/* Total row */}
          <View style={s.tableLastRow}>
            <View style={s.colDesc}><Text style={s.totalLabel}>TOTAL</Text></View>
            <View style={s.colQty} />
            <View style={s.colUnit} />
            <View style={s.colTotal}><Text style={s.totalVal}>{total.toLocaleString()}</Text></View>
          </View>
        </View>

        {/* IN WORD */}
        <View style={s.inWordRow}>
          <Text style={s.inWordLabel}>IN WORD: </Text>
          <Text style={s.inWordValue}>{numberToWords(total)}</Text>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <View style={s.footerLeft}>
            <View style={s.footerLine}>
              <Text style={s.footerIcon}>@</Text>
              <Text style={s.footerText}>hafijaauto@gmail.com</Text>
            </View>
            <View style={s.footerLine}>
              <Text style={s.footerIcon}>C</Text>
              <Text style={s.footerText}>+8801986106812</Text>
            </View>
            <View style={s.footerLine}>
              <Text style={s.footerIcon}>L</Text>
              <Text style={s.footerText}>8/1 Gopi Kishan Lane Road Wari, Dhaka</Text>
            </View>
          </View>
          <Text style={s.footerSig}>AUTHORISED SIGNATURE</Text>
        </View>

      </Page>
    </Document>
  );
}

// ─── Download button using usePDF hook ────────────────────────────────────────
// usePDF generates a stable blob URL — no render-prop anchor conflicts.
// We call updateInstance whenever data changes so the blob stays fresh.
export function PDFDownloadButton({
  data,
  fileName,
  className,
}: {
  data: InvoiceData;
  fileName: string;
  className?: string;
}) {
  const [instance, updateInstance] = usePDF({ document: <InvoiceDocument data={data} /> });

  // Keep the blob in sync with form changes
  const prevRef = useRef<InvoiceData | null>(null);
  useEffect(() => {
    if (prevRef.current !== data) {
      prevRef.current = data;
      updateInstance(<InvoiceDocument data={data} />);
    }
  });

  const handleClick = useCallback(() => {
    if (!instance.url) return;
    const a = document.createElement('a');
    a.href = instance.url;
    a.download = fileName;
    a.click();
  }, [instance.url, fileName]);

  return (
    <button
      onClick={handleClick}
      disabled={instance.loading || !instance.url}
      className={className}
    >
      {instance.loading ? 'Preparing…' : '⬇ Download PDF'}
    </button>
  );
}

// ─── Preview modal ────────────────────────────────────────────────────────────
export function PDFPreviewModal({
  data,
  onClose,
}: {
  data: InvoiceData;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <span className="font-bold text-yellow-400">{'PDF Preview — ' + data.ref}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <InvoiceDocument data={data} />
        </PDFViewer>
      </div>
    </div>
  );
}
