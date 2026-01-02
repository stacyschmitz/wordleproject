import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || "",
  authEndpoint: async () => {
    const userId = localStorage.getItem('wordleUser') || 'Anonymous';
    return {
      token: userId,
    };
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
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);
