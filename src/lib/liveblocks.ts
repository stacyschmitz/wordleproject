import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';
import { useInboxNotifications as useLiveblocksInboxNotifications, useMarkAllInboxNotificationsAsRead as useLiveblocksMarkAllInboxNotificationsAsRead } from '@liveblocks/react/suspense';

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

export type ThreadMetadata = {};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useThreads,
    useUser,
    useCreateThread,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);

export const useInboxNotifications = useLiveblocksInboxNotifications;
export const useMarkAllInboxNotificationsAsRead = useLiveblocksMarkAllInboxNotificationsAsRead;

export { client };
