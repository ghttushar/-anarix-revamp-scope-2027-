import 'moment-timezone';
/* eslint-disable */
// Trimmed from anarix-ui C:\Users\ghttu\Desktop\new-page-old-design\src\utils\index.ts: only what the ported pages use.
import { MarketplaceEnum, Range, Frequency } from '@legacy/enums/serp.enums';
import { COGS_DOWNLOAD_TEMPLATE } from '@legacy/constants';
import Papa from 'papaparse';
import moment, { Moment } from 'moment';
import { DATE_FORMAT_9, DATE_FORMAT_10, DATE_FORMAT_11, DATE_FORMAT_18, DATE_FORMAT_19, DATE_FORMAT_3, DATE_FORMAT_13, DATE_FORMAT_7, DATE_FORMAT_8, TIME_FORMAT_4, DATE_FORMAT_17, DATE_FORMAT_5 } from '@legacy/constants/datetime.constants';
import { Nullable } from '@legacy/interfaces/index.interface';
import { imageUrls } from '../constants/assets/images.constants';
import { CountryCodeEnum, SpAccountLevelTitles, SpCampaignLevelTitles, SpAdGroupLevelTitles, OverallAccountLevelTitles, SbAccountLevelTitles, SbCampaignLevelTitles, SbAdGroupLevelTitles, SdAccountLevelTitles, SdCampaignLevelTitles, SdAdGroupLevelTitles, WalmartSPAccountLevelTitles, WalmartSBAccountLevelTitles, WalmartSPCampaignLevelTitles, WalmartSBCampaignLevelTitles, WalmartSPAdGroupLevelTitles, WalmartSBAdGroupLevelTitles, WalmartSVAccountLevelTitles, WalmartSVCampaignLevelTitles, WalmartOverallAccountLevelTitles, WalmartSVAdGroupLevelTitles } from '@legacy/enums/advertising.enums';
import { checkIsNull, checkIsObjectEmpty, convertToTitleCase, getSPBiddingStrategy, getAmazonAdType, getAsinsListStringified, getSDTactic, getWalmartAdType, getFormattedMetrics } from './advertising.utils';
import React from 'react';
import { INDEFINITE, WALMART_INDEFINITE_END_DATE } from '@legacy/constants/advertising-walmart.constants';
import { getFormattedDateWithFormat, checkIsIndefiniteDate, changeDateFormat, checkIsValidDate, parseAsUtcAndConvert, getFormattedTimezoneDate, getTodayByTimeZone, formatYearMonth, formatYearWeek } from './datetime.utils';
import { IDateRange } from '@legacy/interfaces/serp.interface';
import { TimezoneEnum } from '@legacy/enums/timezone.enums';
import { STRING_DELIMITER_REGEX_FORMAT, STRING_DELIMITER_REGEX_WITHOUT_SPACE_FORMAT, ISO_DATE_FORMAT, LEADING_ZERO_REGEX } from '@legacy/constants/regex.constants';
import { WalmartAccountTypeEnum, TargetingTypeEnum } from '@legacy/enums/walmart.enums';
import { percentageMetrics, currencyMetrics, numberMetrics } from '@legacy/constants/advertising-filter.constants';
import { CatalogTabTitlesEnum } from '@legacy/enums/catalog.enums';
import { LogsTitlesEnum } from '@legacy/enums/logs.enums';
import { ProfitabilityTableTitlesEnum, ProfitabilityTableTypeEnum } from '@legacy/enums/profitability.enums';
import { profitabilityUtils } from './profitability.utils';
import { IRegionAccountConfig } from '@legacy/interfaces/advertising/amazon/amazon-advertising.interfaces';
import { RegionAccountConfigs, USAccountConfig } from '@legacy/constants/advertising-amazon-region.constants';
import localStorageUtils from './local-storage/local-storage.utils';

export const getDateString = (timestamp: Date | undefined): string => {
  return moment(timestamp).format(DATE_FORMAT_5);
};

export const formatDateToIDateRange = (
  start: Moment,
  end: Moment
): IDateRange => {
  if (!start || !end)
    return {
      startDate: '',
      endDate: '',
    };
  return {
    startDate: moment(start).format(DATE_FORMAT_3),
    endDate: moment(end).format(DATE_FORMAT_3),
  };
};

