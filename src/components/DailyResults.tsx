import { useState, useCallback, Suspense } from 'react';
import { Calendar } from 'lucide-react';
import { DailyResult } from '../types';
import { CommentThread } from './CommentThread';
import { useCreateThread, Thread } from '../lib/liveblocks.config';
import { Composer } from '@liveblocks/react-ui';
import { useThreads } from '../lib/liveblocks.config';

interface DailyResultsProps {
  results: DailyResult[];
}

export function DailyResults({ results }: DailyResultsProps) {
  const [activeComposer, setActiveComposer] = useState<{ date: string; player: string } | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const createThread = useCreateThread();
  const { threads } = useThreads();

  const formatScore = (score: number | null) => {
    if (score === null) return '-';
    if (score === 7) return 'X/6';
    return `${score}/6`;
  };

  const handleScoreClick = useCallback((date: string, player: string) => {
    setActiveComposer({ date, player });
    setSelectedThread(null);
  }, []);

  const handleComposerSubmit = useCallback(async ({ body }: any) => {
    if (!activeComposer) return;

    await createThread({
      body,
      metadata: {
        resultDate: activeComposer.date,
        player: activeComposer.player,
        resolved: false,
      },
    });

    setActiveComposer(null);
  }, [activeComposer, createThread]);

  const getThreadsForCell = useCallback((date: string, player: string) => {
    return threads?.filter(thread => {
      const metadata = thread.metadata as any;
      return metadata?.resultDate === date && metadata?.player === player;
    }) || [];
  }, [threads]);

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
                {results.map((result) => {
                  const katieThreads = getThreadsForCell(result.date, 'Katie');
                  const stacyThreads = getThreadsForCell(result.date, 'Stacy');

                  return (
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
                        {katieThreads.length > 0 && (
                          <Suspense fallback={null}>
                            <div className="absolute top-1 right-1">
                              <CommentThread
                                resultDate={result.date}
                                player="Katie"
                                onClick={() => setSelectedThread(katieThreads[0]?.id || null)}
                              />
                            </div>
                          </Suspense>
                        )}
                      </td>
                      <td
                        className={`py-2 sm:py-3 px-2 sm:px-3 text-center text-base sm:text-lg font-bold cursor-pointer hover:bg-gray-50 transition-colors relative ${
                          result.winner !== null && result.winner === 'Stacy' ? 'text-[#6aaa64]' : 'text-[#787c7e]'
                        }`}
                        onClick={() => handleScoreClick(result.date, 'Stacy')}
                      >
                        {formatScore(result.stacyScore)}
                        {stacyThreads.length > 0 && (
                          <Suspense fallback={null}>
                            <div className="absolute top-1 right-1">
                              <CommentThread
                                resultDate={result.date}
                                player="Stacy"
                                onClick={() => setSelectedThread(stacyThreads[0]?.id || null)}
                              />
                            </div>
                          </Suspense>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeComposer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
          onClick={() => setActiveComposer(null)}
        >
          <div
            className="bg-white border-2 border-[#d3d6da] rounded-lg shadow-xl w-full max-w-md p-4 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#1a1a1b] mb-4">
              Comment on {activeComposer.player}'s score
            </h3>
            <div className="text-sm text-[#878a8c] mb-2">
              {new Date(activeComposer.date + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <Composer
              onComposerSubmit={handleComposerSubmit}
              onCancel={() => setActiveComposer(null)}
              autoFocus
            />
          </div>
        </div>
      )}

      {threads?.filter(t => {
        const metadata = t.metadata as any;
        return results.some(r => r.date === metadata?.resultDate);
      }).map((thread) => {
        const metadata = thread.metadata as any;
        const cellThreads = getThreadsForCell(metadata.resultDate, metadata.player);
        const threadIndex = cellThreads.findIndex(t => t.id === thread.id);

        if (selectedThread !== thread.id) return null;

        return (
          <div
            key={thread.id}
            className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
            onClick={() => setSelectedThread(null)}
          >
            <div
              className="bg-white border-2 border-[#d3d6da] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Suspense fallback={<div className="p-4">Loading...</div>}>
                <Thread thread={thread} />
              </Suspense>
            </div>
          </div>
        );
      })}
    </div>
  );
}
