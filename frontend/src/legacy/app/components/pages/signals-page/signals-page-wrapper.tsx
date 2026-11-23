import type { ComponentProps } from 'react';
import { SignalsPage } from './signals-page';

export default function SignalsPageWrapper(props: ComponentProps<typeof SignalsPage>) {
  return <SignalsPage {...props} />;
}
