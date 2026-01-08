import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CommentComposer } from './CommentComposer';
import { Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  result_date: string;
  player_name: string;
  author: string;
  body: string;
  created_at: string;
}

interface CommentListProps {
  resultDate: string;
  playerName: string;
  currentUser: string;
}

export function CommentList({ resultDate, playerName, currentUser }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('result_date', resultDate)
      .eq('player_name', playerName)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `result_date=eq.${resultDate}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [resultDate, playerName]);

  const handleSubmit = async (body: string) => {
    await supabase.from('comments').insert({
      result_date: resultDate,
      player_name: playerName,
      author: currentUser,
      body,
    });

    setShowComposer(false);
    fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId);
    fetchComments();
  };

  if (isLoading) {
    return <div className="p-4 text-center text-[#878a8c]">Loading comments...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-[#d3d6da] pb-3 last:border-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1">
                <span className="font-bold text-[#1a1a1b] text-sm">{comment.author}</span>
                <span className="text-xs text-[#878a8c] ml-2">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {comment.author === currentUser && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-[#878a8c] hover:text-red-500 transition-colors"
                  title="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-[#1a1a1b] whitespace-pre-wrap">{comment.body}</p>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-[#878a8c] text-sm text-center py-4">No comments yet</p>
      )}

      {showComposer ? (
        <CommentComposer
          onSubmit={handleSubmit}
          onCancel={() => setShowComposer(false)}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setShowComposer(true)}
          className="w-full py-2 text-sm text-[#6aaa64] hover:text-[#5a9a54] font-medium border-2 border-[#6aaa64] hover:border-[#5a9a54] rounded transition-colors"
        >
          Add Comment
        </button>
      )}
    </div>
  );
}
