/* eslint-disable */
// Trimmed from anarix-ui C:\Users\ghttu\Desktop\new-page-old-design\src\utils\advertising.utils.ts: only what the ported pages use.
import { IFinalFilters, setAppliedFilters, setFilters } from '@legacy/redux/slices/filters/filter.slice';
import { AdvertisingTitlesEnum, SpAccountLevelTitles, SbAccountLevelTitles, SdAccountLevelTitles, OverallAccountLevelTitles, WalmartSPAccountLevelTitles, WalmartSBAccountLevelTitles, WalmartSVAccountLevelTitles, WalmartOverallAccountLevelTitles, SpCampaignLevelTitles, SbCampaignLevelTitles, SdCampaignLevelTitles, WalmartSPCampaignLevelTitles, WalmartSBCampaignLevelTitles, WalmartSVCampaignLevelTitles, SpAdGroupLevelTitles, SbAdGroupLevelTitles, SdAdGroupLevelTitles, WalmartSPAdGroupLevelTitles, WalmartSBAdGroupLevelTitles, WalmartSVAdGroupLevelTitles, AdTypeShort, AdType } from '@legacy/enums/advertising.enums';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { Filters } from '@legacy/enums/filter.enums';
import { isDisabledFilter, syncStoredLsFilters } from './row-filter.utils';
import { ImpactAnalysisTableTitles } from '@legacy/enums/impact-analysis.enums';
import { ConfigurationTableTitlesEnum } from '@legacy/enums/configurations.enum';
import { MonitoringTableTitlesEnum } from '@legacy/enums/monitoring.enum';
import { CatalogTabTitlesEnum } from '@legacy/enums/catalog.enums';
import { DayPartingTitlesEnum } from '@legacy/enums/day-parting.enums';
import { ProfitabilityTableTitlesEnum } from '@legacy/enums/profitability.enums';
import { RulesPageTitleEnum } from '@legacy/enums/rules.enum';
import { MarketplaceEnum } from '@legacy/enums/serp.enums';
import { imageUrls } from '../constants/assets/images.constants';
import { biddingStrategyOptions, advertisingOptionAdTypeAmazon, sdTacticOptions, percentageMetrics, currencyMetrics, numberMetrics, AMAZON_CATALOG_FULFILLMENT_MAPPING, ITEM_CONDITION_REVERSE_MAPPING } from '@legacy/constants/advertising-filter.constants';
import { IProductAdsEligibility } from '@legacy/interfaces/column.interface';
import { WalmartAdTypeEnum } from '@legacy/enums/walmart.enums';
import { displayValue, formatNum, formatStringToTitleCase } from '.';
import { ADS_ELIGIBILITY_MAPPING, BIDDING_STRATEGY_MAPPING, CATALOG_PRIMARY_MAPPINGS, WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS, WALMART_AD_TYPE_MAPPINGS } from '@legacy/constants/advertising-walmart.constants';

