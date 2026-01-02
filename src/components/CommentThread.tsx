import { useState, useEffect } from 'react';
import { MessageCircle, X, Smile, Trash2, Reply } from 'lucide-react';
import { useThreads, useCreateThread, useDeleteComment, useAddReaction, useRemoveReaction, useSelf } from '../lib/liveblocks.config';
import { ThreadMetadata } from '../lib/liveblocks.config';
import { ComposerSubmitComment } from '@liveblocks/react-comments/primitives';

interface CommentThreadProps {
  resultDate: string;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👏'];

export function CommentThread({ resultDate }: CommentThreadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyToThreadId, setReplyToThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  const { threads } = useThreads({ query: { metadata: { resultDate } } });
  const createThread = useCreateThread();
  const deleteComment = useDeleteComment();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const self = useSelf();

  const currentUser = self?.id || 'Anonymous';
  const resultThreads = threads?.filter(thread =>
    (thread.metadata as ThreadMetadata)?.resultDate === resultDate
  ) || [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.emoji-picker') && !target.closest('.emoji-button')) {
        setShowEmojiPicker(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    await createThread({
      body: {
        version: 1,
        content: [{ type: 'paragraph', children: [{ text: commentText }] }],
      },
      metadata: {
        resultDate,
        resolved: false,
      } as ThreadMetadata,
    });

    setCommentText('');
  };

  const handleSubmitReply = async (threadId: string) => {
    if (!replyText.trim()) return;

    const thread = resultThreads.find(t => t.id === threadId);
    if (!thread) return;

    await thread.createComment({
      body: {
        version: 1,
        content: [{ type: 'paragraph', children: [{ text: replyText }] }],
      },
    });

    setReplyText('');
    setReplyToThreadId(null);
  };

  const handleDeleteComment = async (threadId: string, commentId: string) => {
    await deleteComment({ threadId, commentId });
  };

  const handleToggleReaction = async (threadId: string, commentId: string, emoji: string) => {
    const thread = resultThreads.find(t => t.id === threadId);
    const comment = thread?.comments.find(c => c.id === commentId);
    const existingReaction = comment?.reactions?.find(
      r => r.emoji === emoji && r.users.some(u => u.id === currentUser)
    );

    if (existingReaction) {
      await removeReaction({ threadId, commentId, emoji });
    } else {
      await addReaction({ threadId, commentId, emoji });
    }
    setShowEmojiPicker(null);
  };

  const hasComments = resultThreads.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          hasComments ? 'text-[#6aaa64]' : 'text-[#878a8c]'
        }`}
        title="Comments"
      >
        <MessageCircle className="w-4 h-4" />
        {hasComments && (
          <span className="absolute -top-1 -right-1 bg-[#6aaa64] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {resultThreads.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-80 bg-white border-2 border-[#d3d6da] rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-[#d3d6da] p-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1a1a1b]">Comments</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#878a8c] hover:text-[#1a1a1b]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-3">
            {resultThreads.map((thread) => (
              <div key={thread.id} className="space-y-2">
                {thread.comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className={`${
                      index > 0 ? 'ml-6 border-l-2 border-[#d3d6da] pl-3' : ''
                    }`}
                  >
                    <div className="bg-[#f6f7f8] rounded p-2">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-[#1a1a1b]">
                          {comment.userId}
                        </span>
                        {comment.userId === currentUser && (
                          <button
                            onClick={() => handleDeleteComment(thread.id, comment.id)}
                            className="text-[#878a8c] hover:text-red-500"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-[#1a1a1b] whitespace-pre-wrap break-words">
                        {comment.body.content[0]?.children?.[0]?.text || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowEmojiPicker(showEmojiPicker === comment.id ? null : comment.id)}
                            className="emoji-button text-[#878a8c] hover:text-[#1a1a1b] p-1"
                            title="Add reaction"
                          >
                            <Smile className="w-3 h-3" />
                          </button>
                          {showEmojiPicker === comment.id && (
                            <div className="emoji-picker absolute left-0 top-6 bg-white border border-[#d3d6da] rounded shadow-lg p-2 flex gap-1 z-10">
                              {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleToggleReaction(thread.id, comment.id, emoji)}
                                  className="hover:bg-gray-100 p-1 rounded text-sm"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {index === 0 && (
                          <button
                            onClick={() => setReplyToThreadId(replyToThreadId === thread.id ? null : thread.id)}
                            className="text-[#878a8c] hover:text-[#1a1a1b] text-xs flex items-center gap-1"
                          >
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        )}
                      </div>
                      {comment.reactions && comment.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {comment.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              onClick={() => handleToggleReaction(thread.id, comment.id, reaction.emoji)}
                              className={`text-xs px-2 py-0.5 rounded-full border ${
                                reaction.users.some(u => u.id === currentUser)
                                  ? 'bg-[#e6f4ea] border-[#6aaa64]'
                                  : 'bg-white border-[#d3d6da]'
                              }`}
                            >
                              {reaction.emoji} {reaction.users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {replyToThreadId === thread.id && (
                  <div className="ml-6 border-l-2 border-[#d3d6da] pl-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full text-sm border border-[#d3d6da] rounded p-2 resize-none focus:outline-none focus:border-[#878a8c]"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitReply(thread.id);
                        }
                      }}
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleSubmitReply(thread.id)}
                        disabled={!replyText.trim()}
                        className="text-xs bg-[#6aaa64] text-white px-3 py-1 rounded hover:bg-[#5a9a54] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyToThreadId(null);
                          setReplyText('');
                        }}
                        className="text-xs text-[#878a8c] hover:text-[#1a1a1b]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {resultThreads.length === 0 && (
              <p className="text-xs text-[#878a8c] text-center py-4">
                No comments yet. Start the conversation!
              </p>
            )}

            <div className="border-t border-[#d3d6da] pt-3 mt-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full text-sm border border-[#d3d6da] rounded p-2 resize-none focus:outline-none focus:border-[#878a8c]"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="mt-2 w-full bg-[#6aaa64] text-white py-2 rounded font-bold text-sm hover:bg-[#5a9a54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
