/*
  # Add email support to players table

  1. Changes
    - Add `email` column to `players` table (unique, optional)
    - Players can now be identified by either phone or email
  
  2. Notes
    - Existing phone-based players remain unchanged
    - Email is optional to maintain backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'email'
  ) THEN
    ALTER TABLE players ADD COLUMN email text UNIQUE;
  END IF;
END $$;