export const getSearchPlaceholder = (title: string) => {
  let placeholder = '';
  switch (title) {
    case SpAccountLevelTitles.CAMPAIGNS:
    case SbAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
    case OverallAccountLevelTitles.CAMPAIGNS:
    case ImpactAnalysisTableTitles.CAMPAIGN:
    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS:
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
      placeholder = 'Search by Campaigns';
      break;

    case SpAccountLevelTitles.AD_GROUPS:
    case SpCampaignLevelTitles.AD_GROUPS:
    case SbAccountLevelTitles.AD_GROUP:
    case SbCampaignLevelTitles.AD_GROUP:
    case SdAccountLevelTitles.AD_GROUP:
    case SdCampaignLevelTitles.AD_GROUP:
    case OverallAccountLevelTitles.AD_GROUPS:
    case ImpactAnalysisTableTitles.AD_GROUP:
    case WalmartSPAccountLevelTitles.AD_GROUPS:
    case WalmartSPCampaignLevelTitles.AD_GROUPS:
    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSBCampaignLevelTitles.AD_GROUPS:
    case WalmartSVAccountLevelTitles.AD_GROUPS:
    case WalmartSVCampaignLevelTitles.AD_GROUPS:
    case WalmartOverallAccountLevelTitles.AD_GROUPS:
    case ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING:
      placeholder = 'Search by Ad Groups';
      break;

    case SpAccountLevelTitles.PRODUCT_ADS:
    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SpAdGroupLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS:
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSPCampaignLevelTitles.AD_ITEMS:
    case WalmartSPAdGroupLevelTitles.AD_ITEMS:
    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSBCampaignLevelTitles.AD_ITEMS:
    case WalmartSBAdGroupLevelTitles.AD_ITEMS:
    case WalmartSVAccountLevelTitles.AD_ITEMS:
    case WalmartSVCampaignLevelTitles.AD_ITEMS:
    case WalmartSVAdGroupLevelTitles.AD_ITEMS:
    case WalmartOverallAccountLevelTitles.AD_ITEMS:
      placeholder = 'Search by Product Ads';
      break;

    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.KEYWORD_TARGETING:
    case SbAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case ImpactAnalysisTableTitles.KEYWORDS:
    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
      placeholder = 'Search by Keywords';
      break;

    case 'Keyword_Tracker':
      placeholder = 'Search by Keyword';
      break;

    case SpAccountLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbAccountLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.PRODUCT_TARGETING:
    case SbAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case OverallAccountLevelTitles.PRODUCT_TARGETING:
      placeholder = 'Search by Targeting';
      break;

    case OverallAccountLevelTitles.SEARCH_TERM:
    case SpAccountLevelTitles.SEARCH_TERM:
    case SpCampaignLevelTitles.SEARCH_TERM:
    case SpAdGroupLevelTitles.SEARCH_TERM:
    case SbAccountLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
    case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
      placeholder = 'Search by Search Terms/Targeting';
      break;
    case WalmartSPAccountLevelTitles.SEARCH_TERM:
    case WalmartSPCampaignLevelTitles.SEARCH_TERM:
    case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSBAccountLevelTitles.SEARCH_TERM:
    case WalmartSBCampaignLevelTitles.SEARCH_TERM:
    case WalmartSBAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSVAccountLevelTitles.SEARCH_TERM:
    case WalmartSVCampaignLevelTitles.SEARCH_TERM:
    case WalmartSVAdGroupLevelTitles.SEARCH_TERM:
    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
      placeholder = 'Search by Search Terms';
      break;

    case WalmartSPAccountLevelTitles.PAGE_TYPE:
    case WalmartSPCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
    case WalmartSBCampaignLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PAGE_TYPE:
    case WalmartSVCampaignLevelTitles.PAGE_TYPE:
    case WalmartOverallAccountLevelTitles.PAGE_TYPE:
      placeholder = 'Search by Page Type';
      break;

    case WalmartSPAccountLevelTitles.PLATFORM:
    case WalmartSPCampaignLevelTitles.PLATFORM:
    case WalmartSBAccountLevelTitles.PLATFORM:
    case WalmartSBCampaignLevelTitles.PLATFORM:
    case WalmartSVAccountLevelTitles.PLATFORM:
    case WalmartSVCampaignLevelTitles.PLATFORM:
    case WalmartOverallAccountLevelTitles.PLATFORM:
      placeholder = 'Search by Platform or Campaigns';
      break;

    case SpAccountLevelTitles.AUTO_TARGETING:
    case SpCampaignLevelTitles.AUTO_TARGETING:
    case SpAdGroupLevelTitles.TARGETING:
      placeholder = 'Search by Targeting';
      break;

    case SpCampaignLevelTitles.AUTOMATION_RULES:
    case SbCampaignLevelTitles.AUTOMATION_RULES:
    case SdCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSPCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSBCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSVCampaignLevelTitles.AUTOMATION_RULES:
      placeholder = 'Search by Rules';
      break;

    case 'AMC_Queries':
      placeholder = 'Search by Title';
      break;

    case 'AMC_ExecutedQueries':
      placeholder = 'Search by Execution Name';
      break;

    case 'AMC_ExecutedAudience':
      placeholder = 'Search by Audience Name';
      break;

    case 'AMC_ScheduledWorkflowExecutions':
      placeholder = 'Search by Schedule ID or Workflow ID';
      break;

    case 'Keyword_Action':
      placeholder = 'Search by Search Term, Campaign or AdGroup';
      break;

    case MonitoringTableTitlesEnum.MONITORING_HOME:
    case MonitoringTableTitlesEnum.MONITORING_HISTORY:
      placeholder = 'Search by Task Id / Task Type';
      break;

    case CatalogTabTitlesEnum.WALMART_CATALOG:
      placeholder = 'Search Product Name/Product ID/SKU';
      break;

    case CatalogTabTitlesEnum.AMAZON_CATALOG:
      placeholder = 'Search Product Name/ASIN/SKU/UPC Code';
      break;

    case DayPartingTitlesEnum.DAYPARTING_HISTORY:
      placeholder = 'Search by Job Id';
      break;

    case ProfitabilityTableTitlesEnum.PROFITABILITY_HOME:
      placeholder = 'Search by Order Id/Item Id/Product Name';
      break;

    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS:
      placeholder = 'Search by Item Id/Product Name/SKU';
      break;

    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_TRENDS:
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS:
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS:
      placeholder = 'Search by ASIN/Product Name/SKU';
      break;

    case RulesPageTitleEnum.APPLIED_RULES:
      placeholder = 'Search by Rule Name/ID/Type';
      break;

    default:
      placeholder = 'Search';
      break;
  }

  return placeholder;
};

