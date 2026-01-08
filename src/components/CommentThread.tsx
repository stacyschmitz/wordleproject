import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CommentThreadProps {
  resultDate: string;
  player: string;
  onClick?: () => void;
}

export function CommentThread({ resultDate, player, onClick }: CommentThreadProps) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('result_date', resultDate)
        .eq('player_name', player);

      setCommentCount(count || 0);
    };

    fetchCommentCount();

    const channel = supabase
      .channel(`comments-${resultDate}-${player}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `result_date=eq.${resultDate}`,
        },
        () => {
          fetchCommentCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [resultDate, player]);

  if (commentCount === 0) return null;

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
        {commentCount}
      </div>
    </button>
  );
}
