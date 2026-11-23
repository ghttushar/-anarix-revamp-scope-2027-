import { createTheme } from '@mui/material/styles';
import React from 'react';

export const primaryColor = '#3f4fda';

export const theme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 400,
          fontSize: 'calc(1.2 * var(--np-rem))',
          letterSpacing: 'calc(-0.013 * var(--np-rem))',
        },
      },
    },
  },
});

export const fontWeightTheme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 600,
          fontSize: 'calc(1.2 * var(--np-rem))',
          letterSpacing: 'calc(-0.035 * var(--np-rem))',
        },
      },
    },
  },
});

export const subMenuFontWeightTheme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 600,
          fontSize: 'calc(1 * var(--np-rem))',
          letterSpacing: 'calc(-0.02 * var(--np-rem))',
        },
      },
    },
  },
});

export const subMenuTheme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: 'fit-content',
          fontWeight: 600,
          fontSize: 'calc(1 * var(--np-rem))',
          letterSpacing: 'calc(-0.035 * var(--np-rem))',
        },
      },
    },
  },
});

export const subMenuStyles = (isHovered: boolean): React.CSSProperties => {
  return {
    maxWidth: '100%',
    marginTop: 'calc(0.8 * var(--np-rem))',
    borderRadius: '0 0 calc(0.8 * var(--np-rem)) calc(0.8 * var(--np-rem))',
    opacity: isHovered ? 1 : 0,
    transition: 'all 0.4s ease',
    pointerEvents: isHovered ? 'all' : 'none',
  };
};

export const popoverContentStyles: React.CSSProperties = {
  borderRadius: '0 calc(0.8 * var(--np-rem)) calc(0.8 * var(--np-rem)) 0',
  boxShadow: 'calc(0.2 * var(--np-rem)) calc(0.2 * var(--np-rem)) calc(0.2 * var(--np-rem)) calc(0 * var(--np-rem)) rgba(0, 0, 0, 0.15)',
  padding: 'calc(0.2 * var(--np-rem)) calc(1 * var(--np-rem))',
  border: 'none',
  background: '#f5f6f7',
  zIndex: '10000',
};
