export interface WordleGame {
  id: string;
  player_name: string;
  puzzle_number: number;
  guesses: number;
  game_date: string;
  share_text: string | null;
  created_at: string;
}

export interface DailyResult {
  date: string;
  puzzle_number: number;
  stacyScore: number | null;
  katieScore: number | null;
  winner: string | null;
}

export interface PlayerStats {
  player_name: string;
  total_games: number;
  total_wins: number;
  avg_guesses: number;
  win_rate: number;
}
