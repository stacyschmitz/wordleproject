import { ReactNode } from 'react';
import { LiveblocksProvider as LBProvider } from '@liveblocks/react/suspense';

interface LiveblocksProviderProps {
  children: ReactNode;
}

export function LiveblocksProvider({ children }: LiveblocksProviderProps) {
  return (
    <LBProvider
      publicApiKey={import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || 'pk_dev_placeholder'}
      resolveUsers={({ userIds }) => {
        return userIds.map((userId) => ({
          name: userId,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
        }));
      }}
      resolveMentionSuggestions={({ text }) => {
        const users = ['Katie', 'Stacy'];
        return users
          .filter((user) => user.toLowerCase().includes(text.toLowerCase()))
          .map((user) => user);
      }}
    >
      {children}
    </LBProvider>
  );
}
