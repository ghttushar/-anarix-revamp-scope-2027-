import { Column } from '@tanstack/react-table';
import { CSSProperties } from 'react';

/** Ported from anarix-ui: only the helper the ported table uses. */
const customTableUtils = {
  getCommonPinningStyles: <T>(
    column: Column<T>,
    isHeader = false,
    isPinFooter = false
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right');

    let zIndex = 0;
    if (isHeader && isPinned) zIndex = 3;
    else if (isHeader && !isPinned) zIndex = 2;
    else if (!isHeader && isPinned) zIndex = 1;
    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned || isHeader || isPinFooter ? 'sticky' : 'inherit',
      width: column.getSize(),
      zIndex,
      bottom: isPinFooter ? 0 : undefined,
    };
  },
};

export default customTableUtils;
