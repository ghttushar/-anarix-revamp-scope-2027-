/* eslint-disable */
// Trimmed from anarix-ui C:\Users\ghttu\Desktop\new-page-old-design\src\utils\profitability.utils.ts: only what the ported pages use.
import { PURCHASE_STATUS_MAPPING } from '@legacy/constants/profitability/profitability.constants';
import { parseNum, displayValue, formatNum } from '.';
import { ProfitabilityMetricsKeyEnums } from '@legacy/enums/profitability.enums';

export const profitabilityUtils = {
  getMappedPurchaseOrder: (status: string) => {
    return PURCHASE_STATUS_MAPPING[status] ?? status;
  },
  getSettlementDetailsForExport: (data: object) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (key.startsWith('settlementDetails.')) {
        const parsedKey = key.split('.').pop();

        if (parsedKey && !(parsedKey in acc) && parseNum(value) !== 0) {
          acc[parsedKey] = isNaN(value)
            ? value
            : parsedKey === ProfitabilityMetricsKeyEnums.MARGIN
            ? displayValue(formatNum(value))
            : displayValue(formatNum(value), false);
        }

        return acc;
      }

      return acc;
    }, {} as Record<string, any>);
  },
};
