/*
  # Create Players Table

  ## Overview
  Stores player information including phone numbers for automatic identification.

  ## New Tables
  
  ### `players`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, not null, unique) - Player name (e.g., "You" or "Katie")
  - `phone_number` (text, unique) - Phone number for identification
  - `created_at` (timestamptz, default now()) - When the player was added
  
  ## Security
  - Enable RLS on `players` table
  - Add policy allowing all operations (private app for two users)
  
  ## Initial Data
  - Insert placeholder entries for both players (phone numbers to be updated)
*/

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  phone_number text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on players"
  ON players
  FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO players (name, phone_number) VALUES 
  ('You', NULL),
  ('Katie', NULL)
ON CONFLICT (name) DO NOTHING;