import { ReactNode, useState, useEffect } from 'react';
import { LiveblocksProvider as LBProvider } from '@liveblocks/react/suspense';

interface LiveblocksProviderProps {
  children: ReactNode;
}

export function LiveblocksProvider({ children }: LiveblocksProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [showUserSelect, setShowUserSelect] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('wordle-user-id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setShowUserSelect(true);
    }
  }, []);

  const selectUser = (id: string) => {
    localStorage.setItem('wordle-user-id', id);
    setUserId(id);
    setShowUserSelect(false);
  };

  if (showUserSelect) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-[#d3d6da] rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#1a1a1b] mb-4 text-center">
            Who are you?
          </h2>
          <p className="text-sm text-[#878a8c] mb-6 text-center">
            Select your identity to comment and participate
          </p>
          <div className="space-y-3">
            <button
              onClick={() => selectUser('katie')}
              className="w-full py-3 px-4 bg-[#6aaa64] hover:bg-[#538d4e] text-white font-bold rounded transition-colors"
            >
              Katie
            </button>
            <button
              onClick={() => selectUser('stacy')}
              className="w-full py-3 px-4 bg-[#6aaa64] hover:bg-[#538d4e] text-white font-bold rounded transition-colors"
            >
              Stacy
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <LBProvider
      authEndpoint={async () => {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/liveblocks-auth`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        return response.json();
      }}
      resolveUsers={({ userIds }) => {
        return userIds.map((id) => ({
          name: id === 'katie' ? 'Katie' : id === 'stacy' ? 'Stacy' : id,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${id}`,
        }));
      }}
      resolveMentionSuggestions={({ text }) => {
        const users = ['katie', 'stacy'];
        return users
          .filter((user) => user.toLowerCase().includes(text.toLowerCase()))
          .map((user) => user);
      }}
    >
      {children}
    </LBProvider>
  );
}
