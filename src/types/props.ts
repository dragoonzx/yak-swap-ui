import { TokenType } from '~/api/tokenList';

/**
 * Properties for the `Swap` Component.
 */
export type SwapProps = {
  /**
   * Wallet and network provider. Apps can use a `Provider` subclass to hook
   * into all transactions intitiated by the component.
   */
  provider: any;

  /**
   * Wallet address with which component will be interacting
   * needed for swap & show balances functionality.
   */
  userAddress: string;

  /**
   * Wallet address balance
   * needed for showing token & native balances
   */
  userBalances?: any;

  /**
   * Token list providing information for tokens used.
   */
  tokenList?: TokenType[];

  /**
   * Wallet address to which referral fees are sent (i.e. a SOL address).
   * To receive referral fees, the wallet must *own* associated token
   * accounts for the token in which the referral is paid  (usually USDC
   * or USDT).
   */
  referral?: any;

  /**
   * The default `fromMint` to use when the component first renders.
   */
  fromMint?: any;

  /**
   * The default `toMint` to use when the component first renders.
   */
  toMint?: any;

  /**
   * The initial amount for the `fromMint` to use when the component first
   * renders.
   */
  fromAmount?: number;

  /**
   * The initial amount for the `toMint` to use when the component first
   * renders.
   */
  toAmount?: number;

  /**
   * Styling properties for the main container.
   */
  containerStyle?: any;

  /**
   * Styling properties for the content container.
   */
  contentStyle?: any;

  /**
   * Styling properties for the from and to token containers.
   */
  swapTokenContainerStyle?: any;
};
