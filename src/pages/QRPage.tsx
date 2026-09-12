import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { Logo } from '../components/Logo';

// The single production check-in URL. Set VITE_CHECKIN_URL in your
// environment (see README) — falls back to the current origin so the QR
// still works immediately after deployment even if that variable is unset.
const CHECKIN_URL = (import.meta.env.VITE_CHECKIN_URL as string) || window.location.origin;

export function QRPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 print:bg-white">
      <div className="w-full max-w-sm text-center">
        <Logo size="lg" className="mx-auto print:shadow-none" />
        <h1 className="mt-5 font-display text-lg tracking-wide text-parchment-50 print:text-black">
          CIC Convocation Ceremony
        </h1>
        <p className="mt-1 text-sm uppercase tracking-widest text-gilt-400 print:text-ink-700">
          Check-In QR Code
        </p>

        <div className="mt-8 inline-flex rounded-lg border border-ink-700 bg-parchment-50 p-6 shadow-card print:border-0 print:shadow-none">
          <QRCodeSVG value={CHECKIN_URL} size={240} bgColor="#FBF9F4" fgColor="#12151C" level="M" />
        </div>

        <p className="mt-6 text-sm text-parchment-200/70 print:text-ink-700">
          Scan to access event check-in
        </p>

        <button
          onClick={() => window.print()}
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-ink-700 px-4 py-2 text-sm text-parchment-200/80 transition-colors hover:bg-ink-900 print:hidden"
        >
          <Printer className="h-4 w-4" /> Print this page
        </button>
      </div>
    </div>
  );
}
