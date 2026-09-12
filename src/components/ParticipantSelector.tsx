import { useState } from 'react';
import { Search, User, ChevronLeft } from 'lucide-react';
import type { Participant } from '../types';

interface ParticipantSelectorProps {
  participants: Participant[];
  search: (query: string) => Participant[];
  onSelect: (participant: Participant) => void;
  onBack: () => void;
  submitting: boolean;
}

export function ParticipantSelector({
  participants,
  search,
  onSelect,
  onBack,
  submitting,
}: ParticipantSelectorProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Participant | null>(null);

  // If query is empty, show all participants; otherwise show filtered results
  const visible = query.trim() ? search(query) : participants;

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-parchment-200/70 transition-colors hover:text-parchment-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <h2 className="mt-6 font-display text-2xl text-parchment-50">Choose Participant</h2>
        <p className="mt-1 text-sm text-parchment-200/70">
          Select the participant to check in
        </p>

        {/* Search bar */}
        <div className="mt-5 flex items-center gap-3 rounded-md border border-ink-600 bg-ink-900 px-4 py-3 shadow-ring transition-colors focus-within:border-gilt-400">
          <Search className="h-5 w-5 shrink-0 text-gilt-400" aria-hidden />
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="words"
            placeholder="Search participant…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            className="w-full bg-transparent text-base text-parchment-50 placeholder:text-ink-600 outline-none"
          />
        </div>

        {/* Participant list */}
        <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-md border border-ink-700 bg-ink-900">
          {visible.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-600">
              No matching participant
            </p>
          ) : (
            visible.map((p) => {
              const isSelected = selected?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center gap-3 border-b border-ink-800 px-4 py-4 text-left transition-colors last:border-0 ${
                    isSelected
                      ? 'bg-gilt-500/10 text-gilt-400'
                      : 'text-parchment-100 hover:bg-ink-800'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-gilt-400 bg-gilt-500/20 text-gilt-400'
                        : 'border-ink-600 text-ink-600'
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </span>
                  <span className={`text-base ${isSelected ? 'font-medium' : ''}`}>
                    {p.name}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-xs uppercase tracking-widest text-gilt-400">
                      Selected
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Selected participant & Check In button */}
        {selected && (
          <div className="mt-6 animate-fadeUp">
            <div className="rounded-md border border-ink-700 bg-ink-900 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-widest text-ink-600">Checking in</p>
              <p className="mt-1 font-display text-xl text-parchment-50">{selected.name}</p>
            </div>
            <button
              onClick={() => onSelect(selected)}
              disabled={submitting}
              className="mt-4 w-full rounded-md bg-gilt-500 py-4 text-base font-semibold text-ink-950 transition-colors hover:bg-gilt-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Checking in…' : 'Check In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
