import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import PairABI from '~/abis/PairABI.json';
import YakRouterABI from '~/abis/YakRouter.json';
import { ADDRESSES } from '~/utils/constants';
import { BigNumber } from 'bignumber.js';
import { userState } from '~/state';
import { tokenList } from './tokenList';
import { toast } from 'react-toastify';
import { signERC2612Permit } from 'eth-permit';

const MaxUint256: BigNumber | string = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const yakRouterAddress = ADDRESSES.helpers.yakRouter;
const fee = 0;

export const swap = async (payload: any) => {
  const provider = window.ethereum;
  const web3 = new Web3(provider);
  const userAddress = userState.userAddress;

  if (userAddress) {
    const { trade, fromAVAX, toAVAX } = payload;
    const yakRouterContract = new web3.eth.Contract(YakRouterABI as AbiItem[], yakRouterAddress, {
      from: userAddress,
    });

    try {
      if (fromAVAX) {
        const tx = await yakRouterContract.methods
          .swapNoSplitFromAVAX(
            {
              amountIn: trade.amounts[0],
              amountOut: trade.amounts[trade.amounts.length - 1],
              path: trade.path,
              adapters: trade.adapters,
            },
            userAddress,
            fee
          )
          .send({ from: userAddress, value: trade.amounts[0] });

        if (tx.status) {
          toast.success('Swap success');
        } else {
          toast.error('Swap failed');
        }
        return tx;
      } else {
        // handle approval
        const fromTokenAddress = trade.path[0];
        const permitSupported = tokenList.find(
          (token) => token.address.toLowerCase() === fromTokenAddress.toLowerCase()
        )?.permitSupported;

        const tokenContract = new web3.eth.Contract(PairABI as AbiItem[], fromTokenAddress, {
          from: userAddress,
        });
        const approvedBalance = await tokenContract.methods.allowance(userAddress, yakRouterAddress).call();
        try {
          if (!permitSupported) {
            throw new Error('Permit not supported');
          }
          if (new BigNumber(approvedBalance).gte(trade.amounts[0])) {
            throw new Error('Permit not needed');
          }

          const signature = await signERC2612Permit(
            provider,
            trade.path[0],
            userAddress,
            yakRouterAddress,
            trade.amounts[0]
          );

          if (toAVAX) {
            const tx = await yakRouterContract.methods
              .swapNoSplitToAvaxWithPermit(
                {
                  amountIn: trade.amounts[0],
                  amountOut: trade.amounts[trade.amounts.length - 1],
                  path: trade.path,
                  adapters: trade.adapters,
                },
                userAddress,
                fee,
                signature.deadline,
                signature.v,
                signature.r,
                signature.s
              )
              .send({ from: userAddress });

            if (tx.status) {
              toast.success('Swap success');
            } else {
              toast.error('Swap failed');
            }
            return tx;
          } else {
            const tx = await yakRouterContract.methods
              .swapNoSplitWithPermit(
                {
                  amountIn: trade.amounts[0],
                  amountOut: trade.amounts[trade.amounts.length - 1],
                  path: trade.path,
                  adapters: trade.adapters,
                },
                userAddress,
                fee,
                signature.deadline,
                signature.v,
                signature.r,
                signature.s
              )
              .send({ from: userAddress });

            if (tx.status) {
              toast.success('Swap success');
            } else {
              toast.error('Swap failed');
            }
            return tx;
          }
        } catch {
          try {
            if (new BigNumber(approvedBalance).lt(trade.amounts[0])) {
              await tokenContract.methods.approve(yakRouterAddress, MaxUint256).send({ from: userAddress });
            }

            if (toAVAX) {
              const tx = await yakRouterContract.methods
                .swapNoSplitToAVAX(
                  {
                    amountIn: trade.amounts[0],
                    amountOut: trade.amounts[trade.amounts.length - 1],
                    path: trade.path,
                    adapters: trade.adapters,
                  },
                  userAddress,
                  fee
                )
                .send({ from: userAddress });

              if (tx.status) {
                toast.success('Swap success');
              } else {
                toast.error('Swap failed');
              }
              return tx;
            } else {
              const tx = await yakRouterContract.methods
                .swapNoSplit(
                  {
                    amountIn: trade.amounts[0],
                    amountOut: trade.amounts[trade.amounts.length - 1],
                    path: trade.path,
                    adapters: trade.adapters,
                  },
                  userAddress,
                  fee
                )
                .send({ from: userAddress });

              if (tx.status) {
                toast.success('Swap success');
              } else {
                toast.error('Swap failed');
              }
              return tx;
            }
          } catch (err) {
            console.error('swap', err);
            toast.error('Swap error');
            return false;
          }
        }
      }
    } catch (err) {
      console.error('swap', err);
      toast.error('Swap error');
      return false;
    }
  }
};
