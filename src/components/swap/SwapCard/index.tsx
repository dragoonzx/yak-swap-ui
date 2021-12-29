import { useEffect, useState } from 'react';
import Web3 from 'web3';
// import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { fetchOnchainPrices } from '~/api/fetchPrices';
import { toBaseUnit } from '~/utils/toBaseUnit';
import { tokenList as defaultTokenList } from '~/api/tokenList';
import { BigNumber } from 'bignumber.js';
import { useDebounce } from 'react-use';
import { WAVAX, YIELD_YAK_PLATFORM, ZERO_ADDRESS } from '~/utils/constants';
import { SwapProps } from '~/types/props';
import SwapCardHeader from '../SwapCardHeader';
import SwapCardFooter from '../SwapCardFooter';
import SwapCardButton from '../SwapCardButton';
import SwapCardInputs from '../SwapCardInputs';
import SwapCardInputsSwapper from '../SwapCardInputsSwapper';
import { swapOfferState, swapState, syncState, userState, useSnapshot } from '~/state';
import { getUsdPrices } from '~/api/getUsdPrices';

export const SwapCard = (props: SwapProps) => {
  // const { data: avgGasArr } = useMoralisCloudFunction('getAvgGas');
  const tokenList = props.tokenList ?? defaultTokenList;

  useEffect(() => {
    userState.userAddress = props.userAddress ?? '';
  }, [props.userAddress]);

  useEffect(() => {
    userState.provider = props.provider;
  }, [props.provider]);

  const [usdPrices, setUsdPrices] = useState<Record<string, Record<'usd', number>> | null>(null);

  const [gasEstimate, setGasEstimate] = useState<string>('');

  const getPrices = async () => {
    swapState.loading = true;
    syncState.sync = false;

    if (!swapState.amountIn) {
      return;
    }

    const x = await fetchOnchainPrices({
      fromToken: swapState.tokenIn.address === ZERO_ADDRESS ? WAVAX : swapState.tokenIn.address,
      toToken: swapState.tokenOut.address === ZERO_ADDRESS ? WAVAX : swapState.tokenOut.address,
      // @ts-expect-error: toBN should eat BigNumber
      amountIn: Web3.utils.toBN(toBaseUnit(String(swapState.amountIn), swapState.tokenIn.decimals)),
    });

    console.log(x);

    const results = x!.map((v) => {
      return {
        ...v,
        amountOut: !new BigNumber(v.amountOut).isZero()
          ? // TODO: check small numbers
            new BigNumber(v.amountOut).div(new BigNumber(10).pow(swapState.tokenOut.decimals)).toFixed(2)
          : 0,
      };
    });
    const amountOutValues = results.map((v) => Number(v.amountOut));

    swapState.amountOut = Math.max(...amountOutValues);

    results.sort((dexA, dexB) => Number(dexB.amountOut) - Number(dexA.amountOut));

    const yakOffer = x?.find((v) => v.platform === YIELD_YAK_PLATFORM)?.yakOffer;
    swapOfferState.yakOffer = yakOffer;

    yakOffer?.gasEstimate && setGasEstimate(yakOffer.gasEstimate);

    const prices = await getUsdPrices(swapState.tokenIn.address, swapState.tokenOut.address);
    setUsdPrices(prices);

    syncState.sync = true;
    swapState.loading = false;
  };

  const swapSnap = useSnapshot(swapState);

  const [,] = useDebounce(
    async () => {
      await getPrices();
      syncState.timerKey += 1;
    },
    200,
    [swapSnap.tokenIn, swapSnap.tokenOut, swapSnap.amountIn]
  );

  // const inputTokenUserBalance = userBalances.tokens.find(
  //   (v) => v.token_address.toLowerCase() === tokens.tokenIn.address.toLowerCase()
  // );
  // const outputTokenUserBalance = userBalances.tokens.find(
  //   (v) => v.token_address.toLowerCase() === tokens.tokenOut.address.toLowerCase()
  // );

  const marketPrice = usdPrices
    ? swapState.amountIn *
      usdPrices[
        swapState.tokenIn.address.toLowerCase() === ZERO_ADDRESS
          ? WAVAX.toLowerCase()
          : swapState.tokenIn.address.toLowerCase()
      ]?.usd
    : null;
  const receivedPrice = usdPrices
    ? swapState.amountOut *
      usdPrices[
        swapState.tokenOut.address.toLowerCase() === ZERO_ADDRESS
          ? WAVAX.toLowerCase()
          : swapState.tokenOut.address.toLowerCase()
      ]?.usd
    : null;
  const priceImpact = marketPrice && receivedPrice ? (1 - receivedPrice / marketPrice) * 100 : 0;

  const [gasPrice, setGasPrice] = useState(0);
  useEffect(() => {
    if (!usdPrices) {
      return;
    }

    const avgGas = 25;

    // const avgGasSum = (avgGasArr as any[]).reduce((prev, cur) => prev + cur.avgGas, 0);
    // const avgGas = avgGasSum / (avgGasArr as any[]).length;

    const gasInAVAX = Number(gasEstimate) * avgGas * 10 ** -9;
    setGasPrice(gasInAVAX);
  }, [usdPrices, gasEstimate]);

  // const setMaxAmount = (type: 'in' | 'out') => {
  //   if (type === 'out') {
  //     return;
  //   }

  //   const balance =
  //     tokens.tokenIn.address.toLowerCase() === ZERO_ADDRESS.toLowerCase()
  //       ? formatTokenBalance(userBalances.native, '18')
  //       : formatTokenBalance(inputTokenUserBalance?.balance, inputTokenUserBalance?.decimals);

  //   console.log();
  //   if (!balance) {
  //     return;
  //   }

  //   setAmountIn(Number(balance));
  // };

  return (
    <div className="card overflow-visible shadow-lg bg-base-200/100 w-full">
      <div className="card-body">
        <div className="flex items-center justify-between mb-6 -mt-4">
          <SwapCardHeader />
        </div>
        <div className="mb-4 space-x-2">
          <SwapCardInputs isSend tokenList={tokenList} />
        </div>
        <div className="flex items-center justify-center h-12">
          <SwapCardInputsSwapper />
        </div>
        <div className="mb-10 space-x-2">
          <SwapCardInputs tokenList={tokenList} />
        </div>
        <div className="w-full">
          <SwapCardButton />
        </div>
        <div className="mt-4">
          <SwapCardFooter priceImpact={priceImpact} gasPrice={gasPrice} usdPrices={usdPrices} />
        </div>
      </div>
    </div>
  );
};