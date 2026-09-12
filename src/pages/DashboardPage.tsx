import { useMemo, useState } from 'react';
import { LogOut, Search } from 'lucide-react';
import { Logo } from '../components/Logo';
import { StatCard, ProgressRing } from '../components/DashboardStats';
import { ParticipantRow } from '../components/ParticipantRow';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';

type Filter = 'all' | 'checked-in' | 'not-checked-in';

export function DashboardPage() {
  const { participants, loading, stats } = useDashboard();
  const { signOut } = useAuth();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(() => {
    let list = participants;

    if (filter === 'checked-in') list = list.filter((p) => p.checked_in_at);
    if (filter === 'not-checked-in') list = list.filter((p) => !p.checked_in_at);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      if (!!a.checked_in_at !== !!b.checked_in_at) {
        return a.checked_in_at ? -1 : 1; // checked-in first
      }
      if (a.checked_in_at && b.checked_in_at) {
        return new Date(b.checked_in_at).getTime() - new Date(a.checked_in_at).getTime(); // latest first
      }
      return a.name.localeCompare(b.name);
    });
  }, [participants, filter, query]);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div>
              <p className="font-display text-lg text-parchment-50">Convocation Ceremony</p>
              <p className="text-xs uppercase tracking-widest text-ink-600">Check-In Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-md border border-ink-700 px-3 py-2 text-sm text-parchment-200/80 transition-colors hover:bg-ink-900"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <StatCard label="Total Participants" value={stats.totalParticipants} />
          <StatCard label="Checked In" value={stats.checkedIn} accent />
          <StatCard label="Remaining" value={stats.remaining} />
        </div>

        <div className="mt-6 flex items-center justify-between rounded-md border border-ink-700 bg-ink-900 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-600">Progress</p>
            <p className="mt-1 text-sm text-parchment-200/70">
              {stats.checkedIn} of {stats.totalParticipants} checked in
            </p>
          </div>
          <ProgressRing progress={stats.progress} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-md border border-ink-600 bg-ink-900 px-4 py-3 sm:w-64">
            <Search className="h-4 w-4 text-gilt-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search participants…"
              className="w-full bg-transparent text-sm text-parchment-100 outline-none placeholder:text-ink-600"
            />
          </div>

          <div className="flex gap-2">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'checked-in', label: 'Checked In' },
                { key: 'not-checked-in', label: 'Not Checked In' },
              ] as { key: Filter; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  filter === f.key
                    ? 'bg-gilt-500 text-ink-950 font-medium'
                    : 'border border-ink-700 text-parchment-200/70 hover:bg-ink-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-ink-700 bg-ink-900 px-4">
          {loading ? (
            <p className="py-6 text-center text-sm text-ink-600">Loading participants…</p>
          ) : visible.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-600">No participants match this view.</p>
          ) : (
            visible.map((p) => <ParticipantRow key={p.id} participant={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
