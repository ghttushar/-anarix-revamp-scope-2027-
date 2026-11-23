import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import { TooltipPlacement } from '@legacy/enums/tooltip-texts.enums';

interface IHoverInfoTooltipProps {
  title: string | ReactElement;
  children: ReactElement<any>;
  position?: TooltipPlacement;
  disableTooltip?: boolean;
  backgroundColor?: string;
  padding?: string;
  fontSize?: string;
}

export default function HoverInfoTooltip(props: IHoverInfoTooltipProps) {
  const {
    title,
    children,
    position,
    disableTooltip = false,
    backgroundColor = '#2F2F35',
    padding = 'calc(1 * var(--np-rem))',
    fontSize = 'calc(1 * var(--np-rem))',
  } = props;

  const BootstrapHoverInfoTooltip = styled((tooltipProps: TooltipProps) => (
    <Tooltip
      {...tooltipProps}
      arrow
      classes={{ popper: tooltipProps.className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: backgroundColor,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor,
      fontSize: fontSize,
      padding: padding,
      borderRadius: 'calc(0.4 * var(--np-rem))',
      maxWidth: 'calc(20 * var(--np-rem))',
      border: `1px solid ${backgroundColor}`,
      boxShadow: '0 calc(0.4 * var(--np-rem)) calc(0.4 * var(--np-rem)) 0 rgba(0, 0, 0, 0.15)',
    },
  }));

  return (
    <BootstrapHoverInfoTooltip
      title={title}
      placement={position ? position : 'top'}
      disableHoverListener={disableTooltip}
    >
      {children}
    </BootstrapHoverInfoTooltip>
  );
}
