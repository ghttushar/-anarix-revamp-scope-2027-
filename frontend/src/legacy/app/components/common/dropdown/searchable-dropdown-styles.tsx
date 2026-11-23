import { hexToRGBA } from '@legacy/utils';

export const inputLabelStyles = {
  fontSize: 'calc(1.2 * var(--np-rem))',
  color: '#000000',
  display: 'flex',
};

export const selectStyles = {
  '.MuiOutlinedInput-root': {
    paddingRight: 'calc(5 * var(--np-rem)) !important',
  },

  '& input': {
    padding: 'calc(0 * var(--np-rem))',
    margin: 'calc(0 * var(--np-rem))',
  },

  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: 'calc(0 * var(--np-rem)) calc(0.3 * var(--np-rem)) calc(0 * var(--np-rem)) calc(1.5 * var(--np-rem))',
    width: '100%',
  },

  '& .MuiAutocomplete-input': {
    padding: 'calc(0 * var(--np-rem))',
    borderRadius: 'calc(0 * var(--np-rem))',
    color: '#000000',
    fontWeight: 600,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  '& .MuiAutocomplete-endAdornment': {
    margin: 'calc(0.4 * var(--np-rem)) calc(0 * var(--np-rem))',
  },

  '.MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadceb !important',
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
};

export const chipStyles = {
  '& input': {
    padding: 'calc(0 * var(--np-rem))',
    margin: 'calc(0 * var(--np-rem))',
  },

  '& .MuiAutocomplete-inputRoot': {
    padding: 'calc(0 * var(--np-rem))',
    margin: 'calc(0 * var(--np-rem))',
    boxShadow: 'none',
    borderRadius: 'calc(0 * var(--np-rem))',
    flex: '1 1 auto',
    color: '#000000',
    minHeight: 'calc(3 * var(--np-rem))',
    width: 'calc(24 * var(--np-rem))',
    fontSize: 'calc(1.2 * var(--np-rem))',
  },

  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: 'calc(0 * var(--np-rem)) calc(0.5 * var(--np-rem)) calc(0 * var(--np-rem)) calc(1.5 * var(--np-rem))',
  },

  '& .MuiAutocomplete-input': {
    padding: 'calc(0 * var(--np-rem))',
    boxShadow: 'none',
    borderRadius: 'calc(0 * var(--np-rem))',
    color: '#000000',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  '& .MuiAutocomplete-endAdornment': {
    margin: 'calc(0.4 * var(--np-rem)) calc(0 * var(--np-rem))',
  },

  '.MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadceb !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #3f4fda !important',
  },

  '&.MuiSvgIcon-fontSizeMedium .MuiChip-deleteIcon .MuiChip-deleteIconMedium': {
    fontSize: 'calc(0.6 * var(--np-rem))',
    color: 'red',
  },

  '& .MuiAutocomplete-popper': {
    margin: 'calc(10 * var(--np-rem))',
  },
};

export const customPaperStyle = {
  padding: 'calc(0.1 * var(--np-rem))',
  borderRadius: 'calc(0.4 * var(--np-rem))',
  backgroundColor: '#ffffff',
  boxShadow: '0 0 calc(0.4 * var(--np-rem)) 0 rgba(0, 0, 0, 0.2)',
  marginTop: 'calc(0.7 * var(--np-rem))',
  maxHeight: 'auto',
  fontSize: 'calc(1.2 * var(--np-rem))',
};

export const customOptionStyle = {
  boxShadow: 'none',
  borderRadius: 'calc(0 * var(--np-rem))',
  fontSize: 'calc(1.2 * var(--np-rem))',
  '& .MuiAutocomplete-popper': {
    boxShadow: 'none',
    borderRadius: 'calc(0 * var(--np-rem))',
  },
};

export const chipPropStyles = {
  '& .MuiChip-deleteIcon': {
    color: '#e4e7ff',
  },
  '&:hover .MuiChip-deleteIcon': {
    color: '#3f4fda',
  },
  '& .MuiAutocomplete-tag': {
    margin: 'calc(0.2 * var(--np-rem))',
  },
  '& .MuiButtonBase-root MuiChip-root .MuiChip-outlined': {
    borderColor: '#3f4fda !important',
    border: '1px solid #3f4fda !important',
  },
};

export const autocompleteStyles = {
  '& input': {
    padding: 'calc(0 * var(--np-rem))',
    margin: 'calc(0 * var(--np-rem))',
  },

  '& .MuiAutocomplete-inputRoot': {
    padding: 'calc(0 * var(--np-rem))',
    margin: 'calc(0 * var(--np-rem))',
    boxShadow: 'none',
    borderRadius: 'calc(0 * var(--np-rem))',
    flex: '1 1 auto',
    color: '#000000',
    fontSize: 'calc(1.2 * var(--np-rem))',
  },

  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: 'calc(0 * var(--np-rem)) calc(0.5 * var(--np-rem)) calc(0 * var(--np-rem)) calc(1.5 * var(--np-rem))',
    width: 'auto',
  },

  '& .MuiAutocomplete-input': {
    padding: 'calc(0 * var(--np-rem))',
    boxShadow: 'none',
    borderRadius: 'calc(0 * var(--np-rem))',
    color: '#000000',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  '& .MuiAutocomplete-endAdornment': {
    margin: 'calc(0.4 * var(--np-rem)) calc(0 * var(--np-rem))',
  },

  '.MuiOutlinedInput-notchedOutline': {
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
};

export const autoCompleteMenuStyles = {
  '& .MuiAutocomplete-listbox': {
    padding: 0,
    margin: 0,

    '& .MuiAutocomplete-option': {
      display: 'flex',
      gap: 'calc(0.5 * var(--np-rem))',
      alignItems: 'center',
      padding: 'calc(0.8 * var(--np-rem)) calc(1.2 * var(--np-rem))',
      fontSize: 'calc(1.2 * var(--np-rem))',
      cursor: 'pointer',

      '&.Mui-disabled': {
        cursor: 'not-allowed !important',
      },

      '&:hover': {
        color: '#3F4FDA',
      },

      '&.Mui-selected': {
        backgroundColor: hexToRGBA('#3F4FDA', 0.2),
        color: '#3F4FDA',

        '&.Mui-focused': {
          backgroundColor: hexToRGBA('#3F4FDA', 0.4),
          color: '#3F4FDA',
        },
        '&.Mui-focusVisible': {
          backgroundColor: hexToRGBA('#3F4FDA', 0.4),
          color: '#3F4FDA',
        },
      },
    },
  },
};
