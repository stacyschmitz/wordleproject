import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { ScoreSubmitForm } from './components/ScoreSubmitForm';
import { DailyResults } from './components/DailyResults';
import { Leaderboard } from './components/Leaderboard';
import { PlayerSetup } from './components/PlayerSetup';
import { FAQ } from './components/FAQ';
import { DailyResult, PlayerStats, WordleGame } from './types';

function App() {
  const [dailyResults, setDailyResults] = useState<DailyResult[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    const { data: games } = await supabase
      .from('wordle_games')
      .select('*')
      .order('game_date', { ascending: false });

    if (games) {
      const resultsMap = new Map<string, DailyResult>();

      games.forEach((game: WordleGame) => {
        const key = `${game.game_date}-${game.puzzle_number}`;
        if (!resultsMap.has(key)) {
          resultsMap.set(key, {
            date: game.game_date,
            puzzle_number: game.puzzle_number,
            stacyScore: null,
            katieScore: null,
            winner: null,
          });
        }

        const result = resultsMap.get(key)!;
        if (game.player_name.toLowerCase() === 'katie') {
          result.katieScore = game.guesses;
        } else if (game.player_name.toLowerCase() === 'stacy') {
          result.stacyScore = game.guesses;
        }
      });

      const results = Array.from(resultsMap.values())
        .map((result) => {
          if (result.stacyScore !== null && result.katieScore !== null) {
            if (result.stacyScore < result.katieScore) {
              result.winner = 'Stacy';
            } else if (result.katieScore < result.stacyScore) {
              result.winner = 'Katie';
            } else {
              result.winner = 'Tie';
            }
          } else {
            result.winner = null;
          }
          return result;
        });

      setDailyResults(results);

      const playerStatsMap = new Map<string, { games: number[]; wins: number }>();

      results.forEach((result) => {
        ['Stacy', 'Katie'].forEach((player) => {
          if (!playerStatsMap.has(player)) {
            playerStatsMap.set(player, { games: [], wins: 0 });
          }
          const stats = playerStatsMap.get(player)!;

          const score = player === 'Stacy' ? result.stacyScore : result.katieScore;
          if (score !== null && score <= 6) {
            stats.games.push(score);
          }

          if (result.winner === player && result.stacyScore !== null && result.katieScore !== null) {
            stats.wins++;
          }
        });
      });

      const playerStats: PlayerStats[] = Array.from(playerStatsMap.entries()).map(
        ([name, data]) => {
          const totalGames = data.games.length;
          const avgGuesses = totalGames > 0
            ? data.games.reduce((a, b) => a + b, 0) / totalGames
            : 0;
          const winRate = totalGames > 0 ? (data.wins / totalGames) * 100 : 0;

          return {
            player_name: name,
            total_games: totalGames,
            total_wins: data.wins,
            avg_guesses: avgGuesses,
            win_rate: winRate,
          };
        }
      );

      setStats(playerStats);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [showSetup, setShowSetup] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="grid grid-cols-3 gap-[2px] w-12 h-12 sm:w-16 sm:h-16">
              <div className="bg-[#6aaa64] rounded-sm"></div>
              <div className="bg-[#c9b458] rounded-sm"></div>
              <div className="bg-[#787c7e] rounded-sm"></div>
              <div className="bg-[#787c7e] rounded-sm"></div>
              <div className="bg-[#6aaa64] rounded-sm"></div>
              <div className="bg-[#c9b458] rounded-sm"></div>
              <div className="bg-[#c9b458] rounded-sm"></div>
              <div className="bg-[#787c7e] rounded-sm"></div>
              <div className="bg-[#6aaa64] rounded-sm"></div>
            </div>
          </div>

            <h1 className="text-xl sm:text-3xl font-bold text-[#1a1a1b] mb-4 sm:mb-6 tracking-tight px-2">
              Schmitz Sister Wordle Leaderboard
            </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex gap-0.5 sm:gap-1">
              {['I', 'D', 'E', 'A', 'L'].map((letter, i) => (
                <div key={i} className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-[#d3d6da] flex items-center justify-center">
                  <span className="text-base sm:text-2xl font-bold text-[#1a1a1b]">{letter}</span>
                </div>
              ))}
            </div>
            <span className="text-lg sm:text-2xl font-bold text-[#878a8c]">vs.</span>
            <div className="flex gap-0.5 sm:gap-1">
              {['H', 'E', 'A', 'R', 'T'].map((letter, i) => (
                <div key={i} className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-[#d3d6da] flex items-center justify-center">
                  <span className="text-base sm:text-2xl font-bold text-[#1a1a1b]">{letter}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#878a8c]">No Cheating!</p>
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#6aaa64]"></div>
            <p className="mt-4 text-gray-600">Loading scores...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Leaderboard results={dailyResults} />
            <DailyResults results={dailyResults} />
          </div>
        )}

        <footer className="mt-12 text-center pb-4 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setShowFAQ(!showFAQ);
                setShowSetup(false);
              }}
              className="text-xs text-[#878a8c] hover:text-[#1a1a1b] underline font-bold"
            >
              How to Use
            </button>
            <span className="text-[#d3d6da]">|</span>
            <button
              onClick={() => {
                setShowSetup(!showSetup);
                setShowFAQ(false);
              }}
              className="text-xs text-[#878a8c] hover:text-[#1a1a1b] underline"
            >
              Admin
            </button>
          </div>

          {showFAQ && (
            <div className="mt-6">
              <FAQ />
            </div>
          )}

          {showSetup && (
            <div className="mt-6 space-y-6 max-w-md mx-auto text-left">
              <div className="bg-[#f6f7f8] border border-[#d3d6da] rounded-lg p-4">
                <h4 className="font-bold text-[#1a1a1b] mb-4">Admin Setup</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-bold text-[#1a1a1b] mb-2">Register Players</h5>
                    <PlayerSetup />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#1a1a1b] mb-2">Manual Score Entry</h5>
                    <ScoreSubmitForm onSubmitSuccess={fetchData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

export default App;
