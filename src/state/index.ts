import { proxy, useSnapshot, subscribe } from 'valtio';
import { ADDRESSES } from '~/utils/constants';
import { IYakOffer } from '~/types/yak';
import { tokenList, TokenType } from '~/api/tokenList';

interface ISyncState {
  timerKey: number;
  sync: boolean;
}

export const syncState: ISyncState = proxy({
  timerKey: 0,
  sync: true,
});

interface ISwapState {
  tokenIn: TokenType;
  tokenOut: TokenType;
  amountIn: number;
  amountOut: number;
  loading: boolean;
  swapLoading: boolean;
}

export const swapState: ISwapState = proxy({
  tokenIn: tokenList[0],
  tokenOut: tokenList.find((v) => v.symbol === 'YAK')!,
  amountIn: 1,
  amountOut: 0,
  loading: true,
  swapLoading: false,
});

interface ISwapOfferState {
  yakOffer?: IYakOffer | null;
}

export const swapOfferState: ISwapOfferState = proxy({
  yakOffer: null,
});

interface IUserState {
  provider: any;
  userAddress: string;
  balances: {
    native: string;
    tokens: any[];
  };
}

export const userState: IUserState = proxy({
  provider: null,
  userAddress: '',
  balances: {
    native: '0',
    tokens: [],
  },
});

interface IUserBalanceStore {
  native: string;
  tokens: {
    // eslint-disable-next-line camelcase
    token_address: string;
    name: string;
    symbol: string;
    logo?: string | undefined;
    thumbnail?: string | undefined;
    decimals: string;
    balance: string;
  }[];
}

export const userBalanceStore: IUserBalanceStore = proxy({
  native: '0',
  tokens: [],
});

interface ISwapSettings {
  slippage: number;
  routers: string[];
}

export const swapSettings: ISwapSettings = proxy({
  slippage: 0.2,
  routers: ADDRESSES.routers.map((v) => v.platform),
});

export { useSnapshot, subscribe };
