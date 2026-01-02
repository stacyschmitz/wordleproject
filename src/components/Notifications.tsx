import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useInboxNotifications, useMarkAllInboxNotificationsAsRead } from '../lib/liveblocks';
import { InboxNotification, InboxNotificationList } from '@liveblocks/react-ui';

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { inboxNotifications } = useInboxNotifications();
  const markAllAsRead = useMarkAllInboxNotificationsAsRead();

  const unreadCount = inboxNotifications?.filter((n) => !n.readAt).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#1a1a1b] hover:bg-[#f6f7f8] rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#6aaa64] rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-80 max-w-[90vw] bg-white border-2 border-[#d3d6da] rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-3 border-b border-[#d3d6da]">
              <h3 className="font-bold text-[#1a1a1b] text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#6aaa64] hover:text-[#538d4e] font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {inboxNotifications && inboxNotifications.length > 0 ? (
                <InboxNotificationList>
                  {inboxNotifications.map((notification) => (
                    <InboxNotification
                      key={notification.id}
                      inboxNotification={notification}
                      className="text-sm hover:bg-[#f6f7f8] transition-colors"
                    />
                  ))}
                </InboxNotificationList>
              ) : (
                <div className="p-6 text-center text-[#878a8c] text-sm">
                  No notifications yet
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
