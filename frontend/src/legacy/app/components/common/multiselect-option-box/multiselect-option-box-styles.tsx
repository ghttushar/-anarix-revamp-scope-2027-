export const checkboxStyles = {
  marginLeft: 'calc(1 * var(--np-rem))',
  color: '#3f4fda',
  '&.Mui-checked': {
    color: '#3f4fda',
  },
};

export const formControlLabelStyles = (isFilter: boolean) => {
  return {
    '&.MuiFormControlLabel-root .MuiFormControlLabel-label': {
      fontSize: 'calc(1.1 * var(--np-rem))',
      fontWeight: isFilter ? '400' : '600',
      borderRadius: 'calc(0.4 * var(--np-rem))',
      whiteSpace: 'pre-wrap',
    },
  };
};

export const textFieldStyles = {
  width: '100%',

  'input[type=number]': {
    marginLeft: '5px',
  },

  'input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
  },

  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: 'calc(0.4 * var(--np-rem))',
    fontSize: 'calc(1.2 * var(--np-rem))',
    fontFamily: 'Inter, sans-serif !important',
    fontWeight: 400,
    lineHeight: '17.26px',
    letterSpacing: '-2%',
    marginTop: 'calc(0.3 * var(--np-rem))',
    padding: 'calc(0.7 * var(--np-rem))',
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadceb !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #8b8b8b !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FF050B',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#3f4fda !important',
    },
  },
};
