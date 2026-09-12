import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertTriangle } from 'lucide-react';

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

type ScannerState = 'initializing' | 'scanning' | 'error';

export function QrScanner({ onScan, onClose }: QrScannerProps) {
  const [state, setState] = useState<ScannerState>('initializing');
  const [errorMessage, setErrorMessage] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScannedRef = useRef(false);

  const startScanner = async () => {
    setState('initializing');
    setErrorMessage('');
    hasScannedRef.current = false;

    const scannerId = 'qr-reader';

    // Ensure the container element exists
    if (!containerRef.current) return;

    try {
      // Clean up any previous scanner instance
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // ignore — may already be stopped
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }

      const html5Qrcode = new Html5Qrcode(scannerId);
      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          if (!hasScannedRef.current) {
            hasScannedRef.current = true;
            // Stop the scanner then notify parent
            html5Qrcode
              .stop()
              .then(() => {
                onScan(decodedText);
              })
              .catch(() => {
                onScan(decodedText);
              });
          }
        },
        () => {
          // QR code not found in frame — ignore silently
        }
      );

      setState('scanning');
    } catch (err: any) {
      const message =
        err?.message || 'Unable to access camera. Please check your permissions.';
      setErrorMessage(message);
      setState('error');
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // ignore
      }
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink-950">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-gilt-400" />
          <span className="font-display text-lg text-parchment-50">Scan QR Code</span>
        </div>
        <button
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-700 text-parchment-200/80 transition-colors hover:bg-ink-900"
          aria-label="Close scanner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scanner area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {state === 'initializing' && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gilt-400 border-t-transparent" />
            <p className="text-sm text-parchment-200/70">Starting camera…</p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-signal-error text-signal-error">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-xl text-parchment-50">Camera Error</h2>
            <p className="max-w-xs text-sm text-parchment-200/70">{errorMessage}</p>
            <button
              onClick={startScanner}
              className="mt-2 rounded-md bg-gilt-500 px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-gilt-400"
            >
              Try Again
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          className={`w-full max-w-sm overflow-hidden rounded-lg ${
            state === 'scanning' ? 'block' : 'hidden'
          }`}
        >
          <div id="qr-reader" className="w-full" />
        </div>

        {state === 'scanning' && (
          <p className="mt-6 text-center text-sm text-parchment-200/70">
            Point your camera at the official CIC event QR code
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleClose}
          className="w-full rounded-md border border-ink-700 py-4 text-base font-semibold text-parchment-100 transition-colors hover:bg-ink-900 active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
