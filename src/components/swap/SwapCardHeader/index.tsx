import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useSnapshot } from 'valtio';
import { syncState, userState } from '~/state';
import { AVALANCHE_CHAIN_ID } from '~/utils/constants';
import SwapSettings from '../SwapSettings';

const customGhostBtnStyle = {
  paddingLeft: '6px',
  paddingRight: '6px',
  height: '36px',
  minHeight: '26px',
  width: '36px',
};

const handleChainChanged = () => {
  window.location.reload();
};

const SwapCardHeader = ({ onSettingsChange, getSyncPrices }: { onSettingsChange?: any; getSyncPrices: () => void }) => {
  const { timerKey, sync } = useSnapshot(syncState);

  const [chainId, setChainId] = useState(0);

  useEffect(() => {
    const getChainId = async () => {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chainId);
      userState.chainId = chainId;
    };

    getChainId();
  }, []);

  useEffect(() => {
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return (
    <>
      <h2 className="font-bold flex items-center">
        Swap Tokens
        {Number(chainId) !== AVALANCHE_CHAIN_ID ? (
          <button
            data-tip="wrong network"
            type="button"
            className="btn btn-ghost text-error tooltip tooltip-bottom ml-2"
            style={customGhostBtnStyle}
          >
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </button>
        ) : null}
      </h2>
      <div className="flex items-center">
        <button type="button" onClick={getSyncPrices} className="btn btn-ghost mr-1" style={customGhostBtnStyle}>
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={sync}
            duration={12}
            colors={[
              ['#1eb854', 0.33],
              ['#1fd65f', 0.33],
              ['#1eb854', 0.33],
            ]}
            size={18}
            strokeWidth={3}
            onComplete={() => getSyncPrices()}
          />
        </button>
        <SwapSettings onSettingsChange={onSettingsChange} btnStyle={customGhostBtnStyle} />
      </div>
    </>
  );
};

export default SwapCardHeader;