export const formatDate = (
  range: string,
  marketplace = MarketplaceEnum.AMAZON,
  timeZone = getTimeZoneByCountry()
): IDateRange => {
  const now = moment().tz(timeZone);

  let start: Moment;
  let end: Moment;

  switch (range) {
    case Range.TODAY:
      start = now.clone().startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.YESTERDAY:
      start = now.clone().subtract(1, 'day').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_7_DAYS:
      start = now.clone().subtract(7, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_14_DAYS:
      start = now.clone().subtract(14, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_21_DAYS:
      start = now.clone().subtract(21, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_30_DAYS:
      start = now.clone().subtract(30, 'days').startOf('day');
      end = now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.THIS_MONTH:
      start = now.clone().startOf('month');
      end =
        now.clone().subtract(1, 'day').month() !==
        now.clone().startOf('month').month()
          ? start
          : marketplace === MarketplaceEnum.AMAZON
          ? now.clone().endOf('day')
          : now.clone().subtract(1, 'day');
      break;
    case Range.LAST_MONTH:
      start = now.clone().subtract(1, 'month').startOf('month');
      end = now.clone().subtract(1, 'month').endOf('month');
      break;
    case Range.LAST_3_MONTHS:
      start = now.clone().subtract(3, 'months').startOf('month');
      end = now.clone().subtract(1, 'month').endOf('month');
      break;
    case Range.THIS_YEAR:
      start = now.clone().startOf('year');
      end =
        now.clone().subtract(1, 'day').year() !==
        now.clone().startOf('year').year()
          ? now.clone().startOf('month')
          : marketplace === MarketplaceEnum.AMAZON
          ? now.clone().endOf('day')
          : now.clone().subtract(1, 'day').endOf('day');
      break;
    case Range.LAST_YEAR:
      start = now.clone().subtract(1, 'year').startOf('year');
      end = now.clone().subtract(1, 'year').endOf('year');
      break;
    case Range.THIS_QUARTER:
      start = now.clone().startOf('quarter');
      end = now.clone();
      break;
    case Range.LAST_QUARTER:
      start = now.clone().subtract(1, 'quarters').startOf('quarter');
      end = now.clone().subtract(1, 'quarters').endOf('quarter');
      break;
    case Range.TWO_QUARTERS_AGO:
      start = now.clone().subtract(2, 'quarters').startOf('quarter');
      end = now.clone().subtract(2, 'quarters').endOf('quarter');
      break;
    case Range.THREE_QUARTERS_AGO:
      start = now.clone().subtract(3, 'quarters').startOf('quarter');
      end = now.clone().subtract(3, 'quarters').endOf('quarter');
      break;
    case Range.THIS_WEEK:
      start = now.clone().startOf('week');
      end = now.clone().endOf('week');
      break;
    case Range.LAST_WEEK:
      start = now.clone().subtract(1, 'week').startOf('week');
      end = now.clone().subtract(1, 'week').endOf('week');
      break;
    case Range.TWO_MONTHS_AGO:
      start = now.clone().subtract(2, 'months').startOf('month');
      end = now.clone().subtract(2, 'months').endOf('month');
      break;
    case Range.THREE_MONTHS_AGO:
      start = now.clone().subtract(3, 'months').startOf('month');
      end = now.clone().subtract(3, 'months').endOf('month');
      break;
    case Range.TWO_DAYS_AGO:
      start = now.clone().subtract(2, 'days').startOf('day');
      end = now.clone().subtract(2, 'days').endOf('day');
      break;
    case Range.THREE_DAYS_AGO:
      start = now.clone().subtract(3, 'days').startOf('day');
      end = now.clone().subtract(3, 'days').endOf('day');
      break;
    case Range.SEVEN_DAYS_AGO:
      start = now.clone().subtract(7, 'days').startOf('day');
      end = now.clone().subtract(7, 'days').endOf('day');
      break;
    case Range.EIGHT_DAYS_AGO:
      start = now.clone().subtract(8, 'days').startOf('day');
      end = now.clone().subtract(8, 'days').endOf('day');
      break;
    case Range.THIRTY_DAYS_AGO:
      start = now.clone().subtract(30, 'days').startOf('day');
      end = now.clone().subtract(30, 'days').endOf('day');
      break;
    case Range.TWO_WEEKS_AGO:
      start = now.clone().subtract(2, 'weeks').startOf('week');
      end = now.clone().subtract(2, 'weeks').endOf('week');
      break;
    case Range.THREE_WEEKS_AGO:
      start = now.clone().subtract(3, 'weeks').startOf('week');
      end = now.clone().subtract(3, 'weeks').endOf('week');
      break;
    case Range.LAST_3_DAYS:
      start = now.clone().subtract(3, 'days').startOf('day');
      end = now.clone().subtract(1, 'days').endOf('day');
      break;
    case Range.LAST_28_DAYS:
      start = now.clone().subtract(28, 'days').startOf('day');
      end = now.clone().subtract(1, 'days').endOf('day');
      break;
    case Range.LAST_31_DAYS:
      start = now.clone().subtract(31, 'days').startOf('day');
      end = now.clone().subtract(1, 'days').endOf('day');
      break;
    case Range.LAST_3_DAYS_FROM_TODAY:
      start = now.clone().subtract(3, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_7_DAYS_FROM_TODAY:
      start = now.clone().subtract(7, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_30_DAYS_FROM_TODAY:
      start = now.clone().subtract(30, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_180_DAYS_FROM_TODAY:
      start = now.clone().subtract(180, 'days').startOf('day');
      end = now.clone().endOf('day');
      break;
    case Range.LAST_6_MONTHS:
      start = now.clone().subtract(6, 'months').startOf('month');
      end = now.clone().subtract(1, 'month').endOf('month');
      break;

    default:
      start = moment();
      end = moment();
  }

  return formatDateToIDateRange(start, end);
};

export const formatDisplayRange = (
  dateRange: IDateRange,
  toFormat = DATE_FORMAT_19,
  isNoEndDateChecked = false
) => {
  if (dateRange.endDate === dateRange.startDate)
    return `${changeDateFormat(dateRange.startDate, DATE_FORMAT_3, toFormat)}`;
  return `${changeDateFormat(dateRange.startDate, DATE_FORMAT_3, toFormat)} - 
     ${
       isNoEndDateChecked
         ? 'No End Date'
         : !dateRange.endDate
         ? 'No Date Selected'
         : dateRange.endDate &&
           changeDateFormat(dateRange.endDate, DATE_FORMAT_3, toFormat)
     }`;
};

export function hexToRGBA(hex: string, alpha: number) {
  if (alpha < 0 || alpha > 1) return;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = alpha || 1;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const formatNum = (
  num: number | string | null | undefined,
  isFraction = !Number.isInteger(Number(num))
): number | string => {
  const value = Number(num);
  if (isNaN(value) || num === undefined || num === null) {
    return '-';
  }
  const semiFormattedValue = parseFloat(value.toFixed(2));
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(semiFormattedValue);
};

export const reverseFormattedNumToNumber = (formattedNum: string | number) => {
  if (typeof formattedNum === 'number') return formattedNum;

  const parts = new Intl.NumberFormat('en-US').formatToParts(12345.6);
  const group = parts.find((part) => part.type === 'group')?.value || ',';
  const decimal = parts.find((part) => part.type === 'decimal')?.value || '.';

  const normalizedNum = formattedNum
    .replace(new RegExp(`\\${group}`, 'g'), '')
    .replace(new RegExp(`\\${decimal}`), '.');

  return parseFloat(normalizedNum);
};

export const getCurrentDateTime = () => {
  const currentDateTime = getDateString(new Date(getTodayByTimeZone())).split(
    ' '
  );
  const currentTime = currentDateTime[1].split(':').join('-');
  return `${currentDateTime[0]}_${currentTime}`;
};

export const parseNum = (num: unknown) => {
  const value = Number(num);
  if (isNaN(value)) return 0;

  return value;
};

export const getDateRangeText = (startDate: string, endDate: string) => {
  let formattedRange = '';

  const startMonth = moment(startDate).format(DATE_FORMAT_9);
  const endMonth = moment(endDate).format(DATE_FORMAT_9);
  const _startDate = moment(startDate).format(DATE_FORMAT_10);
  const _endDate = moment(endDate).format(DATE_FORMAT_10);
  const startYear = moment(startDate).format(DATE_FORMAT_11);
  const endYear = moment(endDate).format(DATE_FORMAT_11);

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      if (_startDate === _endDate) {
        formattedRange = `${startMonth} ${_startDate}, ${startYear}`;
      } else {
        formattedRange = `${endMonth} ${_startDate}-${_endDate}, ${endYear}`;
      }
    } else {
      formattedRange = `${_startDate} ${startMonth}-${_endDate} ${endMonth}, ${endYear}`;
    }
  } else {
    formattedRange = `${_startDate} ${startMonth}, ${startYear}-${_endDate} ${endMonth}, ${endYear}`;
  }

  return `${formattedRange}`;
};

export const formatDataToDownload = <T extends Record<string, any>>(
  data: T[],
  disableFormatting = false
) => {
  if (disableFormatting) return data;
  const formattedData = data.map((instance) => {
    const formattedInstance: any = { ...instance };
    Object.keys(instance).forEach((key) => {
      const value = instance[key];
      if (value === null || value === '') {
        formattedInstance[key] = '-';
      } else if (typeof value === 'boolean') {
        formattedInstance[key] = `${value}`;
      }
      // TODO: will be needed later
      // else if (Array.isArray(value)) {
      //   formattedInstance[key] =
      // } else if (typeof value === 'object' && !Array.isArray(value)) {
      //   formattedInstance[key] =
      // }
      else if (isNaN(Number(value))) {
        if (typeof value === 'string') {
          formattedInstance[key] = value.replace(/"/g, '');
        } else {
          formattedInstance[key] = value;
        }
      } else {
        if (percentageMetrics.includes(key)) {
          formattedInstance[key] = displayValue(formatNum(value), true);
        } else if (currencyMetrics.includes(key)) {
          formattedInstance[key] = displayValue(formatNum(value), false);
        } else if (numberMetrics.includes(key)) {
          formattedInstance[key] = formatNum(value, false);
        } else {
          formattedInstance[key] = value;
        }
      }
    });
    return formattedInstance;
  });
  return formattedData;
};

export const parseDataBasedOnTargetingType = <T extends Record<string, any>>(
  data: T,
  isManual?: boolean,
  isAccountLevel?: boolean
) => {
  if (isAccountLevel) {
    return {
      'Item ID': data.itemId,
      'Product Name': data.itemName,
      'Product SKU': data.sku,
      Keyword: data.keyword,
      'Keyword ID': data.keywordId,
      'Match Type': data.matchType,
    };
  } else {
    if (isManual === true) {
      return {
        Keyword: data.keyword,
        'Keyword ID': data.keywordId,
        'Match Type': data.matchType,
      };
    }
    return {
      'Item ID': data.itemId,
      'Product Name': data.itemName,
      'Product SKU': data.sku,
    };
  }
};

export const parseAmazonMetricsExportData = <T extends Record<string, any>>(
  data: T
) => {
  const parsedMetrics = {
    Impressions: data.impressions,
    Clicks: data.clicks,
    CTR: data.ctr,
    'Units Sold': data.unitsSold,
    CVR: data.cvr,
    CPC: data.cpc,
    'Ad Spend': data.adSpend,
    'Ad Sales': data.adSales,
    ROAS: data.roas,
    ACOS: data.acos,
  };

  return parsedMetrics;
};

export const parseWalmartInstoreMetricsExportData = <
  T extends Record<string, any>
>(
  data: T
) => {
  const parsedMetrics = {
    'In-Store Attributes Sales': data.inStoreAttributedSales,
    'In-Store Advertised Sales': data.inStoreAdvertisedSales,
    'In-Store Other Sales': data.inStoreOtherSales,
    'In-Store Units Sold': data.inStoreUnitsSold,
    'In-Store Orders': data.inStoreOrders,
    'Omnichannel Sales': data.omniChannelSales,
    'Omnichannel ROAS': data.omniChannelRoas,
  };
  return parsedMetrics;
};

export const parseWalmartMetricsExportData = <T extends Record<string, any>>(
  data: T
) => {
  const parsedMetrics = {
    Impressions: data.impressions,
    Clicks: data.clicks,
    CTR: data.ctr,
    'Ad Units': data.unitsSold,
    'Ad Orders': data.adOrders,
    'CVR (Units Based)': data.cvrUnitsSoldBased,
    'CVR (Orders Based)': data.cvrOrdersSoldBased,
    CPC: data.cpc,
    'Ad Spend': data.adSpend,
    'Ad Sales': data.adSales,
    'Advertised SKU Sales': data.advertisedSkuSales,
    'Other SKU Sales': data.otherSkuSales,
    'Advertised SKU Units': data.advertisedSkuUnits,
    'Other SKU Units': data.otherSkuUnits,
    ROAS: data.roas,
    ACOS: data.acos,
    'NTB Units': data.ntbUnits,
    'NTB Orders': data.ntbOrders,
    'NTB Sales': data.ntbSales,
    'Percent NTB Units': data.percentNtbUnits,
    'Percent NTB Orders': data.percentNtbOrders,
    'Percent NTB Sales': data.percentNtbSales,
  };

  return parsedMetrics;
};

export const parseWalmartVideoMetricsExportData = <
  T extends Record<string, any>
>(
  data: T
) => {
  const parsedMetrics = {
    'Complete View Ad Orders': data.completeViewOrders,
    'Complete View Ad Units': data.completeViewAdUnits,
    'Video Complete Views': data.videoCompleteViews,
    'Video First Quartile Views': data.videoFirstQuartileViews,
    'Video Impressions': data.videoImpressions,
    'Video Midpoint Views': data.videoMidpointViews,
    'Video Third Quartile Views': data.videoThirdQuartileViews,
    'Video Unmutes': data.videoUnmutes,
    'Video 5 Second Views': data.video5SecondViews,
    'Viewable Impressions': data.viewableImpressions,
    'View-Through Ad Orders': data.viewThroughAdOrders,
    'View-Through Ad Sales': data.viewThroughAdSales,
    'View-Through Ad Units': data.viewThroughAdUnits,
    'Complete View Ad Sales': data.completeViewAdSales,
    'Other Complete View Ad Sales': data.otherCompleteViewAdSales,
    VTR: data.vtr,
    vCTR: data.vctr,
    'Video 5 Second View Rate': data.video5SecondViewRate,
  };

  return parsedMetrics;
};

export const getTitleCaseString = (str: string | undefined | null): string => {
  if (!str) return '-';
  let formattedStr = str;

  const checkUnderscore = formattedStr.includes('_');
  if (checkUnderscore) formattedStr = str.split('_').join(' ');

  const strArray = formattedStr.split(' ');
  const formattedStrArray: string[] = [];

  strArray.forEach((str) => {
    if (str) {
      str = str[0]?.toUpperCase() + str.slice(1)?.toLowerCase();
      formattedStrArray.push(str);
    }
  });

  if (!formattedStrArray.length) return '-';
  return formattedStrArray.join(' ');
};

export const parseTableExportData = <T extends Record<string, any>>(
  data: T[],
  title: string,
  accountType?: string,
  marketplace?: MarketplaceEnum
) => {
  if (data.length) {
    const parsedExportData = data.map((instance) => {
      let parsedInstanceData: Record<string, any> = {};

      switch (title) {
        case SpAccountLevelTitles.CAMPAIGNS: {
          const biddingStrategy = getSPBiddingStrategy(
            instance.dynamicBidding?.strategy
          );
          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: `${displayValue(
              formatNum(instance.budget?.budget),
              false
            )}`,
            'Out of Budget Time': `${
              instance.outOfBudgetTime === '-' ||
              instance.outOfBudgetTime === undefined
                ? '-'
                : changeDateFormat(
                    instance.outOfBudgetTime,
                    DATE_FORMAT_7,
                    DATE_FORMAT_8
                  )
            }`,
            'Dynamic Bidding':
              biddingStrategy !== null &&
              biddingStrategy !== undefined &&
              Object.keys(biddingStrategy)?.length
                ? biddingStrategy.label
                : instance.dynamicBidding?.strategy,
            ...parseAmazonMetricsExportData(instance),
          };

          break;
        }

        case SpAccountLevelTitles.AD_GROUPS:
        case SpCampaignLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.status),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Default Bid': instance.defaultBid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.PRODUCT_ADS:
        case SpCampaignLevelTitles.PRODUCT_ADS:
        case SpAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Item Name': instance.itemName,
            ASIN: instance.asin,
            'Ads Eligibility': instance.eligibility,
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Listing Price': instance.listingPrice,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.KEYWORD_TARGETING:
        case SpCampaignLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.PRODUCT_TARGETING:
        case SpCampaignLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.AUTO_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            Expression: instance.expression
              ?.map((exp: any) => exp.type)
              .join(' | '),
            'Expression Type': instance.expressionType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
        case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Match type': instance.matchType,
          };
          break;

        case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
        case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
          parsedInstanceData = {
            Targeting: instance.targeting,
            asin: instance.asin,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
          };
          break;

        case SpAccountLevelTitles.SEARCH_TERM:
        case SpCampaignLevelTitles.SEARCH_TERM:
        case SpAdGroupLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            Targeting: instance.targeting,
            'Keyword ID': instance.keywordId,
            'Match type': instance.matchType,
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAdGroupLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance.keywordAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAdGroupLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAdGroupLevelTitles.TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            Expression: instance.expression
              ?.map((exp: any) => exp.type)
              .join(' | '),
            'Expression Type': instance.expressionType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpCampaignLevelTitles.AUTO_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Targeting Type': getTitleCaseString(instance.targetingType),
            Expression: instance.expression
              ?.map((exp: any) => exp.type)
              .join(' | '),
            'Expression Type': instance.expressionType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SpAccountLevelTitles.PLACEMENT:
        case SpCampaignLevelTitles.PLACEMENT: {
          const biddingStrategy = getSPBiddingStrategy(
            instance.dynamicBidding?.strategy ?? null
          );
          parsedInstanceData = {
            Placement: instance.placement || '-',
            'Bid Adjustment': displayValue(formatNum(instance.percentage)),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': getTitleCaseString(instance.status) || '-',
            'Dynamic Bidding':
              biddingStrategy !== null &&
              biddingStrategy !== undefined &&
              Object.keys(biddingStrategy)?.length
                ? biddingStrategy.label
                : instance.dynamicBidding?.strategy,
            ...parseAmazonMetricsExportData(instance),
          };
          break;
        }

        case OverallAccountLevelTitles.CAMPAIGNS: {
          const biddingStrategy = getSPBiddingStrategy(instance.strategy);

          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Ad Type': getAmazonAdType(instance.adType),
            'Targeting Type': getTitleCaseString(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: instance.budget,
            'Dynamic Bidding': biddingStrategy?.label || '-',
            ...parseAmazonMetricsExportData(instance),
          };

          break;
        }

        case OverallAccountLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.adGroupStatus),
            'Ad Type': getAmazonAdType(instance.adType),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Default Bid': instance.defaultBid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Item Name': instance.itemName || '-',
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            ASIN: instance.asin || '-',
            'Ads Eligibility': instance.eligibility,
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Listing Price': instance.listingPrice,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case OverallAccountLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            Targeting: instance.targeting,
            'Keyword ID': instance.keywordId,
            'Keyword Status': getTitleCaseString(instance.keywordStatus),
            'Match type': instance.matchType,
            'Ad Type': getAmazonAdType(instance.adType),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.CAMPAIGNS: {
          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: instance.budget,
            'Budget Type': getTitleCaseString(instance.budgetType),
            'Cost Type': instance.costType || '-',
            ...parseAmazonMetricsExportData(instance),
          };

          break;
        }

        case SbAccountLevelTitles.AD_GROUP:
        case SbCampaignLevelTitles.AD_GROUP:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.status),
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.PRODUCT_ADS:
        case SbCampaignLevelTitles.PRODUCT_ADS:
        case SbAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Ad Name': instance.name,
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            'Creative Asins': getAsinsListStringified(instance.asinEligibility),
            'Landing Page': instance.landingPage?.url || '-',
            'Landing Page Type': instance.landingPage?.pageType || '-',
            'Serving Status': instance.extendedData?.servingStatus || '-',
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.KEYWORD_TARGETING:
        case SbCampaignLevelTitles.KEYWORD_TARGETING:
        case SbAdGroupLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance.keywordAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbAccountLevelTitles.PRODUCT_TARGETING:
        case SbCampaignLevelTitles.PRODUCT_TARGETING:
        case SbAdGroupLevelTitles.PRODUCT_TARGETING:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            Bid: instance.bid,
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
        case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
          parsedInstanceData = {
            'Keyword Text': instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Match type': instance.matchType,
          };
          break;

        case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
        case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
          parsedInstanceData = {
            Targeting: instance.targeting,
            'Target ID': instance.targetId,
            Status: getTitleCaseString(instance.status),
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
          };
          break;

        case SbAccountLevelTitles.SEARCH_TERM:
        case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
        case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            Targeting: instance.keywordText,
            'Keyword ID': instance.keywordId,
            'Keyword Status': getTitleCaseString(instance.keywordStatus),
            'Match type': instance.matchType,
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SdAccountLevelTitles.CAMPAIGN:
          parsedInstanceData = {
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: getTitleCaseString(instance.status),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'No Date'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            Budget: instance.budget,
            'Cost Type': instance.costType || '-',
            Tactic: getSDTactic(instance.tactic),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SdAccountLevelTitles.AD_GROUP:
        case SdCampaignLevelTitles.AD_GROUP:
          parsedInstanceData = {
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            Status: getTitleCaseString(instance.status),
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Default Bid': instance.defaultBid,
            'Bid Optimization': getTitleCaseString(instance.bidOptimization),
            Tactic: getSDTactic(instance.tactic),
            'Creative Type': getTitleCaseString(instance.creativeType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case SdAccountLevelTitles.PRODUCT_ADS:
        case SdCampaignLevelTitles.PRODUCT_ADS:
        case SdAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            'Ad Name': instance.adName || '-',
            'Ad ID': instance.adId,
            Status: getTitleCaseString(instance.status),
            ASIN: instance.asin || '-',
            'Ads Eligibility': instance.eligibility,
            'Landing Page': instance.landingPageURL || '-',
            'Landing Page Type': instance.landingPageType || '-',
            'AdGroup Name': instance.adGroupName || '-',
            'AdGroup ID': instance.adGroupId || '-',
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName || '-',
            'Campaign ID': instance.campaignId || '-',
            'Campaign Status': instance.campaignStatus || '-',
            'Listing Price': instance.listingPrice,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.CAMPAIGNS:
        case WalmartSBAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: convertToTitleCase(instance.status),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'Not set'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            'Daily Budget': instance.dailyBudget,
            'Total Budget': instance.totalBudget,
            'Avg. Cap out time': `${
              checkIsValidDate(instance.dailyOutOfBudgetDatetime)
                ? `${parseAsUtcAndConvert(
                    instance.dailyOutOfBudgetDatetime,
                    TIME_FORMAT_4
                  )} PST`
                : '-'
            }`,
            'Suggested Daily Budget': instance.suggestedLatestDailyBudget,
            'Suggested Total Budget': instance.suggestedLatestTotalBudget,
            ...parseWalmartMetricsExportData(instance),
          };
          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };

          break;

        case WalmartSPAccountLevelTitles.AD_GROUPS:
        case WalmartSPCampaignLevelTitles.AD_GROUPS:
        case WalmartSBAccountLevelTitles.AD_GROUPS:
        case WalmartSBCampaignLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            Status: convertToTitleCase(instance.status),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.AD_ITEMS:
        case WalmartSPCampaignLevelTitles.AD_ITEMS:
        case WalmartSPAdGroupLevelTitles.AD_ITEMS:
        case WalmartSBAccountLevelTitles.AD_ITEMS:
        case WalmartSBCampaignLevelTitles.AD_ITEMS:
        case WalmartSBAdGroupLevelTitles.AD_ITEMS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Product Name': instance.itemName,
            'Product ID': instance.itemId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Product Bid': instance.bid,
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Product Automation': convertToTitleCase(
              instance.productAutomation || 'No'
            ),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            Keyword: instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            Bid: instance.bid,
            'Match Type': convertToTitleCase(instance.matchType),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance?.keywordAutomation ?? 'No'
            ),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.PAGE_TYPE:
        case WalmartSPCampaignLevelTitles.PAGE_TYPE:
        case WalmartSBAccountLevelTitles.PAGE_TYPE:
        case WalmartSBCampaignLevelTitles.PAGE_TYPE:
        case WalmartSVAccountLevelTitles.PAGE_TYPE:
        case WalmartSVCampaignLevelTitles.PAGE_TYPE:
        case WalmartOverallAccountLevelTitles.PAGE_TYPE:
          parsedInstanceData = {
            'Page Type': instance.pageType,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Bid Multiplier': instance.multiplier,
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.PLATFORM:
        case WalmartSPCampaignLevelTitles.PLATFORM:
        case WalmartSBAccountLevelTitles.PLATFORM:
        case WalmartSBCampaignLevelTitles.PLATFORM:
        case WalmartSVAccountLevelTitles.PLATFORM:
        case WalmartSVCampaignLevelTitles.PLATFORM:
        case WalmartOverallAccountLevelTitles.PLATFORM:
          parsedInstanceData = {
            Platform: instance.platform,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Bid Multiplier': instance.multiplier,
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.CAMPAIGNS:
        case WalmartOverallAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            Status: convertToTitleCase(instance.status),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Start Date': moment(instance.startDate).format(DATE_FORMAT_13),
            'End Date':
              instance.endDate === '-' || instance.endDate === undefined
                ? 'Not set'
                : moment(instance.endDate).format(DATE_FORMAT_13),
            'Daily Budget': instance.dailyBudget,
            'Total Budget': instance.totalBudget,
            'Avg. Cap out time': `${
              checkIsValidDate(instance.dailyOutOfBudgetDatetime)
                ? `${parseAsUtcAndConvert(
                    instance.dailyOutOfBudgetDatetime,
                    TIME_FORMAT_4
                  )} PST`
                : '-'
            }`,
            'Suggested Daily Budget': instance.suggestedLatestDailyBudget,
            'Suggested Total Budget': instance.suggestedLatestTotalBudget,
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };
          break;

        case WalmartSVAccountLevelTitles.AD_GROUPS:
        case WalmartSVCampaignLevelTitles.AD_GROUPS:
        case WalmartOverallAccountLevelTitles.AD_GROUPS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            Status: convertToTitleCase(instance.status),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.AD_ITEMS:
        case WalmartSVCampaignLevelTitles.AD_ITEMS:
        case WalmartSVAdGroupLevelTitles.AD_ITEMS:
        case WalmartOverallAccountLevelTitles.AD_ITEMS:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            'Product Name': instance.itemName,
            'Product ID': instance.itemId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            'Product Bid': instance.bid,
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            'Advertiser ID': instance.advertiserId,
            Keyword: instance.keywordText,
            'Keyword ID': instance.keywordId,
            Status: convertToTitleCase(instance.status),
            'Ad Group Name': instance.adGroupName,
            'Ad Group ID': instance.adGroupId,
            'Ad Group Status': convertToTitleCase(instance.adGroupStatus),
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': convertToTitleCase(instance.campaignStatus),
            Bid: instance.bid,
            'Match Type': convertToTitleCase(instance.matchType),
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            'Max Bid': instance.maxBid,
            'Min Bid': instance.minBid,
            TROAS: instance.troas,
            'Bidder Status': convertToTitleCase(instance.bidderStatus),
            'Keyword Automation': convertToTitleCase(
              instance.keywordAutomation || 'No'
            ),
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          break;

        case WalmartSPCampaignLevelTitles.SEARCH_TERM:
        case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            ...parseDataBasedOnTargetingType(
              instance,
              instance.targetingType === TargetingTypeEnum.MANUAL
            ),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.SEARCH_TERM:
        case WalmartOverallAccountLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            'Search Term': instance.searchTerm,
            ...parseDataBasedOnTargetingType(instance, false, true),
            'AdGroup Name': instance.adGroupName,
            'AdGroup ID': instance.adGroupId,
            'AdGroup Status': instance.adGroupStatus || '-',
            'Campaign Name': instance.campaignName,
            'Campaign ID': instance.campaignId,
            'Campaign Status': instance.campaignStatus || '-',
            'Ad Type': getWalmartAdType(instance.adType),
            'Targeting Type': convertToTitleCase(instance.targetingType),
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case CatalogTabTitlesEnum.WALMART_CATALOG:
          parsedInstanceData = {
            SKU: instance.sku,
            'Item ID': `${instance.itemId}`,
            'Item Name': instance.productName,
            'Fulfillment Type': instance.fulfillmentType,
            'Primary Variant': instance.primaryVariant,
            'Publish Status': instance.publishStatus,
            'Buy Box': instance.buyBox,
            LQS: instance.lqs,
            Reviews: instance.reviews,
            Ratings: instance.ratings,
            'Category Path': instance.categoryPath,
            'Inventory Count': instance.availToSellQuantity,
            'Inventory Value COGS': instance.inventoryValueCogs,
            'Inventory Value Retail': instance.inventoryValueRetail,
            Price: instance.price,
            COGS: instance.cogs,
            'Total Sales': instance.totalSales,
            GMV: instance.grossSales,
            'Commission/Walmart Fee': instance.commission,
            'GMV Commission': instance.gmvCommission,
            'Gross Margin': instance.grossMargin,
            'Gross Margin %': instance.grossMarginPercentage,
            'Total Units': instance.totalUnits,
            'Gross Units Sold': instance.grossUnitsSold,
            'Refund Orders': instance.refundOrders,
            'Refund Sales': instance.refundSales,
            'Cancelled Orders': instance.cancelledOrders,
            'Cancelled Sales': instance.cancelledSalesPrice,
            Returns: instance.returns,
            'Promo Spend': instance.promoSpend,
            Impressions: instance.impressions,
            Clicks: instance.clicks,
            CTR: instance.ctr,
            'CVR Order Based': instance.cvrOrderBased,
            'CVR Units Based': instance.cvrUnitSoldBased,
            'Ad Units': instance.unitsSold,
            'Ad Orders': instance.adOrders,
            'Ad Spend': instance.adSpend,
            'Ad Sales': instance.adSales,
            CPC: instance.cpc,
            RoAS: instance.roas,
            ACoS: instance.acos,
            TACoS: instance.tacos,
            'Is Advertised?': instance.isAdvertised,
            Campaigns: instance.campaigns,
          };
          break;

        case CatalogTabTitlesEnum.AMAZON_CATALOG: {
          parsedInstanceData = { ...instance };

          break;
        }

        case LogsTitlesEnum.LOGS_HOME:
          parsedInstanceData = {
            Level: instance.editedLevel,
            'Action Type': instance.actionType.type,
            From: instance.from,
            To: instance.to,
            'Updated Time': getFormattedTimezoneDate(
              instance.timestamp,
              DATE_FORMAT_17
            ),
            User: instance.userName,
          };
          break;

        case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL: {
          const { settlementDetails, ...rest } = instance;

          parsedInstanceData = {
            'Parameter/Date': rest.label,
            ...rest.dateValues,
            Total: rest.value,
          };
          break;
        }
        case ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS: {
          parsedInstanceData = {
            'Product Name': instance.productName,
            'Product Price': displayValue(instance.productPrice, false),
            [`${marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'ItemId'}`]:
              instance.id,
            SKU: instance.sku,
            ...instance.dateValues,
            Total: getFormattedMetrics(instance.metricKey, instance.totalValue),
          };
          break;
        }
        case ProfitabilityTableTypeEnum.AMAZON_PRODUCTS: {
          const {
            id,
            childItems,
            settlementDetails,
            asin,
            sku,
            itemName,
            overallAdSpend,
            overallAdSales,
            overallAdUnits,
            overallOrganicSales,
            overallOrganicUnits,
            totalSales,
            totalUnitsSold,
            totalReturns,
            refundPercentage,
            cogs,
            promotion,
            netProfit,
            estimatedPayout,
            roi,
            margin,
            itemPrice,
            tacos,
            roas,
            acos,
            overallSpAdSpend,
            overallSbAdSpend,
            overallSdAdSpend,
            overallSpAdSales,
            overallSbAdSales,
            overallSdAdSales,
            overallSpAdUnits,
            overallSbAdUnits,
            overallSdAdUnits,
            totalCogs,
            ...rest
          } = instance;

          const normalizedSettlementKeys =
            profitabilityUtils.getSettlementDetailsForExport(rest);

          parsedInstanceData = {
            'Parent Asin': id,
            ASIN: asin,
            SKU: sku,
            'Product Name': itemName,
            Price: itemPrice,
            COGS: totalCogs,
            'Overall Ad Spend': overallAdSpend,
            'Overall Ad Sales': overallAdSales,
            'Overall Ad Units': overallAdUnits,
            'Total Sales': totalSales,
            'Units Sold': totalUnitsSold,
            'Overall Organic Sales': overallOrganicSales,
            'Overall Organic Units': overallOrganicUnits,
            'Return Units': totalReturns,
            '% Returns': refundPercentage,
            tacos,
            roas,
            acos,
            Promotion: promotion,
            Margin: margin,
            ROI: roi,
            'Net Profit': netProfit,
            'Est. Payout': estimatedPayout,
            overallSpAdSpend,
            overallSbAdSpend,
            overallSdAdSpend,
            overallSpAdSales,
            overallSbAdSales,
            overallSdAdSales,
            overallSpAdUnits,
            overallSbAdUnits,
            overallSdAdUnits,
            ...normalizedSettlementKeys,
          };
          break;
        }

        case ProfitabilityTableTypeEnum.AMAZON_ORDERS: {
          const {
            orderId,
            orderStatus,
            productName,
            sku,
            orderDate,
            orderItemId,
            orderUnits,
            principalAmount,
            totalReturnUnits,
            totalCogs,
            promotion,
            netProfit,
            estimatedPayout,
            settlementDetails,
            items,
            asin,
            ...rest
          } = instance;
          const normalizedSettlementKeys =
            profitabilityUtils.getSettlementDetailsForExport(rest);

          parsedInstanceData = {
            orderId,
            asin,
            sku,
            'Product Name': productName,
            'Order Status': orderStatus,
            'Order Date': orderDate,
            'Total Units': orderUnits,
            'Total Sales': principalAmount,
            'Return Units': totalReturnUnits,
            ...normalizedSettlementKeys,
          };
          break;
        }

        default:
          parsedInstanceData = { ...instance };
          break;
      }

      return parsedInstanceData;
    });
    return parsedExportData;
  } else {
    return data;
  }
};

