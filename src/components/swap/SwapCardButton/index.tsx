import classNames from 'classnames';
import Web3 from 'web3';
import { swap } from '~/api/swap';
import { useSnapshot } from 'valtio';
import Moralis from 'moralis';
import { useMoralis } from 'react-moralis';
import { swapOfferState, swapState, userBalanceStore, userState } from '~/state';
import { AVALANCHE_CHAIN_ID, ZERO_ADDRESS } from '~/utils/constants';
import { useEffect } from 'react';
import { formatTokenBalance } from '~/utils/formatters';

const SwapCardButton = () => {
  const { authenticate, isAuthenticated, isAuthenticating, user } = useMoralis();

  const userBalancesSnap = useSnapshot(userBalanceStore);

  useEffect(() => {
    if (!user) {
      return;
    }

    userState.userAddress = user.get('ethAddress') ?? '';
  }, [user]);

  useEffect(() => {
    const getUserBalances = async () => {
      if (!user) {
        return;
      }

      const options: { chain: 'avalanche'; address: string } = { chain: 'avalanche', address: user.get('ethAddress') };

      const tokenBalances = await Promise.all([
        Moralis.Web3API.account.getTokenBalances(options),
        Moralis.Web3API.account.getNativeBalance(options),
      ]);
      console.log(tokenBalances);
      userBalanceStore.tokens = tokenBalances[0];
      userBalanceStore.native = tokenBalances[1].balance;
    };

    getUserBalances();
  }, [user]);

  const swapStateSnap = useSnapshot(swapState);
  const userStateSnap = useSnapshot(userState);

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

  const inputTokenUserBalance = userBalanceStore.tokens.find(
    (v) => v.token_address.toLowerCase() === swapState.tokenIn.address.toLowerCase()
  );

  return (
    <>
      {/* {snap.user ? (
            Number(
              tokens.tokenIn.address === ZERO_ADDRESS
                ? formatTokenBalance(userBalances.native, '18')
                : formatTokenBalance(inputTokenUserBalance?.balance, inputTokenUserBalance?.decimals)
            ) >= amountIn ? ( */}
      {isAuthenticated ? (
        Number(userStateSnap.chainId) !== AVALANCHE_CHAIN_ID ? (
          <button disabled className="btn w-full btn-disabled">
            Wrong network
          </button>
        ) : Number(
            swapStateSnap.tokenIn.address === ZERO_ADDRESS
              ? formatTokenBalance(userBalancesSnap.native, '18')
              : formatTokenBalance(inputTokenUserBalance?.balance, inputTokenUserBalance?.decimals)
          ) >= swapStateSnap.amountIn ? (
          <button
            onClick={swapTokens}
            className={classNames('btn w-full btn-primary', swapStateSnap.swapLoading === true ? 'loading' : null)}
            disabled={!!swapStateSnap.loading}
          >
            Swap
          </button>
        ) : (
          <button disabled className="btn w-full btn-disabled">
            Insufficient funds
          </button>
        )
      ) : (
        <button
          onClick={() => authenticate()}
          className={classNames('btn w-full btn-ghost', {
            loading: isAuthenticating,
          })}
        >
          Connect wallet
        </button>
      )}
    </>
  );
};

export default SwapCardButton;
