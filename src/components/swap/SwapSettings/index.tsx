import NumberFormat from 'react-number-format';
import { useSnapshot } from 'valtio';
import SpiritPopover from '~/components/shared/SpiritPopover';
import { swapSettings } from '~/state';
import { ADDRESSES } from '~/utils/constants';

const SwapSettings = ({ btnStyle }: { btnStyle: any }) => {
  const swapSettingsSnap = useSnapshot(swapSettings);

  const adaptersChange = (v: string) => {
    swapSettings.routers.includes(v)
      ? (swapSettings.routers = swapSettings.routers.filter((adapter) => adapter !== v))
      : swapSettings.routers.push(v);
  };

  const btn = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );

  const content = (
    <div className="overflow-hidden rounded-lg shadow-lg w-70 ring-1 ring-black ring-opacity-5">
      <div className="relative flex flex-col w-full p-7 lg:grid-cols-2 text-base-content">
        <div className="mb-4">
          <p className="text-sm mb-2">Slippage tolerance</p>
          <NumberFormat
            value={swapSettingsSnap.slippage}
            className="input input-bordered border-primary-focus p-2 w-16 w-full h-full"
            displayType="input"
            allowNegative={false}
            suffix="%"
            onValueChange={(values) => {
              const { value } = values;
              if (+value >= 100) {
                swapSettings.slippage = 99;
                return;
              }
              swapSettings.slippage = +value;
            }}
          />
        </div>
        <div className="mb-4">
          <p className="text-sm mb-2">
            Liquidity sources ({swapSettingsSnap.routers.length}/{ADDRESSES.routers.length})
          </p>
          <div className="max-h-32 rounded border w-44 border-primary-focus overflow-auto">
            {ADDRESSES.routers.map((v) => (
              <div className="px-4 mb-1 card" key={v.platform}>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text text-md capitalize">{v.platform}</span>
                    <input
                      type="checkbox"
                      checked={swapSettingsSnap.routers.includes(v.platform)}
                      onChange={() => adaptersChange(v.platform)}
                      className="checkbox checkbox-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return <SpiritPopover btn={btn} content={content} btnStyle={btnStyle} />;
};

export default SwapSettings;
