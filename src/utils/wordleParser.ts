export interface ParsedWordle {
  puzzleNumber: number;
  guesses: number;
  shareText: string;
}

export function parseWordleShare(text: string): ParsedWordle | null {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return null;

  const firstLine = lines[0];
  const wordleRegex = /Wordle\s+([\d,]+)\s+([X\d])\/6/i;
  const match = firstLine.match(wordleRegex);

  if (!match) return null;

  const puzzleNumber = parseInt(match[1].replace(/,/g, ''));
  const guessesStr = match[2];
  const guesses = guessesStr === 'X' ? 7 : parseInt(guessesStr);

  return {
    puzzleNumber,
    guesses,
    shareText: text,
  };
}
