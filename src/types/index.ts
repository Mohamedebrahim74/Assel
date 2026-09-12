export interface Participant {
  id: string;
  name: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  participant_id: string;
  checked_in_at: string;
}

export interface ParticipantWithStatus extends Participant {
  checked_in_at: string | null;
}

export type CheckInResult =
  | { status: 'success'; participant: Participant; checkedInAt: string }
  | { status: 'already-checked-in'; participant: Participant; checkedInAt: string }
  | { status: 'not-found' };
