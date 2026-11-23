/* eslint-disable */
// Trimmed from anarix-ui src/redux/slices/market-intelligence/sov-filter.slice.ts: only what the ported pages use.
import { IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import { Positions, Range, Frequency } from '@legacy/enums/serp.enums';
import { IDateRange } from '@legacy/interfaces/serp.interface';

export interface ISovFilterForm {
  keyword: IDropdownItem<string>;
  position: IDropdownItem<Positions>;
  range: IDropdownItem<Range>;
  frequency: IDropdownItem<Frequency>;
  customDateRange: IDateRange;
  brandName: IDropdownItem<string>;
}
