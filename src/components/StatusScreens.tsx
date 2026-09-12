import type { ReactNode } from 'react';

function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-sm animate-fadeUp">{children}</div>
    </div>
  );
}

function BadgeRing({ tone, children }: { tone: 'success' | 'error' | 'warn'; children: ReactNode }) {
  const toneClasses = {
    success: 'border-signal-success text-signal-success',
    error: 'border-signal-error text-signal-error',
    warn: 'border-signal-warn text-signal-warn',
  }[tone];

  return (
    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 ${toneClasses} animate-ringPop`}
    >
      {children}
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path
        d="M8 18l6 6 12-14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="48"
        strokeDashoffset="48"
        className="animate-drawCheck"
      />
    </svg>
  );
}

interface SuccessScreenProps {
  name: string;
  time: string;
  onDone: () => void;
}

export function SuccessScreen({ name, time, onDone }: SuccessScreenProps) {
  return (
    <ScreenShell>
      <BadgeRing tone="success">
        <CheckGlyph />
      </BadgeRing>
      <p className="mt-6 text-sm uppercase tracking-[0.2em] text-ink-600">Check-in confirmed</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-parchment-50">Welcome, {name}</h1>
      <p className="mt-2 text-parchment-200/80">You're successfully checked in.</p>
      <div className="mt-8 rounded-md border border-ink-700 bg-ink-900 px-6 py-4">
        <p className="text-xs uppercase tracking-widest text-ink-600">Check-in time</p>
        <p className="mt-1 font-display text-2xl text-gilt-400">{time}</p>
      </div>
      <button
        onClick={onDone}
        className="mt-10 w-full rounded-md bg-gilt-500 py-4 text-base font-semibold text-ink-950 transition-colors hover:bg-gilt-400 active:scale-[0.99]"
      >
        Done
      </button>
    </ScreenShell>
  );
}

interface NotFoundScreenProps {
  onRetry: () => void;
}

export function NotFoundScreen({ onRetry }: NotFoundScreenProps) {
  return (
    <ScreenShell>
      <BadgeRing tone="error">
        <span className="text-3xl leading-none">×</span>
      </BadgeRing>
      <h1 className="mt-6 font-display text-3xl font-semibold text-parchment-50">Name Not Found</h1>
      <p className="mt-2 text-parchment-200/80">This participant is not on the authorized list.</p>
      <button
        onClick={onRetry}
        className="mt-10 w-full rounded-md border border-gilt-500 py-4 text-base font-semibold text-gilt-400 transition-colors hover:bg-ink-900 active:scale-[0.99]"
      >
        Try Again
      </button>
    </ScreenShell>
  );
}

interface AlreadyCheckedInScreenProps {
  name: string;
  time: string;
  onBack: () => void;
}

export function AlreadyCheckedInScreen({ name, time, onBack }: AlreadyCheckedInScreenProps) {
  return (
    <ScreenShell>
      <BadgeRing tone="warn">
        <span className="text-3xl font-display leading-none">!</span>
      </BadgeRing>
      <h1 className="mt-6 font-display text-3xl font-semibold text-parchment-50">Already Checked In</h1>
      <p className="mt-2 text-parchment-200/80">{name} has already been checked in.</p>
      <div className="mt-8 rounded-md border border-ink-700 bg-ink-900 px-6 py-4">
        <p className="text-xs uppercase tracking-widest text-ink-600">Check-in time</p>
        <p className="mt-1 font-display text-2xl text-gilt-400">{time}</p>
      </div>
      <button
        onClick={onBack}
        className="mt-10 w-full rounded-md border border-ink-600 py-4 text-base font-semibold text-parchment-100 transition-colors hover:bg-ink-900 active:scale-[0.99]"
      >
        Back
      </button>
    </ScreenShell>
  );
}
