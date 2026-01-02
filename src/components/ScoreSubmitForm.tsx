import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { parseWordleShare } from '../utils/wordleParser';

interface ScoreSubmitFormProps {
  onSubmitSuccess: () => void;
}

export function ScoreSubmitForm({ onSubmitSuccess }: ScoreSubmitFormProps) {
  const [shareText, setShareText] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    const parsed = parseWordleShare(shareText);
    if (!parsed) {
      setError('Invalid Wordle share format. Please paste the text from the Wordle share button.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const gameDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const { error: dbError } = await supabase.from('wordle_games').insert({
        player_name: playerName.trim(),
        puzzle_number: parsed.puzzleNumber,
        guesses: parsed.guesses,
        game_date: gameDate,
        share_text: parsed.shareText,
      });

      if (dbError) {
        if (dbError.code === '23505') {
          setError('You already submitted this puzzle!');
        } else {
          setError('Failed to save score. Please try again.');
        }
      } else {
        setSuccess('Score submitted successfully!');
        setShareText('');
        onSubmitSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Submit Your Score</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name (e.g., You or Katie)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="shareText" className="block text-sm font-medium text-gray-700 mb-1">
            Paste Wordle Share Text
          </label>
          <textarea
            id="shareText"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            placeholder="Paste your Wordle result here (e.g., Wordle 1,234 4/6)"
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Score'}
        </button>
      </form>
    </div>
  );
}
