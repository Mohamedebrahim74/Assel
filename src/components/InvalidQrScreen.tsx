interface InvalidQrScreenProps {
  onScanAgain: () => void;
}

export function InvalidQrScreen({ onScanAgain }: InvalidQrScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-sm animate-fadeUp">
        {/* Error badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-signal-error text-signal-error animate-ringPop">
          <span className="text-3xl leading-none">×</span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-parchment-50">
          Invalid QR Code
        </h1>
        <p className="mt-3 text-parchment-200/80">
          This QR code is not valid for CIC Convocation Ceremony.
        </p>

        <button
          onClick={onScanAgain}
          className="mt-10 w-full rounded-md bg-gilt-500 py-4 text-base font-semibold text-ink-950 transition-colors hover:bg-gilt-400 active:scale-[0.99]"
        >
          Scan Again
        </button>
      </div>
    </div>
  );
}
