import type { MarketplaceEnum } from '@legacy/enums/serp.enums';
import type { ILogsData } from '@legacy/interfaces/logs/logs.interface';
import type { IFinalFilters } from '@legacy/redux/slices/filters/filter.slice';
import type { ILogHeaderFilterForm } from '@legacy/redux/slices/logs/logs.slice';

/**
 * anarix-ui's change-log endpoint. This app has no backend, so it answers with no rows — the Logs page then shows
 * its sample rows, exactly as it does in anarix-ui when the endpoint returns nothing.
 */
const LogsService = {
  getEditLogs: (_filters: IFinalFilters[], _marketplace: MarketplaceEnum, _dateRange: ILogHeaderFilterForm) =>
    Promise.resolve({ data: { data: [] as ILogsData[] } }),
};

export default LogsService;
