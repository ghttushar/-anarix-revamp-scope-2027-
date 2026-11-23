export const secondaryButtonStyles = (hoverColor?: string) => {
  return {
    background: '#ffffff',
    color: '#464646',
    textTransform: 'none',
    boxShadow: 'none',
    padding: 'calc(0.5 * var(--np-rem)) calc(0.8 * var(--np-rem))',
    border: '1px solid #dadceb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minWidth: 0,

    '&:focus': {
      borderColor: '#8b8b8b',
    },

    '&:hover': {
      borderColor: hoverColor ?? '#8b8b8b',
      background: '#ffffff',
      color: hoverColor ?? 'initial',
      boxShadow: 'none',

      svg: {
        fill: hoverColor ?? 'initial',
      },
    },

    '.MuiButton-startIcon': {
      marginRight: 'calc(0.5 * var(--np-rem))',
    },
  };
};