export const parseGraphExportData = <T extends Record<string, any>>(
  data: T[],
  title: string,
  accountType?: string,
  frequency?: string
) => {
  if (data.length) {
    const parsedExportData = data.map((instance) => {
      let parsedInstanceData: Record<string, any> = {
        Frequency: ISO_DATE_FORMAT.test(instance.label)
          ? convertGraphLabelByFrequency(
              instance.label,
              frequency ?? Frequency.DAILY
            )
          : instance.label ?? convertToTitleCase(frequency ?? ''),
      };

      switch (title) {
        case SpAccountLevelTitles.CAMPAIGNS:
        case SpAccountLevelTitles.AD_GROUPS:
        case SpCampaignLevelTitles.AD_GROUPS:
        case SpAccountLevelTitles.PRODUCT_ADS:
        case SpCampaignLevelTitles.PRODUCT_ADS:
        case SpAdGroupLevelTitles.PRODUCT_ADS:
        case SpAccountLevelTitles.KEYWORD_TARGETING:
        case SpCampaignLevelTitles.KEYWORD_TARGETING:
        case SpAccountLevelTitles.PRODUCT_TARGETING:
        case SpCampaignLevelTitles.PRODUCT_TARGETING:
        case SpAccountLevelTitles.AUTO_TARGETING:
        case SpAccountLevelTitles.SEARCH_TERM:
        case SpCampaignLevelTitles.SEARCH_TERM:
        case SpAdGroupLevelTitles.SEARCH_TERM:
        case SpAdGroupLevelTitles.KEYWORD_TARGETING:
        case SpAdGroupLevelTitles.PRODUCT_TARGETING:
        case SpAdGroupLevelTitles.TARGETING:
        case SpCampaignLevelTitles.AUTO_TARGETING:
        case SpAccountLevelTitles.PLACEMENT:
        case SpCampaignLevelTitles.PLACEMENT:
        case OverallAccountLevelTitles.CAMPAIGNS:
        case OverallAccountLevelTitles.AD_GROUPS:
        case OverallAccountLevelTitles.PRODUCT_ADS:
        case OverallAccountLevelTitles.KEYWORD_TARGETING:
        case OverallAccountLevelTitles.PRODUCT_TARGETING:
        case OverallAccountLevelTitles.SEARCH_TERM:
        case SbAccountLevelTitles.CAMPAIGNS:
        case SbAccountLevelTitles.AD_GROUP:
        case SbCampaignLevelTitles.AD_GROUP:
        case SbAccountLevelTitles.PRODUCT_ADS:
        case SbCampaignLevelTitles.PRODUCT_ADS:
        case SbAdGroupLevelTitles.PRODUCT_ADS:
        case SbAccountLevelTitles.KEYWORD_TARGETING:
        case SbCampaignLevelTitles.KEYWORD_TARGETING:
        case SbAdGroupLevelTitles.KEYWORD_TARGETING:
        case SbAccountLevelTitles.PRODUCT_TARGETING:
        case SbCampaignLevelTitles.PRODUCT_TARGETING:
        case SbAdGroupLevelTitles.PRODUCT_TARGETING:
        case SbAccountLevelTitles.SEARCH_TERM:
        case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
        case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
        case SdAccountLevelTitles.CAMPAIGN:
        case SdAccountLevelTitles.AD_GROUP:
        case SdCampaignLevelTitles.AD_GROUP:
        case SdAccountLevelTitles.PRODUCT_ADS:
        case SdCampaignLevelTitles.PRODUCT_ADS:
        case SdAdGroupLevelTitles.PRODUCT_ADS:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseAmazonMetricsExportData(instance),
          };
          break;

        case WalmartSPAccountLevelTitles.CAMPAIGNS:
        case WalmartSBAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
          };
          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };
          break;

        case WalmartSPAccountLevelTitles.AD_GROUPS:
        case WalmartSPCampaignLevelTitles.AD_GROUPS:
        case WalmartSBAccountLevelTitles.AD_GROUPS:
        case WalmartSBCampaignLevelTitles.AD_GROUPS:
        case WalmartSPAccountLevelTitles.AD_ITEMS:
        case WalmartSPCampaignLevelTitles.AD_ITEMS:
        case WalmartSPAdGroupLevelTitles.AD_ITEMS:
        case WalmartSBAccountLevelTitles.AD_ITEMS:
        case WalmartSBCampaignLevelTitles.AD_ITEMS:
        case WalmartSBAdGroupLevelTitles.AD_ITEMS:
        case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartSPAccountLevelTitles.PAGE_TYPE:
        case WalmartSPCampaignLevelTitles.PAGE_TYPE:
        case WalmartSBAccountLevelTitles.PAGE_TYPE:
        case WalmartSBCampaignLevelTitles.PAGE_TYPE:
        case WalmartSVAccountLevelTitles.PAGE_TYPE:
        case WalmartSVCampaignLevelTitles.PAGE_TYPE:
        case WalmartOverallAccountLevelTitles.PAGE_TYPE:
        case WalmartSPAccountLevelTitles.PLATFORM:
        case WalmartSPCampaignLevelTitles.PLATFORM:
        case WalmartSBAccountLevelTitles.PLATFORM:
        case WalmartSBCampaignLevelTitles.PLATFORM:
        case WalmartSVAccountLevelTitles.PLATFORM:
        case WalmartSVCampaignLevelTitles.PLATFORM:
        case WalmartOverallAccountLevelTitles.PLATFORM:
        case WalmartSVAccountLevelTitles.AD_ITEMS:
        case WalmartSVCampaignLevelTitles.AD_ITEMS:
        case WalmartSVAdGroupLevelTitles.AD_ITEMS:
        case WalmartOverallAccountLevelTitles.AD_ITEMS:
        case WalmartSPAccountLevelTitles.SEARCH_TERM:
        case WalmartSPCampaignLevelTitles.SEARCH_TERM:
        case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
        case WalmartOverallAccountLevelTitles.SEARCH_TERM:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
          };
          break;

        case WalmartSVAccountLevelTitles.CAMPAIGNS:
        case WalmartOverallAccountLevelTitles.CAMPAIGNS:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };

          if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
            parsedInstanceData = {
              ...parsedInstanceData,
              ...parseWalmartInstoreMetricsExportData(instance),
            };
          break;

        case WalmartSVAccountLevelTitles.AD_GROUPS:
        case WalmartSVCampaignLevelTitles.AD_GROUPS:
        case WalmartOverallAccountLevelTitles.AD_GROUPS:
        case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
        case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
        case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
        case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
          parsedInstanceData = {
            ...parsedInstanceData,
            ...parseWalmartMetricsExportData(instance),
            ...parseWalmartVideoMetricsExportData(instance),
          };
          break;

        default:
          parsedInstanceData = { ...parsedInstanceData, ...instance };
          break;
      }

      return parsedInstanceData;
    });
    return parsedExportData;
  } else {
    return data;
  }
};

