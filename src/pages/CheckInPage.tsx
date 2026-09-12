import { useState, useEffect } from 'react';
import { Camera, Users, CheckCircle, Clock } from 'lucide-react';
import { Logo } from '../components/Logo';
import { QrScanner } from '../components/QrScanner';
import { ParticipantSelector } from '../components/ParticipantSelector';
import { InvalidQrScreen } from '../components/InvalidQrScreen';
import { SuccessScreen, AlreadyCheckedInScreen } from '../components/StatusScreens';
import { useCheckIn } from '../hooks/useCheckIn';
import { useDashboard } from '../hooks/useDashboard';
import { EVENT_QR_TOKEN } from '../lib/qrConfig';
import type { CheckInResult, Participant } from '../types';

type FlowState =
  | 'idle'
  | 'scanning'
  | 'verified'
  | 'selecting'
  | 'checking-in'
  | 'success'
  | 'already-checked-in'
  | 'invalid-qr'
  | 'error';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function CheckInPage() {
  const { participants, loading, search, checkIn } = useCheckIn();
  const { stats } = useDashboard();
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // After QR is verified, show the ✓ VERIFIED message briefly then move to selecting
  useEffect(() => {
    if (flowState === 'verified') {
      const timer = setTimeout(() => setFlowState('selecting'), 1200);
      return () => clearTimeout(timer);
    }
  }, [flowState]);

  const reset = () => {
    setFlowState('idle');
    setResult(null);
    setSubmitting(false);
  };

  const handleScan = (decodedText: string) => {
    if (decodedText === EVENT_QR_TOKEN) {
      setFlowState('verified');
    } else {
      setFlowState('invalid-qr');
    }
  };

  const handleSelectParticipant = async (participant: Participant) => {
    setSubmitting(true);
    setFlowState('checking-in');
    try {
      const outcome = await checkIn(participant.name);
      setResult(outcome);
      if (outcome.status === 'success') {
        setFlowState('success');
      } else if (outcome.status === 'already-checked-in') {
        setFlowState('already-checked-in');
      } else {
        setFlowState('error');
      }
    } catch {
      setFlowState('error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── SCANNING ──────────────────────────────────────────────────────────
  if (flowState === 'scanning') {
    return (
      <QrScanner
        onScan={handleScan}
        onClose={() => setFlowState('idle')}
      />
    );
  }

  // ── VERIFIED (brief flash) ────────────────────────────────────────────
  if (flowState === 'verified') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-full max-w-sm animate-fadeUp">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-signal-success text-signal-success animate-ringPop">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-parchment-50">
            Verified
          </h1>
          <p className="mt-2 text-parchment-200/70">QR code validated successfully</p>
        </div>
      </div>
    );
  }

  // ── SELECTING PARTICIPANT ─────────────────────────────────────────────
  if (flowState === 'selecting' || flowState === 'checking-in') {
    return (
      <ParticipantSelector
        participants={participants}
        search={search}
        onSelect={handleSelectParticipant}
        onBack={reset}
        submitting={submitting}
      />
    );
  }

  // ── INVALID QR ────────────────────────────────────────────────────────
  if (flowState === 'invalid-qr') {
    return <InvalidQrScreen onScanAgain={() => setFlowState('scanning')} />;
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────
  if (flowState === 'success' && result?.status === 'success') {
    return (
      <SuccessScreen
        name={result.participant.name}
        time={formatTime(result.checkedInAt)}
        onDone={reset}
      />
    );
  }

  // ── ALREADY CHECKED IN ────────────────────────────────────────────────
  if (flowState === 'already-checked-in' && result?.status === 'already-checked-in') {
    return (
      <AlreadyCheckedInScreen
        name={result.participant.name}
        time={formatTime(result.checkedInAt)}
        onBack={reset}
      />
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────
  if (flowState === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-full max-w-sm animate-fadeUp">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-signal-error text-signal-error animate-ringPop">
            <span className="text-3xl leading-none">×</span>
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-parchment-50">
            Something Went Wrong
          </h1>
          <p className="mt-2 text-parchment-200/80">Please try again.</p>
          <button
            onClick={reset}
            className="mt-10 w-full rounded-md bg-gilt-500 py-4 text-base font-semibold text-ink-950 transition-colors hover:bg-gilt-400 active:scale-[0.99]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── IDLE (main screen) ────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-10">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 font-display text-xl font-semibold tracking-wide text-parchment-50">
            CIC Convocation Ceremony
          </h1>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-gilt-400">
            Check-In
          </p>
          <div className="rule mt-4 w-24" />
        </div>

        {/* Scan QR button */}
        <div className="mt-12">
          <button
            onClick={() => setFlowState('scanning')}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-gilt-500 py-5 text-lg font-semibold text-ink-950 transition-colors hover:bg-gilt-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Camera className="h-6 w-6" />
            Scan QR
          </button>

          {loading && (
            <p className="mt-4 text-center text-xs text-ink-600">Loading participant list…</p>
          )}
        </div>

        {/* Stats summary */}
        <div className="mt-10">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-ink-700 bg-ink-900 px-4 py-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-ink-600">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-widest">Total</span>
              </div>
              <p className="mt-1 font-display text-2xl text-parchment-50">
                {stats.totalParticipants}
              </p>
            </div>
            <div className="rounded-md border border-ink-700 bg-ink-900 px-4 py-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-ink-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-widest">In</span>
              </div>
              <p className="mt-1 font-display text-2xl text-gilt-400">{stats.checkedIn}</p>
            </div>
            <div className="rounded-md border border-ink-700 bg-ink-900 px-4 py-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-ink-600">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-widest">Left</span>
              </div>
              <p className="mt-1 font-display text-2xl text-parchment-50">
                {stats.remaining}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