export const getSPBiddingStrategy = (strategy: string | null) => {
  if (!strategy) return null;
  const biddingStrategy = biddingStrategyOptions.filter(
    (option) => option.value === strategy
  );

  return biddingStrategy[0];
};

export const getAmazonAdType = (type: string) => {
  if (!type) return '-';

  if (
    type?.toUpperCase() === AdTypeShort.SPONSORED_PRODUCTS ||
    type === AdType.SPONSORED_PRODUCTS
  )
    return advertisingOptionAdTypeAmazon[1].label;
  if (
    type?.toUpperCase() === AdTypeShort.SPONSORED_BRANDS ||
    type === AdType.SPONSORED_BRANDS
  )
    return advertisingOptionAdTypeAmazon[2].label;
  if (
    type?.toUpperCase() === AdTypeShort.SPONSORED_DISPLAY ||
    type === AdType.SPONSORED_DISPLAY
  )
    return advertisingOptionAdTypeAmazon[3].label;
  else return '-';
};

export const getSDTactic = (value: string) => {
  if (!value) return '-';

  const tacticLabel = sdTacticOptions.filter(
    (tactic) => tactic.value === value
  )[0]?.label;

  return `${tacticLabel ? tacticLabel : '-'}`;
};

export const getAsinsListStringified = (asins: IProductAdsEligibility[]) => {
  if (!asins || !asins.length) return '-';

  let stringifiedAsins = '';

  asins.forEach((asin, index) => {
    stringifiedAsins +=
      `${asin.asin}  ` +
      `|` +
      ` ${getAdsEligibility(asin.eligibility)}` +
      (index === asins.length - 1 ? '' : ',\n');
  });

  return stringifiedAsins;
};

const isEmptyObject = (object: Record<string, unknown>) => {
  return Object.keys(object).length === 0;
};

// TODO: need to discuss this logic
// export const checkIsEqual = (original: unknown, edited: unknown): boolean => {
//   if (original === edited) {
//     return true;
//   }

