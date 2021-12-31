import { tokenList } from '../src/api/tokenList';
import YakSwap from '../src';
import { useMoralis } from 'react-moralis';

const SwapExample = () => {
  const { authenticate, isAuthenticated, user } = useMoralis();

  const authBtn = !isAuthenticated ? (
    <button className="btn btn-primary" onClick={() => authenticate()}>
      Authenticate
    </button>
  ) : null;

  const formattedUserAddress = () => {
    return `${user?.get('ethAddress').slice(0, 4)}...${user?.get('ethAddress').slice(-4)}`;
  };

  return (
    <div style={{ height: '100vh' }} className="relative">
      <div className="absolute" style={{ right: '1rem', top: '1rem' }}>
        {authBtn}
        {isAuthenticated && <h1>Welcome {formattedUserAddress()}</h1>}
      </div>
      <div className="flex items-center justify-center h-full" style={{ width: '420px', margin: 'auto' }}>
        <YakSwap
          tokenList={tokenList}
          onTokenChange={(token) => {
            console.log('gdthr', token);
          }}
          onAmountInChange={(amount) => {
            console.log('freth', amount);
          }}
          onOfferReceive={(offer) => {
            console.log('offer', offer);
          }}
        />
      </div>
    </div>
  );
};

export default SwapExample;
