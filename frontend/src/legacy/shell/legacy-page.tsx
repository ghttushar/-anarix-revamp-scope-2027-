import type { ReactNode } from 'react';
import '@legacy/scope.css';
import { LegacyMuiTheme } from './legacy-mui-theme';
import { LegacySubHeader, LegacySubHeaderProvider } from './legacy-sub-header';

/**
 * The frame a page ported from anarix-ui renders in: anarix-ui's page header strip (when the page had one) above the
 * page, inside the `.np-scope` that recreates anarix-ui's global type and sizing. Mirrors anarix-ui's desktop view,
 * where the header strip and the page sit stacked in the main column.
 */
export function LegacyPage({ children, subHeader = true }: { children: ReactNode; subHeader?: boolean }) {
  return (
    <LegacyMuiTheme>
      <LegacySubHeaderProvider>
        <div className="np-scope np-page">
          {subHeader && <LegacySubHeader />}
          <div style={{ width: '100%', display: 'block' }}>{children}</div>
        </div>
      </LegacySubHeaderProvider>
    </LegacyMuiTheme>
  );
}
