import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ParticipantWithStatus } from '../types';

export function useDashboard() {
  const [participants, setParticipants] = useState<ParticipantWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('participants')
      .select('id, name, created_at, check_ins(checked_in_at)')
      .order('name', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows: ParticipantWithStatus[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      created_at: row.created_at,
      checked_in_at: row.check_ins?.[0]?.checked_in_at ?? null,
    }));

    setParticipants(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    // Live-update the dashboard whenever a check-in happens on any device.
    const channel = supabase
      .channel('check-ins-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'check_ins' },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const totalParticipants = participants.length;
  const checkedIn = participants.filter((p) => p.checked_in_at).length;
  const remaining = totalParticipants - checkedIn;
  const progress = totalParticipants === 0 ? 0 : Math.round((checkedIn / totalParticipants) * 100);

  return {
    participants,
    loading,
    error,
    refresh: load,
    stats: { totalParticipants, checkedIn, remaining, progress },
  };
}
