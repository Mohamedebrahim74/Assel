import { useEffect, useRef, useState } from 'react';
import { Search, User } from 'lucide-react';
import type { Participant } from '../types';

interface NameAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (participant: Participant) => void;
  search: (query: string) => Participant[];
  disabled?: boolean;
}

export function NameAutocomplete({ value, onChange, onSelect, search, disabled }: NameAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = search(value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = results[highlighted];
      if (pick) {
        onSelect(pick);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-3 rounded-md border border-ink-600 bg-ink-900 px-4 py-4 shadow-ring focus-within:border-gilt-400 transition-colors">
        <Search className="h-5 w-5 shrink-0 text-gilt-400" aria-hidden />
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="words"
          disabled={disabled}
          placeholder="Start typing a name…"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHighlighted(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-lg text-parchment-50 placeholder:text-ink-600 outline-none disabled:opacity-50"
        />
      </div>

      {open && value.trim().length > 0 && (
        <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border border-ink-600 bg-ink-900 shadow-card">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-600">No matching participant</li>
          ) : (
            results.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-parchment-100 transition-colors ${
                    i === highlighted ? 'bg-ink-800' : 'hover:bg-ink-800'
                  }`}
                >
                  <User className="h-4 w-4 text-gilt-400" aria-hidden />
                  <span>{p.name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
