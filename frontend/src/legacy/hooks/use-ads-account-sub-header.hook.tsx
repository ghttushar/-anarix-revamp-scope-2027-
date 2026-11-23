import type { IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import CountryFlagLogo from '@legacy/app/components/pages/advertising-page/country-flag-logo-icon';
import { CountryCodeEnum } from '@legacy/enums/advertising.enums';
import { DropdownLabelEnum } from '@legacy/enums/index.enums';
import { MarketplaceEnum } from '@legacy/enums/serp.enums';
import type { IDateRange } from '@legacy/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@legacy/redux/hooks';
import { selectAdvertisingAccount, setAdvertisingAccount } from '@legacy/redux/slices/auth/auth.slice';
import { useSetSubHeader, type ISubHeaderDataItem } from '@legacy/shell/legacy-sub-header';
import { getPrefixElementByMarketplace } from '@legacy/utils/marketplace-logo.utils';
import { useCallback, useEffect } from 'react';

/** A date range shown in the sub-header, in the same row as the Marketplace dropdown and to its left. */
export interface IAdsSubHeaderDateRange {
  item: ISubHeaderDataItem;
  defaultPreset?: IDropdownItem<string>;
  selectedCustomDateRange?: IDateRange;
}

const mockAccount = (label: string, value: string, marketplace: MarketplaceEnum): IDropdownItem<string> => ({
  label,
  value,
  marketplace,
  prefixElement: getPrefixElementByMarketplace(marketplace),
  flagElement: <CountryFlagLogo countryCode={CountryCodeEnum.UnitedStates} />,
});

/** Stand-in advertising accounts (this app has no signed-in accounts), the same two Campaign Creator offers. */
const MOCK_ACCOUNTS: IDropdownItem<string>[] = [
  mockAccount('Boldfit Nutrition (Seller)', 'mock-amazon-boldfit', MarketplaceEnum.AMAZON),
  mockAccount('Northline Outdoors (Seller)', 'mock-walmart-northline', MarketplaceEnum.WALMART),
];

/**
 * anarix-ui's header hook for advertising pages: the page title plus the Marketplace (account) dropdown, and
 * optionally a date range to its left. Returns the selected account. The ad-type dropdown and URL switching it
 * also supported aren't used by the pages ported here.
 */
const useAdsAccountSubHeader = (
  title: string,
  titleTooltip: string,
  _showAdTypeDropdown: boolean,
  _getUrl?: unknown,
  _onChange?: unknown,
  dateRange?: IAdsSubHeaderDateRange,
  marketplaceDisabled = false
) => {
  const dispatch = useAppDispatch();
  const setSubHeader = useSetSubHeader();
  const stored = useAppSelector(selectAdvertisingAccount);
  const selected = stored.value ? stored : MOCK_ACCOUNTS[0];

  const handleSetAdsAccount = useCallback(
    (account: IDropdownItem<string>) => dispatch(setAdvertisingAccount({ selected: account, options: MOCK_ACCOUNTS })),
    [dispatch]
  );

  useEffect(() => {
    if (!stored.value) handleSetAdsAccount(MOCK_ACCOUNTS[0]);
  }, [stored.value, handleSetAdsAccount]);

  useEffect(() => {
    const dropdownOptions: ISubHeaderDataItem[] = [
      {
        selectedItem: selected,
        setSelectedItem: handleSetAdsAccount,
        label: DropdownLabelEnum.MARKETPLACE,
        options: MOCK_ACCOUNTS,
        prefixElement: selected.prefixElement,
        flagElement: selected.flagElement,
        disabled: marketplaceDisabled,
      },
    ];
    if (dateRange) dropdownOptions.unshift(dateRange.item);
    setSubHeader({
      title,
      titleTooltip,
      isDropdownRequired: true,
      goBackButton: false,
      dropdownOptions,
      defaultPreset: dateRange?.defaultPreset,
      selectedCustomDateRange: dateRange?.selectedCustomDateRange,
    });
  }, [title, titleTooltip, selected, handleSetAdsAccount, dateRange, marketplaceDisabled, setSubHeader]);

  return selected;
};

export default useAdsAccountSubHeader;
