import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import '@legacy/scope.css';
import ToastMessageQueue from '@legacy/app/components/common/toast-message-queue/toast-message-queue';
import { legacyStore } from '@legacy/redux/store';
import { LegacyMuiTheme } from './legacy-mui-theme';
import { LegacySubHeader, LegacySubHeaderProvider } from './legacy-sub-header';

/**
 * The frame a page ported from anarix-ui renders in: anarix-ui's page header strip (when the page had one) above the
 * page, inside the `.np-scope` that recreates anarix-ui's global type and sizing. Mirrors anarix-ui's desktop view,
 * where the toast queue, the header strip and the page sit stacked in the main column. Pages that use anarix-ui's
 * Redux state (Logs) get the small local store in legacy/redux.
 */
export function LegacyPage({ children, subHeader = true }: { children: ReactNode; subHeader?: boolean }) {
  return (
    <Provider store={legacyStore}>
      <LegacyMuiTheme>
        <LegacySubHeaderProvider>
          <div className="np-scope np-page">
            <ToastMessageQueue />
            {subHeader && <LegacySubHeader />}
            <div style={{ width: '100%', display: 'block' }}>{children}</div>
          </div>
        </LegacySubHeaderProvider>
      </LegacyMuiTheme>
    </Provider>
  );
}
