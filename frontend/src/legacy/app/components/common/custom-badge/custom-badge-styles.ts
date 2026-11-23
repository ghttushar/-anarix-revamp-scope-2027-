import React from 'react';

export const getCustomBadgeStyles = (
  customColor: string,
  customTextColor: string,
  fontSize: string,
  minWidth: string,
  height: string,
  customStyles?: React.CSSProperties
) => {
  return {
    '& .MuiBadge-badge': {
      backgroundColor: customColor,
      color: customTextColor,
      fontSize: fontSize,
      minWidth: minWidth,
      height: height,
      borderRadius: 'calc(0.5 * var(--np-rem))',
      fontWeight: 500,
      lineHeight: 1,
      border: `1px solid ${customColor}`,
      boxShadow: 'none',
      fontFamily: 'inherit',
      top: 'calc(-0.3 * var(--np-rem))',
      right: 'calc(-0.8 * var(--np-rem))',
      letterSpacing: 'calc(0.04 * var(--np-rem))',
      ...customStyles,
    },
  };
};
