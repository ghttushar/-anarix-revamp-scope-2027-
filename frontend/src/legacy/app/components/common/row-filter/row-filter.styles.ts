import { applyButtonStyle } from '../modal/keyword-action-filter-modal-styles';

export const filterCancelButtonStyle = {
  ...applyButtonStyle,
  height: 'calc(3 * var(--np-rem))',
  fontSize: 'calc(1.2 * var(--np-rem))',
  backgroundColor: '#DDDFFF',
  color: '#3F4FDA',
  '&:hover': {
    backgroundColor: '#DDDFFF',
    boxShadow: 'none',
  },
};

export const filterApplyButtonStyle = {
  ...applyButtonStyle,
  height: 'calc(3 * var(--np-rem))',
  fontSize: 'calc(1.2 * var(--np-rem))',

  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
    pointerEvents: 'initial !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
};

export const signStyles = {
  position: 'absolute',
  color: '#3f4fda',
  padding: '0 calc(1 * var(--np-rem))',
  borderRight: '1px solid #dadceb',
  fontSize: 'calc(1.3 * var(--np-rem))',
  fontWeight: 700,
  marginTop: 'calc(0.4 * var(--np-rem))',
} as React.CSSProperties;

export const textboxNewStyles = {
  borderRadius: 'calc(0.4 * var(--np-rem))',
  width: 'calc(18 * var(--np-rem))',
  border: '1px solid #acacac',
  padding: 'calc(0.5 * var(--np-rem))',
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  background: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 400,
  fontSize: 'calc(1.2 * var(--np-rem))',

  '.MuiOutlinedInput-input': {
    padding: 'calc(0.1 * var(--np-rem))',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },

  '&.Mui-error': {
    border: '0.5px solid #ff050b',
  },
  '&:hover': {
    border: '1px solid #464646 !important',
  },
  '&:active': {
    border: '1px solid #3f4fda !important',
  },
  '&:focus': {
    border: '1px solid #3f4fda !important',
  },
};
