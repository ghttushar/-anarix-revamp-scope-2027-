import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Provider } from 'react-redux';
import '@legacy/scope.css';
import NotificationDrawer from '@legacy/app/components/notifications/notification-drawer';
import useModalLock from '@legacy/app/components/notifications/use-modal-lock';
import { INCOMING_INTERVAL_MS } from '@legacy/constants/notifications/notifications.constants';
import { SIMULATED_NOTIFICATIONS } from '@legacy/constants/notifications/notifications-mock';
import { legacyStore } from '@legacy/redux/store';
import { addNotification } from '@legacy/redux/slices/notifications/notification-center.slice';
import { LegacyMuiTheme } from './legacy-mui-theme';

/**
 * anarix-ui's notification centre (its drawer and notifications), opened from this app's action island instead of
 * anarix-ui's header bell. The drawer keeps its anarix-ui design and renders in the scoped portal root.
 */

const selectItems = () => legacyStore.getState().notificationCenter.items;
const selectPreview = () => legacyStore.getState().notificationCenter.preview;

/** Unread notifications, for the island's badge. Like the bell, the Empty preview shows none. */
export function useLegacyUnreadNotifications(): number {
  const items = useSyncExternalStore(legacyStore.subscribe, selectItems);
  const preview = useSyncExternalStore(legacyStore.subscribe, selectPreview);
  return preview === 'empty' ? 0 : items.filter((n) => !n.read).length;
}

/**
 * While the drawer's Incoming preview is on, a new notification arrives every few seconds (anarix-ui ran this from its
 * header bell).
 */
function useIncomingArrivals() {
  const preview = useSyncExternalStore(legacyStore.subscribe, selectPreview);
  const next = useRef(0);
  useEffect(() => {
    if (preview !== 'incoming') return undefined;
    const push = () => {
      const template = SIMULATED_NOTIFICATIONS[next.current % SIMULATED_NOTIFICATIONS.length];
      next.current += 1;
      const createdAt = Date.now();
      legacyStore.dispatch(addNotification({ ...template, id: `live-${createdAt}`, createdAt, read: false }));
    };
    push();
    const interval = window.setInterval(push, INCOMING_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [preview]);
}

/** The notification drawer. While it is open the page behind it can't scroll or be clicked, as in anarix-ui. */
export function LegacyNotificationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useModalLock(open);
  useIncomingArrivals();
  return (
    <Provider store={legacyStore}>
      <LegacyMuiTheme>
        <NotificationDrawer open={open} onClose={onClose} />
      </LegacyMuiTheme>
    </Provider>
  );
}
