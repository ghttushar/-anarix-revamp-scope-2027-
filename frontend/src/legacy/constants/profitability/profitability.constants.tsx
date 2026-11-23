/* eslint-disable */
// Trimmed from anarix-ui C:\Users\ghttu\Desktop\new-page-old-design\src\constants\profitability\profitability.constants.tsx: only what the ported pages use.
import { IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import { Frequency } from '@legacy/enums/serp.enums';
import { FilterDropdownValue } from '@legacy/enums/filter.enums';

export const ProfitabilityPnLFrequency: IDropdownItem<Frequency>[] = [
  {
    label: 'Days',
    value: Frequency.DAILY,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Weeks',
    value: Frequency.WEEKLY,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Months',
    value: Frequency.MONTHLY,
    isDisabled: false,
    selected: false,
  },
];

export const PURCHASE_STATUS_MAPPING: { [key: string]: string } = {
  [FilterDropdownValue.REFUND_COMPLETED_MAPPED]:
    FilterDropdownValue.REFUND_COMPLETED,
};
