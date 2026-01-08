import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DailyResult } from '../types';
import { CommentThread } from './CommentThread';
import { CommentList } from './CommentList';

interface DailyResultsProps {
  results: DailyResult[];
  currentUser: string;
}

export function DailyResults({ results, currentUser }: DailyResultsProps) {
  const [selectedComment, setSelectedComment] = useState<{ date: string; player: string } | null>(null);

  const formatScore = (score: number | null) => {
    if (score === null) return '-';
    if (score === 7) return 'X/6';
    return `${score}/6`;
  };

  const handleScoreClick = (date: string, player: string) => {
    setSelectedComment({ date, player });
  };

  return (
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
                  <tr key={result.date} className="border-b border-[#d3d6da]">
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-[#1a1a1b] text-xs sm:text-sm whitespace-nowrap">
                      {new Date(result.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td
                      className={`py-2 sm:py-3 px-2 sm:px-3 text-center text-base sm:text-lg font-bold cursor-pointer hover:bg-gray-50 transition-colors relative ${
                        result.winner !== null && result.winner === 'Katie' ? 'text-[#6aaa64]' : 'text-[#787c7e]'
                      }`}
                      onClick={() => handleScoreClick(result.date, 'Katie')}
                    >
                      {formatScore(result.katieScore)}
                      <div className="absolute top-1 right-1">
                        <CommentThread
                          resultDate={result.date}
                          player="Katie"
                          onClick={() => handleScoreClick(result.date, 'Katie')}
                        />
                      </div>
                    </td>
                    <td
                      className={`py-2 sm:py-3 px-2 sm:px-3 text-center text-base sm:text-lg font-bold cursor-pointer hover:bg-gray-50 transition-colors relative ${
                        result.winner !== null && result.winner === 'Stacy' ? 'text-[#6aaa64]' : 'text-[#787c7e]'
                      }`}
                      onClick={() => handleScoreClick(result.date, 'Stacy')}
                    >
                      {formatScore(result.stacyScore)}
                      <div className="absolute top-1 right-1">
                        <CommentThread
                          resultDate={result.date}
                          player="Stacy"
                          onClick={() => handleScoreClick(result.date, 'Stacy')}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedComment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
          onClick={() => setSelectedComment(null)}
        >
          <div
            className="bg-white border-2 border-[#d3d6da] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b-2 border-[#d3d6da] p-4">
              <h3 className="text-lg font-bold text-[#1a1a1b]">
                {selectedComment.player}'s Score
              </h3>
              <div className="text-sm text-[#878a8c]">
                {new Date(selectedComment.date + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <CommentList
              resultDate={selectedComment.date}
              playerName={selectedComment.player}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
