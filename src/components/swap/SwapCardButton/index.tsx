import classNames from 'classnames';
import Web3 from 'web3';
import { swap } from '~/api/swap';
import { useSnapshot } from 'valtio';
import { swapOfferState, swapState, userState } from '~/state';
import { ZERO_ADDRESS } from '~/utils/constants';

const SwapCardButton = () => {
  const swapStateSnap = useSnapshot(swapState);
  // const userStateSnap = useSnapshot(userState);

  const swapTokens = async () => {
    const currentOffer = swapOfferState.yakOffer;
    if (!currentOffer) {
      return;
    }

    swapState.swapLoading = true;

    const slippage = 20;

    const offerWithSlippage = {
      ...currentOffer,
      amounts: currentOffer.amounts.map((amount: any, index: any) =>
        index === 0
          ? Web3.utils.toBN(amount).toString()
          : Web3.utils
              .toBN(amount)
              .mul(Web3.utils.toBN(10000 - slippage))
              .div(Web3.utils.toBN('10000'))
              .toString()
      ),
    };

    const payload = {
      trade: offerWithSlippage,
      fromAVAX: swapState.tokenIn.address === ZERO_ADDRESS,
      toAVAX: swapState.tokenOut.address === ZERO_ADDRESS,
    };

    try {
      await swap(payload);
    } finally {
      swapState.swapLoading = false;
    }
  };

  return (
    <>
      {/* {snap.user ? (
            Number(
              tokens.tokenIn.address === ZERO_ADDRESS
                ? formatTokenBalance(userBalances.native, '18')
                : formatTokenBalance(inputTokenUserBalance?.balance, inputTokenUserBalance?.decimals)
            ) >= amountIn ? ( */}
      {userState.userAddress !== '' ? (
        <button
          onClick={swapTokens}
          className={classNames('btn w-full btn-primary', swapStateSnap.swapLoading === true ? 'loading' : null)}
          disabled={!!swapStateSnap.loading}
        >
          Swap
        </button>
      ) : (
        <button className="btn w-full btn-ghost" disabled>
          Need connected wallet
        </button>
      )}
      {/* ) : (
              <button disabled className="btn w-full btn-disabled">
                Insufficient funds
              </button>
            ) */}
      {/* ) : (
            <button
              onClick={() => authenticate()}
              className={classNames('btn w-full btn-ghost', {
                loading: isAuthenticating,
              })}
            >
              Connect wallet
            </button>
          )} */}
    </>
  );
};

export default SwapCardButton;
