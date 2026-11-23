import { getMarketplaceIcon } from '@legacy/utils/advertising.utils';
import ImgComponent from '../../common/img-component/img-component';

interface IMarketplaceLogoProps {
  marketplace?: string;
}
const MarketplaceLogo = (props: IMarketplaceLogoProps) => {
  if (!props.marketplace) return <div></div>;
  return (
    <ImgComponent
      customStyles={{
        width: 'calc(1.6 * var(--np-rem))',
        height: 'calc(1.6 * var(--np-rem))',
        marginTop: 'calc(0.2 * var(--np-rem))',
      }}
      imageURL={getMarketplaceIcon(props.marketplace) ?? ''}
      alt="marketplace-logo"
    />
  );
};

export default MarketplaceLogo;
