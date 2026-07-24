export type Profile = {
  id: string;
  display_name: string;
  vault_id: string | null;
  created_at: string;
};

export type Vault = {
  id: string;
  pair_code: string;
  partner_a_id: string | null;
  partner_b_id: string | null;
  created_at: string;
};

export type Game = {
  id: string;
  title: string;
  description: string;
  intensity_level: number;
  is_custom: boolean;
  author_id: string | null;
  vault_id: string | null;
  created_at: string;
};

export type Prompt = {
  id: string;
  game_id: string;
  text: string;
  target: 'a' | 'b' | 'both';
  order_index: number;
  created_at: string;
};

export type Session = {
  id: string;
  vault_id: string;
  game_id: string;
  current_index: number;
  current_state: Record<string, unknown>;
  status: 'active' | 'completed' | 'abandoned';
  last_updated: string;
  created_at: string;
};

export type Media = {
  id: string;
  vault_id: string;
  storage_path: string;
  url: string;
  content_type: string;
  created_at: string;
};

export const INTENSITY_LABELS: Record<number, string> = {
  1: 'Gentle',
  2: 'Playful',
  3: 'Spicy',
  4: 'Intense',
  5: 'Extreme',
};

export const INTENSITY_COLORS: Record<number, string> = {
  1: 'text-success',
  2: 'text-success',
  3: 'text-warning',
  4: 'text-error',
  5: 'text-error',
};

export const TARGET_LABELS: Record<string, string> = {
  a: 'Partner A',
  b: 'Partner B',
  both: 'Both',
};