import { MessageCircle } from 'lucide-react';
import { useThreads } from '../lib/liveblocks.config';
import { ThreadMetadata } from '../lib/liveblocks.config';

interface CommentThreadProps {
  resultDate: string;
  player: string;
  onClick?: () => void;
}

export function CommentThread({ resultDate, player, onClick }: CommentThreadProps) {
  const { threads } = useThreads({ query: { metadata: { resultDate, player } } });

  const resultThreads = threads?.filter(thread => {
    const metadata = thread.metadata as ThreadMetadata;
    return metadata?.resultDate === resultDate && metadata?.player === player;
  }) || [];

  const hasComments = resultThreads.length > 0;

  if (!hasComments) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="relative cursor-pointer hover:opacity-80 transition-opacity"
    >
      <MessageCircle className="w-4 h-4 text-[#6aaa64]" />
      <div className="absolute -top-1 -right-1 bg-[#6aaa64] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {resultThreads.length}
      </div>
    </button>
  );
}
