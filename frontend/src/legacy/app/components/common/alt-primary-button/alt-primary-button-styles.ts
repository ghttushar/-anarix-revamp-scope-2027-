export const altPrimaryButtonStyles = (bgColor: string, textColor: string) => {
  return {
    borderRadius: 'calc(0.8 * var(--np-rem))',
    background: bgColor,
    color: textColor,
    textTransform: 'none',
    boxShadow: 'none',
    padding: 'calc(0.5 * var(--np-rem)) calc(0.8 * var(--np-rem))',
    border: '1px solid #dadceb',
    minWidth: 0,

    '&:hover': {
      background: bgColor,
      color: textColor,
    },

    '&.Mui-disabled': {
      border: 'inherit',
      cursor: 'not-allowed',
      background: 'rgba(0, 0, 0, 0.12)',
    },

    '.MuiButton-startIcon': {
      marginRight: 'calc(0.7 * var(--np-rem))',
    },
  };
};

export const altPrimaryButtonNewStyles = {
  borderRadius: 'calc(0.8 * var(--np-rem))',
  background: '#ffffff',
  color: '#464646',
  textTransform: 'none',
  boxShadow: 'none',
  padding: 'calc(0.5 * var(--np-rem)) calc(0.8 * var(--np-rem))',
  border: '0.5px solid #d1d1d1',
  minWidth: 0,

  '&:hover': {
    background: '#ffffff',
    color: '#464646',
    boxShadow: 'none',
    borderColor: '#000000',
  },

  '.MuiButton-startIcon': {
    marginRight: '5px',
  },

  '&.Mui-disabled': {
    border: '0.5px solid #acacac',
    cursor: 'not-allowed',
    background: '#F0F0F01A',
    color: '#acacac',
    svg: {
      fill: '#acacac',
    },

    '.MuiButton-startIcon': {
      svg: {
        fill: '#acacac',
      },
    },
  },
};

export const noBorderIconButtonStyles = {
  background: 'transparent',
  textTransform: 'none',
  boxShadow: 'none',
  padding: 0,
  border: 'none',
  minWidth: 0,

  svg: {
    fill: '#464646',
  },

  '&:hover': {
    background: 'transparent',
    color: '#464646',
    boxShadow: 'none',
    borderColor: 'transparent',
    svg: {
      fill: '#3F4FDA',
    },
  },

  '&.Mui-disabled': {
    cursor: 'not-allowed',
    svg: {
      fill: '#acacac',
    },
  },
};
