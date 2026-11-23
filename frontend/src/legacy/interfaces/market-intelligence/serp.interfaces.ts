import { ISovFilterForm } from '@legacy/redux/slices/market-intelligence/sov-filter.slice';

export interface IStoreMarketIntelligenceFilter {
  filters: ISovFilterForm;
  isInitialFilters: boolean;
}
