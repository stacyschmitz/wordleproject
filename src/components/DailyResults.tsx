import { Calendar } from 'lucide-react';
import { DailyResult } from '../types';
import { RoomProvider } from '../lib/liveblocks';
import { OverlayComments } from './OverlayComments';
import { Suspense } from 'react';

interface DailyResultsProps {
  results: DailyResult[];
}

export function DailyResults({ results }: DailyResultsProps) {
  const formatScore = (score: number | null) => {
    if (score === null) return '-';
    if (score === 7) return 'X/6';
    return `${score}/6`;
  };

  return (
    <RoomProvider
      id="daily-results"
      initialPresence={{ cursor: null }}
    >
      <div className="bg-white border-2 border-[#d3d6da] rounded p-4 sm:p-6 relative">
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a1a1b]" />
          <h2 className="text-base sm:text-lg font-bold text-[#1a1a1b] tracking-tight">
            Daily Results
          </h2>
        </div>

        {results.length === 0 ? (
          <p className="text-[#878a8c] text-center py-8 text-sm">No battles yet</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#d3d6da]">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-3 text-[#1a1a1b] font-bold text-xs sm:text-sm">Date</th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-3 text-[#1a1a1b] font-bold text-xs sm:text-sm">Katie</th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-3 text-[#1a1a1b] font-bold text-xs sm:text-sm">Stacy</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.date}
                      className="border-b border-[#d3d6da] hover:bg-[#f6f7f8] transition-colors"
                      data-liveblocks-selectable
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-[#1a1a1b] text-xs sm:text-sm whitespace-nowrap">
                        {new Date(result.date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-3 text-center text-base sm:text-lg font-bold ${
                        result.winner !== null && result.winner === 'Katie' ? 'text-[#6aaa64]' : 'text-[#787c7e]'
                      }`}>
                        {formatScore(result.katieScore)}
                      </td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-3 text-center text-base sm:text-lg font-bold ${
                        result.winner !== null && result.winner === 'Stacy' ? 'text-[#6aaa64]' : 'text-[#787c7e]'
                      }`}>
                        {formatScore(result.stacyScore)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Suspense fallback={null}>
          <OverlayComments />
        </Suspense>
      </div>
    </RoomProvider>
  );
}
