export const PRIMARY_BUTTON_BACKGROUND_NEW =
  'linear-gradient(99.66deg, #4F5EE5 4.22%, #0218D5 89%)';

export const primaryButtonStyles = (textColor: string, bgColor = '#3F4FDA') => {
  return {
    borderRadius: 'calc(0.8 * var(--np-rem))',
    background: bgColor,
    border: `1px solid ${bgColor}`,
    color: textColor,
    textTransform: 'none',
    boxShadow: 'none',
    padding: 'calc(0.5 * var(--np-rem)) calc(0.8 * var(--np-rem))',
    minWidth: 0,

    '&:hover': {
      background: bgColor,
      border: `1px solid ${bgColor}`,
      color: textColor,
    },
    '&.Mui-disabled': {
      border: '1px solid rgba(0, 0, 0, 0.02)',
      cursor: 'not-allowed !important',
      background: 'rgba(0, 0, 0, 0.12)',
    },

    '.MuiButton-startIcon': {
      marginRight: 'calc(0.3 * var(--np-rem))',
    },

    '.MuiButton-endIcon': {
      marginLeft: 'calc(0.3 * var(--np-rem))',
    },
  };
};

export const primaryButtonNewDesignStyles = (
  textColor: string,
  bgColor?: string
) => {
  return {
    borderRadius: 'calc(0.8 * var(--np-rem))',
    background: bgColor ?? PRIMARY_BUTTON_BACKGROUND_NEW,
    border: 'none',
    color: textColor,
    textTransform: 'none',
    boxShadow: 'none',
    padding: 'calc(0.5 * var(--np-rem)) calc(0.8 * var(--np-rem))',
    minWidth: 0,

    '&:hover': {
      background: bgColor ?? PRIMARY_BUTTON_BACKGROUND_NEW,
      border: 'none',
      color: textColor,
    },

    '&.Mui-disabled': {
      border: '1px solid rgba(0, 0, 0, 0.02)',
      cursor: 'not-allowed !important',
      background: 'rgba(0, 0, 0, 0.12)',
    },

    '.MuiButton-startIcon': {
      marginRight: 'calc(0.3 * var(--np-rem))',
    },

    '.MuiButton-endIcon': {
      marginLeft: 'calc(0.3 * var(--np-rem))',
    },
  };
};
