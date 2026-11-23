import { imageUrls } from '@legacy/constants/assets/images.constants';
import { CountryCodeEnum } from '@legacy/enums/advertising.enums';

/** Ported from anarix-ui: only the helper the ported pages use. */
export const getCountryFlagIcon = (countryCode: string | null | undefined) => {
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
