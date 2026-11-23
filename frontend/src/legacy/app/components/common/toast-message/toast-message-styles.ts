export const errorButtonStyles = {
  borderRadius: 'calc(0.5 * var(--np-rem))',
  background: '#ffffff',
  border: `1px solid #dadceb`,
  color: '#464646',
  textTransform: 'none',
  boxShadow: 'none',
  padding: 'calc(0.3 * var(--np-rem))',
  minWidth: 0,
  maxWidth: 'calc(6 * var(--np-rem))',
  height: 'auto',
  width: 'auto',
  fontSize: 'calc(0.8 * var(--np-rem))',
  fontWeight: 400,

  '&:hover': {
    boxShadow: 'none',
    border: '1px solid #464646',
    background: '#ffffff',
  },
};

export const errPopupTitleStyles = {
  m: 0,
  px: 2,
  py: 1,
  fontSize: 'calc(1.4 * var(--np-rem))',
  fontWeight: 600,
  background: '#3F4FDA',
  color: '#ffffff',
};

export const closeIconButtonStyles = {
  p: '2px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'rotate(90deg)',
  },
};

export const dialogContentStyles = {
  p: 2,
  '&.MuiDialogContent-root': {
    pt: 2,
  },
};
