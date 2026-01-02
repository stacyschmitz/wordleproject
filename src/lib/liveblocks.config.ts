import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: async (room) => {
    const userId = localStorage.getItem('wordleUser') || 'Anonymous';
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/liveblocks-auth`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId,
          roomId: room || 'wordle-tracker-main',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to authenticate with Liveblocks');
    }

    const data = await response.json();
    return data;
  },
  resolveUsers: async ({ userIds }) => {
    return userIds.map((userId) => ({
      name: userId,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
    }));
  },
  resolveMentionSuggestions: async ({ text }) => {
    const users = ["Katie", "Stacy"];
    return users
      .filter((user) => user.toLowerCase().includes(text.toLowerCase()))
      .map((user) => user);
  },
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

type Storage = {};

type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
  };
};

type RoomEvent = {};

export type ThreadMetadata = {
  resultDate: string;
  player: string;
  resolved: boolean;
};

export const {
  suspense: {
    RoomProvider,
    useThreads,
    useCreateThread,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
    useRoom,
    useSelf,
    useEditThreadMetadata,
  },
  ThreadComposer,
  Thread,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);
