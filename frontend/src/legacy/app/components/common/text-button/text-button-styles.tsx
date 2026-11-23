export const textButtonOldStyles = {
  textTransform: 'none',
  color: '#3f4fda',
  fontSize: 'calc(1.2 * var(--np-rem))',
  fontWeight: 600,
  padding: 0,
  minWidth: 'auto',
  transition: 'all 0.3s ease-in-out',

  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 'calc(0.2 * var(--np-rem))',

    svg: {
      fill: '#3f4fda',
    },
  },

  '& .MuiButton-endIcon': {
    marginLeft: 'calc(0.2 * var(--np-rem))',
    marginRight: 0,

    svg: {
      fill: '#3f4fda',
    },
  },

  '&.Mui-disabled': {
    color: '#dbdbdb',

    '& .MuiButton-startIcon svg': {
      fill: 'currentColor',
    },

    '& .MuiButton-endIcon svg': {
      fill: 'currentColor',
    },
  },

  '&:hover': {
    backgroundColor: 'transparent',
  },
} as React.CSSProperties;

export const newTextButtonHoverSelectedStyles = {
  backgroundColor: 'transparent',
  color: '#3F4FDA',
  fontSize: 'calc(1.2 * var(--np-rem))',
  fontWeight: 500,

  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    svg: {
      fill: '#3F4FDA',
    },
  },
};

export const newTextButtonStyles = (isDisabled = false, isSelected = false) => {
  return {
    textTransform: 'none',
    color: isDisabled ? '#bdbdbd' : '#464646',
    fontSize: 'calc(1.1 * var(--np-rem))',
    fontWeight: 500,
    padding: 0,
    height: '100%',
    minWidth: 'auto',
    backgroundColor: 'transparent',
    transition: 'all 0.1s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& .MuiButton-startIcon': {
      marginLeft: 0,
      marginRight: 'calc(0.2 * var(--np-rem))',
      svg: {
        fill: isDisabled ? '#bdbdbd' : '#464646',
        width: 'calc(1.5 * var(--np-rem))',
        height: 'calc(1.5 * var(--np-rem))',
      },
    },

    '& .MuiButton-endIcon': {
      marginLeft: 'calc(0.2 * var(--np-rem))',
      marginRight: 0,
      svg: {
        fill: isDisabled ? '#bdbdbd' : '#464646',
        width: 'calc(1.5 * var(--np-rem))',
        height: 'calc(1.5 * var(--np-rem))',
      },
    },

    ...(isSelected === true && newTextButtonHoverSelectedStyles),

    '&:hover': {
      ...(isDisabled === false && newTextButtonHoverSelectedStyles),
    },
  };
};
