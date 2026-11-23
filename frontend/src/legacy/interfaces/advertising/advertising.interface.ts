/* eslint-disable */
// Trimmed from anarix-ui C:\Users\ghttu\Desktop\new-page-old-design\src\interfaces\advertising\advertising.interface.ts: only what the ported pages use.
import { SortOrderEnum } from '@legacy/enums/advertising.enums';

export interface IRadioSelect<T> {
  label: string;
  value: T;
  isDisabled?: boolean;
  selected?: boolean;
  tooltipText?: string;
  description?: string;
}

export interface ISortCriteria {
  columnName: string;
  sortOrder: SortOrderEnum;
}

/** The table footer row is a bag of totals keyed by column. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ITableFooterData = Record<string, any>;
