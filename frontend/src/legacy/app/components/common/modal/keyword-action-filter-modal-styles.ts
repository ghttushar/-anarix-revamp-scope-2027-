export const modalBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
  gap: 'calc(1 * var(--np-rem))',
  top: 'calc(42 * var(--np-rem))',
  left: '50%',
  width: 'auto',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #dadceb',
  p: 2,

  '&:focus': {
    outline: 'none',
  },
};

export const applyButtonStyle = {
  backgroundColor: '#3f4fda',
  borderRadius: 'calc(0 * var(--np-rem))',
  height: 'calc(2.5 * var(--np-rem))',
  width: 'auto',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#3f4fda',
    boxShadow: 'none',
  },
  fontSize: 'calc(1.2 * var(--np-rem))',
};

export const modalInputStyle = {
  width: 'calc(15 * var(--np-rem))',
  height: 'calc(3 * var(--np-rem))',
  border: '1px solid #dadceb',
  outline: 'none',
  padding: 'calc(0.5 * var(--np-rem)) calc(1 * var(--np-rem))',
  fontSize: 'calc(1.2 * var(--np-rem))',
  fontWeight: 500,
  textAlign: 'start',
  paddingLeft: 'calc(4 * var(--np-rem))',
} as React.CSSProperties;

export const modalContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'calc(1 * var(--np-rem))',
};

export const modalLabelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#3f4fda',
  padding: '0 calc(1 * var(--np-rem))',
  borderRight: '1px solid #dadceb',
};

export const confirmationCancelButtonStyle = {
  ...applyButtonStyle,
  height: 'calc(2.2 * var(--np-rem))',
  fontSize: 'calc(1 * var(--np-rem))',
  backgroundColor: '#DDDFFF',
  color: '#3F4FDA',
  '&:hover': {
    backgroundColor: '#DDDFFF',
    boxShadow: 'none',
  },
};

export const confirmationApplyButtonStyle = {
  ...applyButtonStyle,
  height: 'calc(2.2 * var(--np-rem))',
  fontSize: 'calc(1 * var(--np-rem))',
  marginRight: 'calc(1 * var(--np-rem))',
};

export const modalChildContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  marginBottom: 'calc(0.5 * var(--np-rem))',
};

export const customBidModalStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  borderRadius: 'calc(0.4 * var(--np-rem))',
  gap: 'calc(0.5 * var(--np-rem))',
  padding: 'calc(2 * var(--np-rem))',
  width: 'calc(28 * var(--np-rem))',
  zIndex: 80,
  top: 'calc(3.8 * var(--np-rem))',
  right: 0,
  boxShadow: '0 0 calc(0.8 * var(--np-rem)) rgba(0, 0, 0, 0.2)',
  textAlign: 'start',
};

export const errMessageStyles: React.CSSProperties = {
  color: '#ff050b',
  fontSize: 'calc(0.8 * var(--np-rem))',
  fontWeight: 600,
  alignSelf: 'end',
  marginTop: 'calc(-0.5 * var(--np-rem))',
};

export const confirmationModalStyle: React.CSSProperties = {
  ...customBidModalStyle,
  border: '1px solid #dadceb',
  width: 'calc(25 * var(--np-rem))',
  right: 'calc(4 * var(--np-rem))',
  top: 'calc(2.4 * var(--np-rem))',
  gap: 'calc(0.4 * var(--np-rem))',
  padding: 'calc(1.2 * var(--np-rem))',
};

export const archiveConfirmationModalStyle: React.CSSProperties = {
  ...confirmationModalStyle,
  left: 'calc(1 * var(--np-rem))',
  top: 'calc(3.2 * var(--np-rem))',
};
