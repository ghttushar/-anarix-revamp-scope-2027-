export const textFieldStyles = {
  '& > :not(style)': {
    width: '100%',
    height: 'calc(3.1 * var(--np-rem))',
    borderRadius: 'calc(0 * var(--np-rem))',
    fontSize: 'calc(1.2 * var(--np-rem))',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0',
    marginBottom: 'calc(1.4 * var(--np-rem))',
    padding: 0,
  },
  '&.MuiFormControl-root': {
    width: '90%',
  },
  '& .MuiOutlinedInput-input': {
    padding: 'calc(1 * var(--np-rem))',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadceb !important',
    borderRadius: 'calc(0.4 * var(--np-rem))',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #464646 !important',
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
    '&:hover fieldset': {
      borderColor: '#464646  !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f4fda !important',
    },
    '&.Mui-active fieldset': {
      borderColor: '#3f4fda !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#FF050B !important',
    },
  },
  '& .MuiFormHelperText-root': {
    margin: 0,
    marginTop: 1,
    fontWeight: 400,
    fontSize: 'calc(1.1 * var(--np-rem))',
  },
  '& .MuiTypography-root': {
    fontSize: 'calc(1.3 * var(--np-rem))',
    fontWeight: '500',
  },
};

export const labelStyles = {
  color: '#000000',
  fontSize: 'calc(1.4 * var(--np-rem))',
  fontWeight: '600',
  lineHeight: 'normal',
  letterSpacing: '-0.42px',
};

export const radioButtonStyles = {
  '& .MuiSvgIcon-root': {
    fontSize: 'calc(1.6 * var(--np-rem))',
    color: '#3f4fda',

    '& .Mui-error': {
      color: '#FF050B',
    },
  },
};

export const checkboxStyles = {
  borderRadius: 'calc(0.4 * var(--np-rem))',
  '&.Mui-checked': {
    color: '#3f4fda',
  },
  '&.Mui-disabled': {
    color: '#bbbbbb',
  },
};

export const timeRangeButtonStyles = {
  '.MuiButton-startIcon': {
    marginRight: '2px',
  },

  '&:hover': {
    '.MuiButton-startIcon': {
      '& svg': {
        fill: '#ffffff',
      },
    },
  },
};

export const timeLabelStyles = {
  fontSize: 'calc(1 * var(--np-rem))',
  fontWeight: '400',
  letterSpacing: 'calc(-0.02 * var(--np-rem))',
  lineHeight: '144%',
};
