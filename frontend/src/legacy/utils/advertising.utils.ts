/* eslint-disable @typescript-eslint/no-explicit-any */
import { imageUrls } from '@legacy/constants/assets/images.constants';
import { MarketplaceEnum } from '@legacy/enums/serp.enums';
/** Ported from anarix-ui: only the helper the ported pages use. */
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

const isEmptyObject = (value: object) => Object.keys(value).length === 0;

export const getMarketplaceIcon = (marketplace?: string) => {
  if (marketplace === MarketplaceEnum.AMAZON) return imageUrls.amazonLogoIcon;
  else if (marketplace === MarketplaceEnum.WALMART) return imageUrls.walmartLogoIcon;
  else return '';
};