export const checkMomentDateValidity = (date: string | undefined) => {
  if (date?.toString().length !== 10) return false;
  return moment(date, true).isValid();
};

export const displayValue = (
  value: string | number | null,
  isPercentage = true
) => {
  if (value === null || value === undefined || value === '-') {
    return '-';
  }

  const numberValue = reverseFormattedNumToNumber(value);
  return isPercentage
    ? `${value}%`
    : numberValue < 0
    ? `-${getCurrencySymbolByCountry()}${formatNum(Math.abs(numberValue))}`
    : `${getCurrencySymbolByCountry()}${value}`;
};

export const genExportFileName = (
  marketplace: string,
  tableName: string
): string => {
  const date = getCurrentDateTime();
  return `${marketplace?.toLowerCase()}_${tableName?.toLowerCase()}_${date}.csv`;
};

export const getToastStyle = (
  index: number,
  activeIndex: number
): React.CSSProperties => {
  const isVisible = index === activeIndex;
  const baseZIndex = 10000 - index;

  return {
    zIndex: baseZIndex,
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    transform: `translateX(${(index - activeIndex) * 10}%)`,
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  };
};

export const convertToDateFormat = (value: string | number) => {
  const isDateFormat = checkMomentDateValidity(value.toString());

  if (isDateFormat && checkIsIndefiniteDate(`${value}`)) {
    return INDEFINITE;
  }

  return isDateFormat
    ? getFormattedDateWithFormat(value.toString(), DATE_FORMAT_13)
    : value;
};

