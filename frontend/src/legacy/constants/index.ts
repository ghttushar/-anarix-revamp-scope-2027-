/* eslint-disable */
// Trimmed from anarix-ui C:\Users\ghttu\Desktop\new-page-old-design\src\constants\index.ts: only what the ported pages use.
import { IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import { Range } from '@legacy/enums/serp.enums';

export const TOAST_AUTO_CLEAR_TIME = 5000;

export const ALL_LABEL = 'All';

export const ALL_VALUE = '';

export const SELECT_ALL = 'Select All';

export const PAGINATION_MODEL = { page: 0, pageSize: 50 };

export const UPDATED_PAGINATION_MODEL = { pageIndex: 0, pageSize: 50 };

export const COGS_DOWNLOAD_TEMPLATE = 'COGS_DOWNLOAD_TEMPLATE';

// Kept here (rather than in advertising-filter.constants.ts) so files like
// profitability.constants.tsx can depend on it without a circular import.
export const customRangeFilterOption: IDropdownItem<Range> = {
  label: 'Custom Range',
  value: Range.CUSTOM_RANGE,
  isCustom: true,
};