//   if (typeof original !== typeof edited) {
//     if (
//       (original === null || original === undefined) &&
//       (edited === null || edited === undefined)
//     ) {
//       return true;
//     }
//     if (typeof original === 'number' && typeof edited === 'string') {
//       return original === Number(edited) && !isNaN(Number(edited));
//     }
//     if (typeof original === 'string' && typeof edited === 'number') {
//       return Number(original) === edited && !isNaN(Number(original));
//     }
//     return false;
//   }

//   if (typeof original === 'object' && original !== null) {
//     const origKeys = Object.keys(original as object);
//     const editKeys = Object.keys(edited as object);

//     if (origKeys.length !== editKeys.length) {
//       return false;
//     }

//     return origKeys.every((key) =>
//       checkIsEqual(
//         (original as Record<string, unknown>)[key],
//         (edited as Record<string, unknown>)[key]
//       )
//     );
//   }

//   return original === edited;
// };
export const checkIsEqual = (
  original: unknown,
  edited: unknown,
  key = ''
): boolean => {
  if (
    (original === null || original === undefined || original === '') &&
    (edited === null || edited === undefined || edited === '')
  ) {
    return true;
  }

  if (Object.is(original, edited)) {
    return true;
  }

  if (typeof original === 'number' && typeof edited === 'number') {
    return isNaN(original) && isNaN(edited);
  }

  if (typeof original !== typeof edited) {
    if (typeof original === 'number' && typeof edited === 'string') {
      return original === Number(edited) && !isNaN(Number(edited));
    }
    if (typeof original === 'string' && typeof edited === 'number') {
      return Number(original) === edited && !isNaN(Number(original));
    }
    return false;
  }

  if (original instanceof Date && edited instanceof Date) {
    return original.getTime() === edited.getTime();
  }

  if (Array.isArray(original) && Array.isArray(edited)) {
    if (original.length !== edited.length) {
      return false;
    }
    return original.every((item, index) => checkIsEqual(item, edited[index]));
  }

  if (typeof original === 'object' && typeof edited === 'object') {
    if (original === null || edited === null) {
      return false;
    }

    const origKeys = Object.keys(original);
    const editKeys = Object.keys(edited);

    if (origKeys.length !== editKeys.length) {
      return false;
    }

    return origKeys.every((key) =>
      checkIsEqual(
        (original as Record<string, unknown>)[key],
        (edited as Record<string, unknown>)[key]
      )
    );
  }

  if (typeof original === 'function' && typeof edited === 'function') {
    return original === edited;
  }

  if (typeof original === 'symbol' && typeof edited === 'symbol') {
    return original === edited;
  }

  return false;
};

export const convertToTitleCase = (str: string | undefined | null) => {
  if (checkIsNull(str)) return '';
  return str?.replace(/\w\S*/g, (txt) => {
    return txt?.charAt(0).toUpperCase() + txt?.substr(1).toLowerCase();
  });
};

export const getWalmartAdType = (adType: string) => {
  if (!adType) return '-';

  switch (adType) {
    case WalmartAdTypeEnum.SPONSORED_PRODUCTS:
      return 'Sponsored Products';
    case WalmartAdTypeEnum.SPONSORED_BRANDS:
      return 'Sponsored Brands';
    case WalmartAdTypeEnum.SPONSORED_VIDEO:
      return 'Sponsored Video';
    default:
      return '-';
  }
};

export const getFormattedMetrics = (
  metric: string | undefined,
  value: number
) => {
  if (!metric) return value;
  let formattedValue: string | number = '';

  if (percentageMetrics.includes(metric)) {
    formattedValue = displayValue(formatNum(value));
  } else if (currencyMetrics.includes(metric)) {
    formattedValue = displayValue(formatNum(value), false);
  } else if (numberMetrics.includes(metric)) {
    formattedValue = formatNum(value, false);
  } else {
    formattedValue = formatNum(value);
  }

  return formattedValue;
};