export const getSelectedDateLabel = (
  value: string | null,
  isChecked?: boolean
) => {
  if (isChecked) return INDEFINITE;
  else if (value) return getFormattedDateWithFormat(value, DATE_FORMAT_18);
  else return DATE_FORMAT_18;
};

export const getCountryCode = () => {
  const countryCode =
    localStorageUtils.getAccountCountryCode() ?? CountryCodeEnum.UnitedStates;

  return countryCode;
};

export const getConfigForCountry = (
  optionalCountryCode?: string
): IRegionAccountConfig => {
  const countryCode = optionalCountryCode ?? getCountryCode();
  const regionConfig = RegionAccountConfigs.find(
    (config) => config.COUNTRY_CODE === countryCode
  );
  if (!regionConfig) return USAccountConfig;
  return regionConfig;
};

export const getCurrencySymbolByCountry = () => {
  const config = getConfigForCountry();
  return config.CURRENCY_SYMBOL ?? '$';
};

export const getCountryFlagIcon = (countryCode: Nullable<string>) => {
  if (!countryCode) return imageUrls.usFlag;

  switch (countryCode) {
    case CountryCodeEnum.Canada:
      return imageUrls.caFlag;
    case CountryCodeEnum.UnitedStates:
      return imageUrls.usFlag;
    case CountryCodeEnum.Mexico:
      return imageUrls.mxFlag;
    case CountryCodeEnum.Brazil:
      return imageUrls.brFlag;
    case CountryCodeEnum.Spain:
      return imageUrls.esFlag;
    case CountryCodeEnum.UnitedKingdom:
      return imageUrls.gbFlag;
    case CountryCodeEnum.France:
      return imageUrls.frFlag;
    case CountryCodeEnum.Belgium:
      return imageUrls.beFlag;
    case CountryCodeEnum.Netherlands:
      return imageUrls.nlFlag;
    case CountryCodeEnum.Germany:
      return imageUrls.deFlag;
    case CountryCodeEnum.Italy:
      return imageUrls.itFlag;
    case CountryCodeEnum.Sweden:
      return imageUrls.seFlag;
    case CountryCodeEnum.SouthAfrica:
      return imageUrls.zaFlag;
    case CountryCodeEnum.Poland:
      return imageUrls.plFlag;
    case CountryCodeEnum.Egypt:
      return imageUrls.egFlag;
    case CountryCodeEnum.SaudiArabia:
      return imageUrls.saFlag;
    case CountryCodeEnum.Turkey:
      return imageUrls.trFlag;
    case CountryCodeEnum.UnitedArabEmirates:
      return imageUrls.aeFlag;
    case CountryCodeEnum.India:
      return imageUrls.inFlag;
    case CountryCodeEnum.Singapore:
      return imageUrls.sgFlag;
    case CountryCodeEnum.Australia:
      return imageUrls.auFlag;
    case CountryCodeEnum.Japan:
      return imageUrls.jpFlag;
    default:
      return imageUrls.usFlag;
  }
};

