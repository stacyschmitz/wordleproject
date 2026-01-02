import { Thread, Composer } from '@liveblocks/react-ui';
import { useThreads, useCreateThread } from '../lib/liveblocks';
import { useState } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';

export function OverlayComments() {
  const { threads } = useThreads();
  const createThread = useCreateThread();
  const [showComposer, setShowComposer] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (text && text.length > 0) {
      setSelectedText(text);
      setShowComposer(true);
    }
  };

  const handleCreateThread = (body: any) => {
    createThread({ body, metadata: {} });
    setShowComposer(false);
    setSelectedText('');
  };

  return (
    <>
      <div onMouseUp={handleTextSelection}>
        {showComposer && (
          <div className="fixed bottom-4 right-4 w-80 bg-white border-2 border-[#d3d6da] rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1a1a1b]">New Comment</h3>
              <button
                onClick={() => {
                  setShowComposer(false);
                  setSelectedText('');
                }}
                className="text-[#878a8c] hover:text-[#1a1a1b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {selectedText && (
              <div className="mb-3 p-2 bg-[#f6f7f8] rounded text-xs text-[#878a8c] italic">
                "{selectedText}"
              </div>
            )}
            <Composer
              onComposerSubmit={({ body }) => handleCreateThread(body)}
              className="text-sm"
              placeholder="Add a comment... use @ to mention someone"
            />
          </div>
        )}

        {threads && threads.length > 0 && (
          <div className="fixed top-16 right-4 w-80 max-h-96 overflow-y-auto bg-white border-2 border-[#d3d6da] rounded-lg shadow-lg p-4 z-40">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquarePlus className="w-4 h-4 text-[#1a1a1b]" />
              <h3 className="text-sm font-bold text-[#1a1a1b]">Comments</h3>
            </div>
            <div className="space-y-3">
              {threads.map((thread) => (
                <Thread key={thread.id} thread={thread} className="text-sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowComposer(true)}
        className="fixed bottom-4 left-4 bg-[#6aaa64] hover:bg-[#538d4e] text-white p-3 rounded-full shadow-lg z-50 transition-colors"
        title="Add comment"
      >
        <MessageSquarePlus className="w-5 h-5" />
      </button>
    </>
  );
}
