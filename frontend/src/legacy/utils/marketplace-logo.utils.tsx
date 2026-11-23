import MarketplaceLogo from '@legacy/app/components/pages/advertising-page/marketplace-logo';
import { MarketplaceEnum } from '@legacy/enums/serp.enums';
import React from 'react';

/** Ported from anarix-ui: only the helper the ported pages use. */
const marketPlaceLogoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'calc(0.2 * var(--np-rem))',
};

export const getPrefixElementByMarketplace = (marketplace: string) => {
  if (marketplace === MarketplaceEnum.All)
    return (
      <div style={marketPlaceLogoStyles}>
        <MarketplaceLogo marketplace={MarketplaceEnum.AMAZON} />
        <span
          style={{
            paddingBottom: 'calc(0.3 * var(--np-rem))',
          }}
        >
          <MarketplaceLogo marketplace={MarketplaceEnum.WALMART} />
        </span>
      </div>
    );

  return <MarketplaceLogo marketplace={marketplace} />;
};
