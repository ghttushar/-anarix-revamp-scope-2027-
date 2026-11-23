export const inputLabelStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  color: '#000000',
};

export const selectStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  padding: 'calc(0 * var(--np-rem))',
  borderRadius: 'calc(0 * var(--np-rem))',
  height: 'calc(3 * var(--np-rem))',
  width: 'calc(20 * var(--np-rem))',
  color: '#000000',
  boxShadow: 'none',
  flex: '1 1 auto',

  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
};

export const menuPropsStyles = {
  '& .MuiMenu-paper': {
    boxShadow: 'none',
    border: '1px solid #dadceb',
    borderRadius: 'calc(0 * var(--np-rem))',
  },
};

export const paperPropsStyles = {
  position: 'absolute',
  maxHeight: 'calc(20 * var(--np-rem))',
};

export const listItemTextStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  color: '#000000',
  width: 'calc(8 * var(--np-rem))',
  padding: 'calc(0 * var(--np-rem))',
  '& .MuiTypography-body1': {
    fontSize: 'calc(1.2 * var(--np-rem))',
    color: '#000000',
  },
};

export const formControlStyles = {
  m: 1,
  minWidth: 120,
  marginTop: 'calc(0.2 * var(--np-rem))',
  margin: 'calc(0 * var(--np-rem))',
};
