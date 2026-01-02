/*
  # Create Wordle Score Tracker Schema

  ## Overview
  Creates a system to track daily Wordle scores between two players.

  ## New Tables
  
  ### `wordle_games`
  - `id` (uuid, primary key) - Unique identifier for each game entry
  - `player_name` (text, not null) - Player name (e.g., "You" or "Katie")
  - `puzzle_number` (integer, not null) - The Wordle puzzle number (e.g., 1234)
  - `guesses` (integer, not null) - Number of guesses taken (1-6), or 7 for failed attempts
  - `game_date` (date, not null) - The date the puzzle was played
  - `share_text` (text) - Optional full share text from NY Times
  - `created_at` (timestamptz, default now()) - When the score was submitted
  
  ## Indexes
  - Index on `game_date` for quick date-based queries
  - Index on `puzzle_number` for quick puzzle lookups
  - Unique constraint on (player_name, puzzle_number) to prevent duplicate entries
  
  ## Security
  - Enable RLS on `wordle_games` table
  - Add policy allowing all operations (since this is a private app for two users)
  
  ## Notes
  - Failed attempts (shown as X/6 in Wordle) are stored as 7 guesses
  - The app will compare guesses between players - lower is better
*/

CREATE TABLE IF NOT EXISTS wordle_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  puzzle_number integer NOT NULL,
  guesses integer NOT NULL CHECK (guesses >= 1 AND guesses <= 7),
  game_date date NOT NULL,
  share_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_name, puzzle_number)
);

CREATE INDEX IF NOT EXISTS idx_wordle_games_date ON wordle_games(game_date);
CREATE INDEX IF NOT EXISTS idx_wordle_games_puzzle ON wordle_games(puzzle_number);

ALTER TABLE wordle_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on wordle_games"
  ON wordle_games
  FOR ALL
  USING (true)
  WITH CHECK (true);