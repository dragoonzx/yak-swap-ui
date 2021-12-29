import { ReactElement } from 'react';
import { SwapCard } from './components/swap/SwapCard';
import './index.css';
import { SwapProps } from './types/props';

/**
 * A`Swap` component that can be embedded into applications. To use,
 * one can, minimally, provide a provider and token list to the component.
 * For example,
 *
 * ```javascript
 * <Swap provider={provider} tokenList={tokenList} />
 * ```
 *
 * All of the complexity of communicating with the Serum DEX and managing
 * its data is handled internally by the component.
 *
 * For information on other properties like earning referrals, see the
 * [[SwapProps]] documentation.
 */
export default function YakSwap(props: SwapProps): ReactElement {
  return <SwapCard {...props} />;
}
