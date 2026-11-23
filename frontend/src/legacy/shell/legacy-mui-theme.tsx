import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo, type ReactNode } from 'react';
import { getLegacyPortalRoot } from './legacy-portal';
import { useNpRem } from './np-rem';

/** This app's root font size (frontend/src/index.css). */
const APP_ROOT_PX = 18;

/**
 * anarix-ui renders MUI with the default theme against an 11px root. MUI writes its typography in rem, so here the
 * theme's htmlFontSize is scaled so every MUI rem value comes out at the same pixel size it has in anarix-ui.
 * MUI's popovers, poppers and modals also render into the scoped portal root (see legacy-portal.ts).
 */
export function LegacyMuiTheme({ children }: { children: ReactNode }) {
  const rem = useNpRem();
  const theme = useMemo(
    () =>
      createTheme({
        typography: { htmlFontSize: (16 * APP_ROOT_PX) / rem },
        components: {
          MuiPopover: { defaultProps: { container: getLegacyPortalRoot } },
          MuiPopper: { defaultProps: { container: getLegacyPortalRoot } },
          MuiModal: { defaultProps: { container: getLegacyPortalRoot } },
        },
      }),
    [rem],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
