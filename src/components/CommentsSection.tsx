import { Thread, Composer } from '@liveblocks/react-ui';
import { useThreads, useCreateThread, ThreadMetadata } from '../lib/liveblocks';
import { MessageSquare } from 'lucide-react';
import { DailyResult } from '../types';

interface CommentsSectionProps {
  result: DailyResult;
}

export function CommentsSection({ result }: CommentsSectionProps) {
  const { threads } = useThreads();
  const createThread = useCreateThread();

  const handleCreateThread = (body: any) => {
    const metadata: ThreadMetadata = {
      puzzleNumber: result.puzzle_number,
      gameDate: result.date,
    };
    createThread({ body, metadata });
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#d3d6da]">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-[#1a1a1b]" />
        <h3 className="text-sm font-bold text-[#1a1a1b]">Comments</h3>
      </div>

      <div className="space-y-4">
        {threads?.map((thread) => (
          <Thread key={thread.id} thread={thread} className="text-sm" />
        ))}

        <Composer
          onComposerSubmit={({ body }) => handleCreateThread(body)}
          className="text-sm"
          placeholder="Add a comment about this battle..."
        />
      </div>
    </div>
  );
}
