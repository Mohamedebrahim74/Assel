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
  const hasScannedRef = useRef(false);
  const mountedRef = useRef(true);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const scannerState = scannerRef.current.getState();
        // State 2 = SCANNING, State 3 = PAUSED
        if (scannerState === 2 || scannerState === 3) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore
      }
      try {
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
  };

  const startScanner = async () => {
    setState('initializing');
    setErrorMessage('');
    hasScannedRef.current = false;

    await stopScanner();

    // Small delay to ensure the DOM element is fully rendered and visible
    await new Promise((r) => setTimeout(r, 300));

    if (!mountedRef.current) return;

    const readerEl = document.getElementById('qr-reader');
    if (!readerEl) {
      setErrorMessage('Scanner element not found. Please try again.');
      setState('error');
      return;
    }

    try {
      const html5Qrcode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5Qrcode;

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        throw new Error('No cameras found on this device.');
      }

      if (!mountedRef.current) return;

      // Prefer the back/environment camera
      const backCamera = cameras.find(
        (c) =>
          c.label.toLowerCase().includes('back') ||
          c.label.toLowerCase().includes('rear') ||
          c.label.toLowerCase().includes('environment')
      );

      const cameraConfig = backCamera
        ? { deviceId: { exact: backCamera.id } }
        : { facingMode: 'environment' as const };

      await html5Qrcode.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (!hasScannedRef.current) {
            hasScannedRef.current = true;
            html5Qrcode
              .stop()
              .then(() => onScan(decodedText))
              .catch(() => onScan(decodedText));
          }
        },
        () => {
          // QR code not found in frame — ignore
        }
      );

      if (mountedRef.current) {
        setState('scanning');
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      let message = 'Unable to access camera.';
      if (typeof err === 'string') {
        message = err;
      } else if (err?.message) {
        message = err.message;
      }
      if (
        message.includes('NotAllowedError') ||
        message.includes('Permission')
      ) {
        message =
          'Camera permission denied. Please allow camera access in your browser settings and try again.';
      }
      setErrorMessage(message);
      setState('error');
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    startScanner();

    return () => {
      mountedRef.current = false;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink-950">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-gilt-400" />
          <span className="font-display text-lg text-parchment-50">
            Scan QR Code
          </span>
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
        {state === 'error' ? (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-signal-error text-signal-error">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-xl text-parchment-50">
              Camera Error
            </h2>
            <p className="max-w-xs text-sm text-parchment-200/70">
              {errorMessage}
            </p>
            <button
              onClick={startScanner}
              className="mt-2 rounded-md bg-gilt-500 px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-gilt-400"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Loading spinner — overlaid on top while initializing */}
            {state === 'initializing' && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink-950/80">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gilt-400 border-t-transparent" />
                <p className="mt-4 text-sm text-parchment-200/70">
                  Starting camera…
                </p>
              </div>
            )}

            {/* Camera viewfinder — always rendered so html5-qrcode can attach */}
            <div className="w-full max-w-sm overflow-hidden rounded-lg">
              <div id="qr-reader" style={{ width: '100%' }} />
            </div>

            <p className="mt-6 text-center text-sm text-parchment-200/70">
              Point your camera at the official CIC event QR code
            </p>
          </>
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
