import { swapSettings, swapState } from '~/state';
import { WAVAX, ZERO_ADDRESS } from '~/utils/constants';

interface ISwapCardFooter {
  usdPrices: any;
  priceImpact: any;
  gasPrice: any;
}

const SwapCardFooter = ({ usdPrices, priceImpact, gasPrice }: ISwapCardFooter) => {
  return (
    <div className="font-light">
      {/* <div className="flex justify-between text-sm">
            <span>Allowed slippage</span>
            <span>
              <span className="font-medium">0.2%</span>
            </span>
          </div> */}
      {/* <div className="flex justify-between text-sm">
            <span>Price</span>
            <span>
              <span className="font-medium">
                {amountOut
                  ? amountIn / amountOut > 0
                    ? (amountIn / amountOut).toFixed(4).toLocaleString()
                    : (amountIn / amountOut).toPrecision(4)
                  : 0}
              </span>{' '}
              {snap.swapInfo.tokens.tokenInSymbol}/{snap.swapInfo.tokens.tokenOutSymbol}
            </span>
          </div> */}
      <div className="flex justify-between text-sm">
        <span>Price impact</span>
        <span>
          <span className="font-bold">{priceImpact.toFixed(4)} %</span>
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Gas cost</span>
        <span>
          <span className="font-light text-xs mr-2">
            ~${usdPrices ? (gasPrice * usdPrices[WAVAX.toLowerCase()]?.usd).toFixed(2) : 0}
          </span>
          <span className="font-bold">{gasPrice.toPrecision(2)} AVAX</span>
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Min. to receive</span>
        <span>
          <span className="font-light text-xs mr-2">
            ~$
            {usdPrices
              ? usdPrices[
                  swapState.tokenOut.address.toLowerCase() === ZERO_ADDRESS
                    ? WAVAX.toLowerCase()
                    : swapState.tokenOut.address.toLowerCase()
                ]?.usd *
                  swapState.amountOut >
                0
                ? Number(
                    (
                      usdPrices[
                        swapState.tokenOut.address.toLowerCase() === ZERO_ADDRESS
                          ? WAVAX.toLowerCase()
                          : swapState.tokenOut.address.toLowerCase()
                      ]?.usd *
                      swapState.amountOut *
                      (1 - swapSettings.slippage / 100)
                    ).toFixed(8)
                  ).toLocaleString()
                : (
                    usdPrices[
                      swapState.tokenOut.address.toLowerCase() === ZERO_ADDRESS
                        ? WAVAX.toLowerCase()
                        : swapState.tokenOut.address.toLowerCase()
                    ]?.usd *
                    swapState.amountOut *
                    (1 - swapSettings.slippage / 100)
                  ).toPrecision(8)
              : ''}
          </span>
          <span className="font-bold">
            {swapState.amountOut * 0.98 > 0
              ? Number((swapState.amountOut * 0.98).toFixed(8)).toLocaleString()
              : (swapState.amountOut * 0.98).toPrecision(8).toLocaleString()}{' '}
            {swapState.tokenOut.symbol}
          </span>
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Service fee</span>
        <span>
          <span className="font-bold">0</span>
        </span>
      </div>
    </div>
  );
};

export default SwapCardFooter;