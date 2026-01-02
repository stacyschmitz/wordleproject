import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyResult } from '../types';
import { RoomProvider } from '../lib/liveblocks';
import { CommentsSection } from './CommentsSection';
import { useState } from 'react';

interface DailyResultsProps {
  results: DailyResult[];
}

export function DailyResults({ results }: DailyResultsProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const formatScore = (score: number | null) => {
    if (score === null) return '-';
    if (score === 7) return 'X/6';
    return `${score}/6`;
  };

  const toggleExpanded = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="bg-white border-2 border-[#d3d6da] rounded p-4 sm:p-6">
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
                  <>
                    <tr
                      key={result.date}
                      className="border-b border-[#d3d6da] hover:bg-[#f6f7f8] cursor-pointer transition-colors"
                      onClick={() => toggleExpanded(result.date)}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-[#1a1a1b] text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {expandedDate === result.date ? (
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#878a8c]" />
                          ) : (
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#878a8c]" />
                          )}
                          <span>
                            {new Date(result.date + 'T00:00:00').toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
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
                    {expandedDate === result.date && (
                      <tr key={`${result.date}-comments`}>
                        <td colSpan={3} className="px-2 sm:px-4 py-3 bg-[#f6f7f8]">
                          <RoomProvider
                            id={`puzzle-${result.puzzle_number}`}
                            initialPresence={{ cursor: null }}
                          >
                            <CommentsSection result={result} />
                          </RoomProvider>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
