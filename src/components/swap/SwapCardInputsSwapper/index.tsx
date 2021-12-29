import { useSnapshot } from 'valtio';
import SpiritLoader from '~/components/shared/SpiritLoader';
import { swapState } from '~/state';

const SwapCardInputsSwapper = () => {
  const swapSnap = useSnapshot(swapState);

  const swapSelects = () => {
    const tokenIn = swapState.tokenIn;
    swapState.tokenIn = swapState.tokenOut;
    swapState.tokenOut = tokenIn;

    swapState.amountIn = swapState.amountOut;
    swapState.amountOut = 0;
  };

  return (
    <>
      {swapSnap.loading ? (
        <SpiritLoader size="small" />
      ) : (
        <button onClick={swapSelects} type="button" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default SwapCardInputsSwapper;
