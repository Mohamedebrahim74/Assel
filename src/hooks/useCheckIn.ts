import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CheckInResult, Participant } from '../types';

/**
 * Loads the authorized participant list once (16 names — cheap to hold in
 * memory) so the autocomplete feels instant, and exposes a checkIn() action
 * that relies on the database's unique constraint — not just client logic —
 * to prevent duplicate check-ins.
 */
export function useCheckIn() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadParticipants() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('participants')
        .select('id, name, created_at')
        .order('name', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setParticipants(data ?? []);
      }
      setLoading(false);
    }

    loadParticipants();
    return () => {
      cancelled = true;
    };
  }, []);

  const search = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return participants
        .filter((p) => p.name.toLowerCase().includes(q))
        .slice(0, 8);
    },
    [participants]
  );

  const findByName = useCallback(
    (name: string) => {
      const target = name.trim().toLowerCase();
      return participants.find((p) => p.name.toLowerCase() === target) ?? null;
    },
    [participants]
  );

  const checkIn = useCallback(async (name: string): Promise<CheckInResult> => {
    const participant = findByName(name);
    if (!participant) {
      return { status: 'not-found' };
    }

    // Try to insert the check-in. The database has a UNIQUE constraint on
    // participant_id, so a second attempt fails with a Postgres 23505
    // (unique_violation) error rather than silently succeeding.
    const { data: inserted, error: insertError } = await supabase
      .from('check_ins')
      .insert({ participant_id: participant.id })
      .select('checked_in_at')
      .single();

    if (!insertError && inserted) {
      return {
        status: 'success',
        participant,
        checkedInAt: inserted.checked_in_at,
      };
    }

    // 23505 = unique_violation → already checked in. Fetch the original
    // check-in time so we never overwrite it.
    if (insertError?.code === '23505') {
      const { data: existing } = await supabase
        .from('check_ins')
        .select('checked_in_at')
        .eq('participant_id', participant.id)
        .single();

      return {
        status: 'already-checked-in',
        participant,
        checkedInAt: existing?.checked_in_at ?? new Date().toISOString(),
      };
    }

    throw insertError;
  }, [findByName]);

  return { participants, loading, error, search, checkIn };
}
