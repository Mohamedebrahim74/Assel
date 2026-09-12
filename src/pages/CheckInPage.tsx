import { useState } from 'react';
import { Logo } from '../components/Logo';
import { NameAutocomplete } from '../components/NameAutocomplete';
import { SuccessScreen, NotFoundScreen, AlreadyCheckedInScreen } from '../components/StatusScreens';
import { useCheckIn } from '../hooks/useCheckIn';
import type { CheckInResult, Participant } from '../types';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function CheckInPage() {
  const { loading, search, checkIn } = useCheckIn();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Participant | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = () => {
    setQuery('');
    setSelected(null);
    setResult(null);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const name = selected?.name ?? query;
    if (!name.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const outcome = await checkIn(name);
      setResult(outcome);
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.status === 'success') {
    return (
      <SuccessScreen
        name={result.participant.name}
        time={formatTime(result.checkedInAt)}
        onDone={reset}
      />
    );
  }

  if (result?.status === 'already-checked-in') {
    return (
      <AlreadyCheckedInScreen
        name={result.participant.name}
        time={formatTime(result.checkedInAt)}
        onBack={reset}
      />
    );
  }

  if (result?.status === 'not-found') {
    return <NotFoundScreen onRetry={reset} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 font-display text-xl font-semibold tracking-wide text-parchment-50">
            Convocation Ceremony
          </h1>
          <div className="rule mt-4 w-24" />
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl text-parchment-50">Check-In</h2>
          <p className="mt-1 text-sm text-parchment-200/70">What's your name?</p>

          <div className="mt-5">
            <NameAutocomplete
              value={selected ? selected.name : query}
              onChange={(v) => {
                setSelected(null);
                setQuery(v);
              }}
              onSelect={(p) => {
                setSelected(p);
                setQuery(p.name);
              }}
              search={search}
              disabled={loading || submitting}
            />
          </div>

          {errorMessage && <p className="mt-3 text-sm text-signal-error">{errorMessage}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting || loading || !(selected ?? query).toString().trim()}
            className="mt-6 w-full rounded-md bg-gilt-500 py-4 text-base font-semibold text-ink-950 transition-colors hover:bg-gilt-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Checking in…' : 'Check In'}
          </button>

          {loading && <p className="mt-4 text-center text-xs text-ink-600">Loading participant list…</p>}
        </div>
      </div>
    </div>
  );
}
