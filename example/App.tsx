import { MoralisProvider } from 'react-moralis';
import SwapExample from './SwapExample';

const MORALIS_APP_ID = 'rthX7a3rcVGAfiUj6AocOY6ZTM64E3EVrm8wKQ8O';
const MORALIS_SERVER_URL = 'https://ami09h70nxqb.usemoralis.com:2053/server';

const App = () => {
  return (
    <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL}>
      <SwapExample />
    </MoralisProvider>
  );
};

export default App;