export const getTimeZoneByCountry = (countryCode?: string) => {
  const config = getConfigForCountry(countryCode);

  return config.TIMEZONE ?? TimezoneEnum.US_PACIFIC;
};

export const transposeData = <T extends Record<string, any>>(
  data: Array<T>,
  firstKeyField?: keyof T
): Array<any> => {
  if (!data?.length) return data;

  const firstKey = firstKeyField ?? Object.keys(data[0])[0];

  const keys = Object.keys(data[0]).slice(1);

  return keys.map((key) => {
    const row: Record<string, any> = { [firstKey]: key };

    for (let i = 0; i < data.length; i++) {
      const columnHeader = hasProperty(data[i], firstKey)
        ? data[i][firstKey]
        : `Column ${i + 1}`;
      row[columnHeader] = hasProperty(data[i], key) ? data[i][key] : '';
    }

    return row;
  });
};

export const getCSVDownload = async (
  exportData: Array<any>,
  filename: string | undefined = undefined,
  title: string | undefined = undefined,
  accountType: string | undefined = undefined,
  isGraph = false,
  frequency?: string,
  shouldTranspose = false,
  marketplace = MarketplaceEnum.AMAZON
) => {
  const getParsedExportData = convertObjectKeysToTitleCase(
    isGraph
      ? parseGraphExportData(
          formatDataToDownload(exportData),
          title as string,
          accountType,
          frequency
        )
      : parseTableExportData(
          formatDataToDownload(exportData, title === COGS_DOWNLOAD_TEMPLATE),
          title as string,
          accountType,
          marketplace
        ),
    title !== COGS_DOWNLOAD_TEMPLATE
  );

  const finalData = shouldTranspose
    ? transposeData(getParsedExportData)
    : getParsedExportData;
  const csvData = Papa.unparse(transformCsvExportData(finalData));
  const blob = new Blob([csvData], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename as string;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const transformCsvExportData = (finalData: Array<Record<string, any>>) => {
  return finalData.map((row: Record<string, any>) => {
    const updatedRow: Record<string, unknown> = {};
    const keys = Object.keys(row);
    keys.forEach((key) => {
      const value = row[key];
      if (typeof value === 'object') updatedRow[key] = JSON.stringify(value);
      else if (typeof value === 'string' && LEADING_ZERO_REGEX.test(value))
        updatedRow[key] = `="${value}"`;
      else updatedRow[key] = value;
    });

    return updatedRow;
  });
};

export const getDateRangeDisplayValue = ({
  showLabel,
  isProfitability,
  tempPreset,
  tempDateRange,
  isNoEndDateChecked,
  frequencyState,
}: {
  showLabel: boolean;
  isProfitability: boolean;
  tempPreset: { value: string; label: string };
  tempDateRange: { startDate?: string; endDate?: string };
  isNoEndDateChecked: boolean;
  frequencyState?: Array<{ selected?: boolean; label: string }>;
}): string => {
  if (
    showLabel ||
    (isProfitability && tempPreset.value !== Range.CUSTOM_RANGE)
  ) {
    return tempPreset.label;
  }

  const dateRangeForDisplay = {
    startDate: tempDateRange.startDate || '',
    endDate: tempDateRange.endDate,
  };
  let displayValue = formatDisplayRange(
    dateRangeForDisplay,
    DATE_FORMAT_19,
    isNoEndDateChecked
  );

  if (isProfitability) {
    const frequencyLabel = frequencyState?.filter(
      (item) => item.selected === true
    )[0]?.label;

    if (frequencyLabel) {
      displayValue += ` (${frequencyLabel})`;
    }
  }

  return displayValue;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay = 200
) {
  let timeoutId: NodeJS.Timeout;

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}

export const formatStringToTitleCase = (
  value: string | undefined | null
): string => {
  if (checkIsNull(value) || typeof value !== 'string') return '-';
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
};

export const checkIsValidObject = (obj: unknown): obj is object => {
  return (
    obj !== null && typeof obj === 'object' && checkIsObjectEmpty(obj) === false
  );
};

export const getTableTitle = (title: string, isSource: boolean): string =>
  isSource ? `All_${title}` : `Added_${title}`;

export const splitStringByDelimiters = (
  value: string,
  splitOnSpaces = true
) => {
  if (value.trim() === '') return [];
  return value
    .split(
      splitOnSpaces
        ? STRING_DELIMITER_REGEX_FORMAT
        : STRING_DELIMITER_REGEX_WITHOUT_SPACE_FORMAT
    )
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
};

export const hasProperty = <T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, any> => {
  if (checkIsValidObject(obj) === false) return false;
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const isLowerCase = (char: string) => {
  return char === char.toLowerCase() && char !== char.toUpperCase();
};

export const convertObjectKeysToTitleCase = <T extends object>(
  data: T[],
  convertToTitleCase = true
) => {
  if (!convertToTitleCase) return data;
  return data.map((item: Record<string, any>) => {
    const formattedItem: Record<string, any> = {};
    Object.keys(item).forEach((key) => {
      formattedItem[isLowerCase(key[0]) ? formatStringToTitleCase(key) : key] =
        item[key];
    });
    return formattedItem;
  });
};

export const convertGraphLabelByFrequency = (
  label: string | null,
  frequency: Frequency | string
) => {
  if (checkIsNull(label)) return '';
  if (frequency === Frequency.DAILY)
    return getFormattedDateWithFormat(label, DATE_FORMAT_13);
  if (frequency === Frequency.MONTHLY) return formatYearMonth(label);
  if (frequency === Frequency.WEEKLY) return formatYearWeek(label);
  return label;
};

export const isIndefiniteDate = (
  date: string | undefined,
  indefiniteDate = WALMART_INDEFINITE_END_DATE
): boolean => {
  return (
    !date ||
    (date !== undefined &&
      new Date(date ?? '').getTime() >= new Date(indefiniteDate).getTime())
  );
};
