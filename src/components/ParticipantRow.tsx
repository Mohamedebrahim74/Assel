import { Check } from 'lucide-react';
import type { ParticipantWithStatus } from '../types';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function ParticipantRow({ participant }: { participant: ParticipantWithStatus }) {
  const checkedIn = !!participant.checked_in_at;
  return (
    <div className="flex items-center justify-between border-b border-ink-800 px-1 py-3 last:border-0">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            checkedIn ? 'border-signal-success bg-signal-success/10 text-signal-success' : 'border-ink-600 text-ink-600'
          }`}
        >
          {checkedIn ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
        </span>
        <span className="text-parchment-100">{participant.name}</span>
      </div>
      <span className={`text-sm ${checkedIn ? 'text-gilt-400' : 'text-ink-600'}`}>
        {checkedIn ? formatTime(participant.checked_in_at!) : 'Not checked in'}
      </span>
    </div>
  );
}
