import { Trophy } from 'lucide-react';
import { useState, useMemo } from 'react';
import { DailyResult } from '../types';

interface LeaderboardProps {
  results: DailyResult[];
}

type DateFilter = 'all' | 'ytd' | 'this-month' | 'last-month';

export function Leaderboard({ results }: LeaderboardProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredResults = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return results.filter((result) => {
      const resultDate = new Date(result.date);

      switch (dateFilter) {
        case 'ytd':
          return resultDate.getFullYear() === currentYear;
        case 'this-month':
          return resultDate.getFullYear() === currentYear && resultDate.getMonth() === currentMonth;
        case 'last-month':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return resultDate.getFullYear() === lastMonthYear && resultDate.getMonth() === lastMonth;
        default:
          return true;
      }
    });
  }, [results, dateFilter]);

  const { katieWins, stacyWins } = useMemo(() => {
    let katie = 0;
    let stacy = 0;

    filteredResults.forEach((result) => {
      if (result.katieScore !== null && result.stacyScore !== null) {
        if (result.winner === 'Katie') katie++;
        if (result.winner === 'Stacy') stacy++;
      }
    });

    return { katieWins: katie, stacyWins: stacy };
  }, [filteredResults]);

  const maxWins = Math.max(katieWins, stacyWins) || 1;
  const katieColor = katieWins > stacyWins ? '#6aaa64' : '#c9b458';
  const stacyColor = stacyWins > katieWins ? '#6aaa64' : '#c9b458';

  return (
    <div className="bg-white border-2 border-[#d3d6da] rounded p-4 sm:p-6">
      <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a1a1b]" />
        <h2 className="text-base sm:text-lg font-bold text-[#1a1a1b] tracking-tight">
          Win Tracker
        </h2>
      </div>

      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 flex-wrap px-2">
        <button
          onClick={() => setDateFilter('all')}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded transition-colors ${
            dateFilter === 'all'
              ? 'bg-[#1a1a1b] text-white'
              : 'bg-white text-[#878a8c] border border-[#d3d6da] hover:border-[#878a8c]'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setDateFilter('ytd')}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded transition-colors ${
            dateFilter === 'ytd'
              ? 'bg-[#1a1a1b] text-white'
              : 'bg-white text-[#878a8c] border border-[#d3d6da] hover:border-[#878a8c]'
          }`}
        >
          YTD
        </button>
        <button
          onClick={() => setDateFilter('this-month')}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded transition-colors ${
            dateFilter === 'this-month'
              ? 'bg-[#1a1a1b] text-white'
              : 'bg-white text-[#878a8c] border border-[#d3d6da] hover:border-[#878a8c]'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setDateFilter('last-month')}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded transition-colors ${
            dateFilter === 'last-month'
              ? 'bg-[#1a1a1b] text-white'
              : 'bg-white text-[#878a8c] border border-[#d3d6da] hover:border-[#878a8c]'
          }`}
        >
          Last Month
        </button>
      </div>

      {filteredResults.length === 0 ? (
        <p className="text-[#878a8c] text-center py-8 text-sm">No battles yet</p>
      ) : (
        <div className="flex items-end justify-center gap-6 sm:gap-12 h-48 sm:h-64">
          <div className="flex flex-col items-center gap-2 sm:gap-3 w-20 sm:w-32">
            <div className="relative w-full">
              <div
                className="w-full rounded transition-all duration-500 flex items-end justify-center pb-2 sm:pb-3"
                style={{
                  height: `${(katieWins / maxWins) * 150}px`,
                  minHeight: katieWins > 0 ? '40px' : '0px',
                  backgroundColor: katieColor
                }}
              >
                <span className="text-lg sm:text-2xl font-bold text-white">{katieWins}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-lg font-bold text-[#1a1a1b]">Katie</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 sm:gap-3 w-20 sm:w-32">
            <div className="relative w-full">
              <div
                className="w-full rounded transition-all duration-500 flex items-end justify-center pb-2 sm:pb-3"
                style={{
                  height: `${(stacyWins / maxWins) * 150}px`,
                  minHeight: stacyWins > 0 ? '40px' : '0px',
                  backgroundColor: stacyColor
                }}
              >
                <span className="text-lg sm:text-2xl font-bold text-white">{stacyWins}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-lg font-bold text-[#1a1a1b]">Stacy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
