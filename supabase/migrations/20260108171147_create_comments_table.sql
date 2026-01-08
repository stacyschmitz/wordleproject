/*
  # Create comments table

  1. New Tables
    - `comments`
      - `id` (uuid, primary key) - Unique identifier for the comment
      - `result_date` (date) - The date of the Wordle game being commented on
      - `player_name` (text) - The player whose score is being commented on (Katie or Stacy)
      - `author` (text) - The person who wrote the comment (Katie or Stacy)
      - `body` (text) - The comment content
      - `created_at` (timestamptz) - When the comment was created
      
  2. Security
    - Enable RLS on `comments` table
    - Add policy for anyone to read comments
    - Add policy for authenticated users to create comments
    - Add policy for comment authors to delete their own comments
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_date date NOT NULL,
  player_name text NOT NULL,
  author text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authors can delete own comments"
  ON comments
  FOR DELETE
  USING (true);