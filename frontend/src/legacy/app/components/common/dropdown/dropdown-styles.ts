import { fancyScrollbar } from '@legacy/assets/styles/scrollbar.styles';

const width = '';

export const noOutlineSelectStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  padding: 'calc(0 * var(--np-rem))',
  borderRadius: 'calc(0.4 * var(--np-rem))',
  height: 'calc(2 * var(--np-rem))',

  maxWidth: { width },
  color: '#000000',

  boxShadow: 'none',
  flex: '1 1 auto',

  '&.MuiOutlinedInput-input': {
    paddingRight: 'calc(2 * var(--np-rem)) !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3F4FDA !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #ff050b !important',
  },
  '& .MuiSelect-icon': {
    top: 'calc(20% - calc(1 * var(--np-rem)))',
    left: 'calc(100% - calc(2.5 * var(--np-rem)))',
    height: 'calc(3 * var(--np-rem))',
    width: 'calc(3 * var(--np-rem))',
  },
};

export const menuProps = (height?: string) => {
  return {
    PaperProps: {
      sx: {
        position: 'absolute',
        maxHeight: height ? height : 'calc(20 * var(--np-rem))',
      },
    },
    sx: {
      '& .MuiMenu-paper': {
        padding: 0,
        marginTop: 'calc(0.2 * var(--np-rem))',
        ...fancyScrollbar,
        boxShadow: '0 0 calc(0.4 * var(--np-rem)) 0 rgba(0, 0, 0, 0.2)',
        border: 'none',
        borderRadius: 'calc(0.4 * var(--np-rem))',
      },
    },
  };
};

export const listItemStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  width: '100%',
  padding: 'calc(0 * var(--np-rem))',
  '& .MuiTypography-body1': {
    fontSize: 'calc(1.2 * var(--np-rem))',
    color: '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const formStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'auto',
};

export const inputLabelStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  color: '#000000',
  marginRight: 'calc(0.5 * var(--np-rem))',
  display: 'flex',
  width: '100%',
  marginBottom: 'calc(0.3 * var(--np-rem))',
};

export const inputLabelNewStyles = {
  fontSize: 'calc(1 * var(--np-rem))',
  fontWeight: 600,
  lineHeight: '144%',
  color: '#464646',
  marginRight: 'calc(0.5 * var(--np-rem))',
  display: 'flex',
  width: '100%',
  marginBottom: 'calc(0.3 * var(--np-rem))',
};

export const selectStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  padding: 'calc(0 * var(--np-rem))',
  height: 'calc(3 * var(--np-rem))',
  color: '#000000',
  boxShadow: 'none',
  flex: '1 1 auto',
  textAlign: 'left',
  fontWeight: '500',

  '.MuiOutlinedInput-input': {
    padding: 0,
    paddingRight: 'calc(2 * var(--np-rem)) !important',
    paddingLeft: 'calc(1.5 * var(--np-rem))',
    display: 'flex',
    alignItems: 'center',
    gap: 'calc(0.2 * var(--np-rem))',
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
};

export const selectOldStyles = {
  borderRadius: 'calc(0.4 * var(--np-rem))',

  '&:hover': {
    border: '1px solid #464646 !important',
  },

  '&.Mui-active, &.Mui-focused': {
    border: '1px solid #3F4FDA !important',
  },
};

export const selectNewStyles = {
  borderRadius: 'calc(0.8 * var(--np-rem))',
  fontWeight: '400 !important',

  '&:hover': {
    border: '0.5px solid #000000 !important',
    background: '#ffffff',
  },

  '&.Mui-active, &.Mui-focused': {
    border: '0.5px solid #000000 !important',
    background: '#ffffff',
  },
};

export const menuPropsStyles = {
  '& .MuiMenu-paper': {
    boxShadow: '0 0 calc(0.4 * var(--np-rem)) 0 rgba(0, 0, 0, 0.2)',
    marginTop: 'calc(0.7 * var(--np-rem))',

    '& .MuiMenuItem-root': {
      display: 'flex',
      gap: 'calc(0.5 * var(--np-rem))',
      alignItems: 'center',
      '&.Mui-disabled': {
        cursor: 'not-allowed !important',
      },
      '&:hover .MuiTypography-body1': {
        color: '#3F4FDA',
      },
      '&.Mui-selected': {
        backgroundColor: '#F1F2F3',
        '.MuiTypography-body1': {
          color: '#3F4FDA',
          fontWeight: 500,
        },

        '&.Mui-focusVisible': {
          backgroundColor: '#F1F2F3',
          '.MuiTypography-body1': {
            color: '#3F4FDA',
            fontWeight: 500,
          },
        },
      },
    },
  },
};

export const paperPropsStyles = {
  position: 'absolute',
  maxHeight: 'calc(18 * var(--np-rem))',
  minWidth: 'auto',
  marginTop: 'calc(0.7 * var(--np-rem))',
  ...fancyScrollbar,
};

export const paperPropsNewStyles = {
  borderRadius: 'calc(0.8 * var(--np-rem))',
  border: '0.5px solid transparent !important',
  background:
    'linear-gradient(#ffffff, #ffffff) padding-box, ' +
    'linear-gradient(90.2deg, rgba(101, 133, 249, 1) 0.09%, rgba(42, 79, 244, 1) 99.55%) border-box',
  boxShadow: '0 0 16px 3px rgba(42, 79, 244, 0.25)',
};

export const paperPropsOldStyles = {
  borderRadius: 'calc(0.4 * var(--np-rem))',
};

export const listItemTextStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  color: '#000000',
  padding: 'calc(0 * var(--np-rem))',
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  '& .MuiTypography-body1': {
    fontSize: 'calc(1.2 * var(--np-rem))',
    color: '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const formControlStyles = {
  borderRadius: 'calc(0.8 * var(--np-rem))',
  backgroundColor: '#ffffff',
  margin: 0,
  transition: 'all 0.2s ease',

  '& .Mui-disabled': {
    cursor: 'not-allowed',
  },

  '&.Mui-error': {
    border: '1px solid #foo',
  },
};

export const menuItemStyles = {
  '&.Mui-selected': {
    backgroundColor: '#E9EBFF',
    color: '#ffffff',
    margin: 0,
    '&:hover': {
      backgroundColor: '#F1F2F3',
      boxShadow: 'none',
    },
  },

  '&:hover': {
    backgroundColor: '#F1F2F3',
    boxShadow: 'none',
  },
};

export const checkboxStyles = {
  color: '#3f4fda',
  borderRadius: 'calc(0.4 * var(--np-rem))',
  '&.Mui-checked': {
    color: '#3f4fda',
  },
  '& .MuiSvgIcon-root': { fontSize: 'calc(1.6 * var(--np-rem))', borderRadius: 'calc(0.4 * var(--np-rem))' },
  padding: 'calc(0.2 * var(--np-rem)) calc(0.5 * var(--np-rem))',
  '&.Mui-disabled': {
    color: '#464646',
  },
};

export const listSubHeaderStyles = {
  fontSize: 'calc(1.3 * var(--np-rem))',
  color: '#000000',
  lineHeight: 'calc(2.8 * var(--np-rem))',
  fontWeight: 700,
};

export const checkBoxMenuItemStyles = {
  '&.Mui-selected': {
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  padding: 'calc(0.5 * var(--np-rem))',
  width: '100%',
};
