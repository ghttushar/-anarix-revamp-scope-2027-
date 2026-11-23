import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/auth.slice';
import rowFilterReducer from './slices/filters/filter.slice';
import logsReducer from './slices/logs/logs.slice';
import toastMessageReducer from './slices/notifications/toast-message.slice';
import notificationCenterReducer from './slices/notifications/notification-center.slice';

/**
 * The part of anarix-ui's Redux store the ported pages use (Logs: its header filters, the row filters, the toast
 * queue, and the selected advertising account; the notification centre behind the action island's Notifications).
 * Provided by LegacyPage and by the island's notifications bridge.
 */
export interface IRootState {
  auth: ReturnType<typeof authReducer>;
  rowFilter: ReturnType<typeof rowFilterReducer>;
  logs: ReturnType<typeof logsReducer>;
  toastMessage: ReturnType<typeof toastMessageReducer>;
  notificationCenter: ReturnType<typeof notificationCenterReducer>;
}

export const legacyStore = configureStore({
  reducer: {
    auth: authReducer,
    rowFilter: rowFilterReducer,
    logs: logsReducer,
    toastMessage: toastMessageReducer,
    notificationCenter: notificationCenterReducer,
  },
  // anarix-ui keeps dates and React elements (dropdown icons) in state.
  middleware: (getDefault) => getDefault({ serializableCheck: false, immutableCheck: false }),
});

export type AppDispatch = typeof legacyStore.dispatch;
