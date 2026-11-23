export const tabsWithoutIndicatorStyles = {
  button: {
    textTransform: 'none',
    textAlign: 'start',
    padding: 0,
    fontSize: 'calc(1.2 * var(--np-rem))',
    fontWeight: 400,

    '&:hover': {
      fontWeight: 500,
    },
  },

  '.MuiTabs-flexContainer': {
    gap: 'calc(1 * var(--np-rem))',
  },

  '.MuiTabs-indicator': {
    display: 'none',
  },

  '.MuiTab-root': {
    color: 'rgba(0, 0, 0, 0.5) !important',
  },

  '.MuiTab-root.Mui-selected': {
    color: '#000000 !important',
    fontWeight: 600,
  },

  '.MuiTabs-scroller': {
    height: 'calc(3.3 * var(--np-rem))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const tabsWithIndicatorStyles = {
  button: {
    textTransform: 'none',
    textAlign: 'start',
    padding: '0 calc(1 * var(--np-rem))',
    fontSize: 'calc(1.2 * var(--np-rem))',
    fontWeight: 400,
    letterSpacing: '-0.02px',

    '&:hover': {
      fontWeight: 500,
    },
  },

  '.MuiTabs-flexContainer': {
    gap: 'calc(1 * var(--np-rem))',
  },

  '.MuiTabs-indicator': {
    height: '2px',
    backgroundColor: '#3f4fda',
  },

  '.MuiTab-root': {
    color: '#232e50 !important',
  },

  '.MuiTab-root.Mui-selected': {
    color: '#3f4fda !important',
    fontWeight: 700,
  },

  '.MuiTabs-scroller': {
    height: '40px',
  },
};

export const tabsNewStyles = (
  isNewDesign: boolean,
  width: string,
  height: string
) => ({
  width: width ?? '100%',
  maxWidth: '100%',
  minHeight: 0,
  padding: '5px',
  backgroundColor: 'rgba(242, 243, 244, 0.2)',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
  borderRadius: 'calc(0.8 * var(--np-rem))',
  overflow: 'hidden',

  '& .MuiTabs-scroller': {
    overflow: 'hidden !important',
  },

  '& .MuiTabs-flexContainer': {
    display: 'flex',
    gap: 'calc(0.5 * var(--np-rem))',
  },

  '& .MuiTabs-indicator': {
    display: 'none',
  },

  '& .MuiTab-root': {
    flex: 1,
    maxWidth: 'none',
    minWidth: 0,
    minHeight: height,
    height,
    textTransform: 'none',
    fontSize: 'calc(1.1 * var(--np-rem))',
    lineHeight: '250%',
    fontWeight: 400,
    borderRadius: 'calc(0.8 * var(--np-rem))',
    transition: 'all 0.25s ease',
    color: '#464646',
    zIndex: 1,

    '&:hover': {
      fontWeight: 700,
    },

    '&.Mui-disabled': {
      fontWeight: 400,
      opacity: '0.6',
      background: '#dadceb',
    },
  },

  '& .Mui-selected': {
    color: '#ffffff !important',
    background: isNewDesign
      ? 'linear-gradient(97.44deg, #6585F9 3.56%, #2A4FF4 100.35%)'
      : 'linear-gradient(99.66deg, #4F5EE5 4.22%, #0218D5 89%)',

    '&:hover': {
      fontWeight: 400,
    },
  },
});
