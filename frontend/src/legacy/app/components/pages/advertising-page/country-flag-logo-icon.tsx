import { getCountryFlagIcon } from '@legacy/utils';
import ImgComponent from '../../common/img-component/img-component';

interface ICountryFlagLogoProps {
  countryCode?: string;
}
const CountryFlagLogo = (props: ICountryFlagLogoProps) => {
  if (!props.countryCode) return <div></div>;
  return (
    <ImgComponent
      customStyles={{
        width: 'calc(1.8 * var(--np-rem))',
        height: 'calc(1.6 * var(--np-rem))',
      }}
      imageURL={getCountryFlagIcon(props.countryCode)}
      alt="marketplace-logo"
    />
  );
};

export default CountryFlagLogo;
