import { useState } from 'react';

interface CommentComposerProps {
  onSubmit: (body: string) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

export function CommentComposer({ onSubmit, onCancel, autoFocus }: CommentComposerProps) {
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim()) {
      onSubmit(body.trim());
      setBody('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        autoFocus={autoFocus}
        className="w-full border-2 border-[#d3d6da] rounded p-2 text-sm focus:outline-none focus:border-[#878a8c] resize-none"
        rows={3}
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-[#878a8c] hover:text-[#1a1a1b] font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!body.trim()}
          className="px-4 py-2 text-sm bg-[#6aaa64] text-white rounded font-medium hover:bg-[#5a9a54] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comment
        </button>
      </div>
    </form>
  );
}
