import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || 'pk_dev_placeholder',
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

type Storage = {};

type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
  };
};

type RoomEvent = {};

export type ThreadMetadata = {
  puzzleNumber: number;
  gameDate: string;
};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useThreads,
    useCreateThread,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useUser,
    useInboxNotifications,
    useMarkAllInboxNotificationsAsRead,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);

export { client };
