import { useEffect, useState } from 'react';
import type { IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import CountryFlagLogo from '@legacy/app/components/pages/advertising-page/country-flag-logo-icon';
import { CountryCodeEnum } from '@legacy/enums/advertising.enums';
import { DropdownLabelEnum, PageTitleEnum } from '@legacy/enums/index.enums';
import { MarketplaceEnum } from '@legacy/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@legacy/enums/tooltip-texts.enums';
import { useSetSubHeader } from '@legacy/shell/legacy-sub-header';
import { getPrefixElementByMarketplace } from '@legacy/utils/marketplace-logo.utils';
import type { Marketplace } from './campaign-creator.types';

type OnMarketplace = (marketplace: Marketplace) => void;

const asMarketplace = (m?: string): Marketplace | null => (m === 'amazon' || m === 'walmart' ? m : null);

const mockAccount = (label: string, value: string, marketplace: MarketplaceEnum): IDropdownItem<string> => ({
  label,
  value,
  marketplace,
  prefixElement: getPrefixElementByMarketplace(marketplace),
  flagElement: <CountryFlagLogo countryCode={CountryCodeEnum.UnitedStates} />,
});

/** Stand-in accounts for the prototype (this app has no signed-in advertising accounts). */
const MOCK_ACCOUNTS: IDropdownItem<string>[] = [
  mockAccount('Boldfit Nutrition (Seller)', 'mock-amazon-boldfit', MarketplaceEnum.AMAZON),
  mockAccount('Northline Outdoors (Seller)', 'mock-walmart-northline', MarketplaceEnum.WALMART),
];

/**
 * The Marketplace dropdown in the page header, as on Campaign Manager. Shown on every step but only open while choosing
 * the ad format; the account picked there decides which marketplace's products the creator works with.
 */
export default function MarketplaceHeader({ value, disabled, onMarketplace }: { value: Marketplace | null; disabled: boolean; onMarketplace: OnMarketplace }) {
  const setSubHeader = useSetSubHeader();
  // Starts on the marketplace the creator already has, so coming back to this page keeps the choice.
  const [selected, setSelected] = useState(() => MOCK_ACCOUNTS.find((a) => a.marketplace === value) ?? MOCK_ACCOUNTS[0]);

  useEffect(() => {
    setSubHeader({
      title: PageTitleEnum.CAMPAIGN_CREATOR,
      titleTooltip: PAGE_TITLE_TOOLTIPS.CAMPAIGN_CREATOR,
      isDropdownRequired: true,
      goBackButton: false,
      dropdownOptions: [{
        selectedItem: selected,
        setSelectedItem: setSelected,
        label: DropdownLabelEnum.MARKETPLACE,
        options: MOCK_ACCOUNTS,
        prefixElement: selected.prefixElement,
        flagElement: selected.flagElement,
        disabled,
      }],
    });
    const marketplace = asMarketplace(selected.marketplace);
    if (marketplace) onMarketplace(marketplace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSubHeader, selected, disabled]);

  return null;
}
