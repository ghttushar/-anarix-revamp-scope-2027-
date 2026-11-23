import Badge, { BadgeOrigin } from '@mui/material/Badge';
import React from 'react';
import { TooltipPlacement } from '@legacy/enums/tooltip-texts.enums';
import { primaryColor } from '../../layout/side-bar/menu-item-component-styles';
import { getCustomBadgeStyles } from './custom-badge-styles';

export interface ICustomBadgeProps {
  badgeContent?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'standard' | 'dot';
  overlap?: 'rectangular' | 'circular';
  anchorOrigin?: BadgeOrigin;
  invisible?: boolean;
  customColor?: string;
  customTextColor?: string;
  fontSize?: string;
  minWidth?: string;
  height?: string;
  isHoverTooltipEnabled?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPlacement;
  className?: string;
  customBadgeStyles?: React.CSSProperties;
}

export default function CustomBadge({
  badgeContent = '',
  children,
  variant = 'standard',
  overlap = 'rectangular',
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  invisible = false,
  customColor = primaryColor,
  customTextColor = '#ffffff',
  fontSize = 'calc(0.75 * var(--np-rem))',
  minWidth = 'calc(1.25 * var(--np-rem))',
  height = 'calc(1.25 * var(--np-rem))',
  className = '',
  customBadgeStyles,
}: ICustomBadgeProps) {
  const isInvisible =
    invisible || badgeContent === undefined || badgeContent === '';
  return (
    <Badge
      badgeContent={badgeContent}
      variant={variant}
      overlap={overlap}
      anchorOrigin={anchorOrigin}
      invisible={isInvisible}
      className={className}
      sx={getCustomBadgeStyles(
        customColor,
        customTextColor,
        fontSize,
        minWidth,
        height,
        customBadgeStyles
      )}
    >
      {children}
    </Badge>
  );
}