export const getMappedPageTypeSearchText = (searchText: string) => {
  if (!searchText) return searchText;
  const keys = Object.keys(WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS);
  const matchingKeys = keys.filter((key) =>
    key.toLowerCase().includes(searchText.toLowerCase())
  );
  let mappedSearchText = '';
  if (matchingKeys.length === 1)
    mappedSearchText =
      WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS[matchingKeys[0] || searchText] ??
      searchText;
  else {
    mappedSearchText = matchingKeys
      .map((key) => {
        return WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS[key] ?? key;
      })
      .join(',');
  }
  return mappedSearchText;
};

export const getMappedWalmartAdType = (adType: string) => {
  if (!adType) return adType;
  return WALMART_AD_TYPE_MAPPINGS[adType] ?? adType;
};

export const getMappedCatalogPrimary = (primary: string) => {
  if (!primary) return primary;
  return CATALOG_PRIMARY_MAPPINGS[primary] ?? primary;
};

export const getMappedAdsEligibility = (value: string) => {
  if (!value) return value;
  return ADS_ELIGIBILITY_MAPPING[value] ?? value;
};

export const getMappedBiddingStrategy = (value: string) => {
  return BIDDING_STRATEGY_MAPPING[value] ?? value;
};

export const getMappedAmazonFulfillmentType = (value: string) => {
  return AMAZON_CATALOG_FULFILLMENT_MAPPING[value] ?? value;
};

export const getMappedAmazonItemCondition = (value: string) => {
  return ITEM_CONDITION_REVERSE_MAPPING[value] ?? value;
};

export const getMarketplaceIcon = (marketplace?: string) => {
  if (marketplace === MarketplaceEnum.AMAZON) return imageUrls.amazonLogoIcon;
  else if (marketplace === MarketplaceEnum.WALMART)
    return imageUrls.walmartLogoIcon;
  else return '';
};

export const clearAllFilter = (
  appliedFilters: IFinalFilters[],
  selectedAdvertisingNavTitle: AdvertisingTitlesEnum,
  dispatch: Dispatch<AnyAction>,
  disableFilterConfig?: Filters[],
  initialRows?: Record<string, unknown>[],
  setFilteredRows?: (data: Record<string, unknown>[]) => void,
  isFilterDisabled?: boolean
) => {
  if (isFilterDisabled === true) return;
  const newFilters = appliedFilters.filter((appliedFilter) =>
    isDisabledFilter(appliedFilter.filterKey, disableFilterConfig)
  );
  dispatch(setAppliedFilters(newFilters));
  dispatch(setFilters(newFilters));
  syncStoredLsFilters(
    selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
    newFilters
  );
  if (setFilteredRows) setFilteredRows(initialRows || []);
};

export const checkIsObjectEmpty = (
  obj: Record<any, any> | undefined
): boolean => {
  return obj !== undefined && Object.keys(obj).length <= 0;
};

export const getAdsEligibility = (eligibility: string | null | undefined) => {
  if (eligibility === undefined || eligibility === null) return '-';
  return formatStringToTitleCase(eligibility);
};

export const checkIsNull = (value: any): value is null | undefined | '' => {
  if (typeof value === 'undefined' || value === undefined || value === null)
    return true;

  if (Array.isArray(value)) return value.length === 0;

  if (typeof value === 'object')
    return (
      isEmptyObject(value) ||
      Object.values(value).every(
        (value) => value === undefined || value === null
      )
    );

  if (typeof value === 'number') return Number.isNaN(value);

  return value === '' || value === null || value === undefined;
};

export const getDownloadIconColor = (
  isDownloading: boolean,
  isDisabled: boolean,
  iconColor?: string,
  iconButton?: boolean
): string => {
  if (isDownloading === true || isDisabled === true) {
    return '#dddddd';
  }
  if (iconColor) {
    return iconColor;
  }
  if (iconButton) {
    return '#ffffff';
  }
  return '#464646';
};
