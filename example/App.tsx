import { MoralisProvider } from 'react-moralis';
import SwapExample from './SwapExample';

const MORALIS_APP_ID = import.meta.env.VITE_MORALIS_APP_ID;
const MORALIS_SERVER_URL = import.meta.env.VITE_MORALIS_SERVER_URL;

const App = () => {
  return (
    <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL}>
      <SwapExample />
    </MoralisProvider>
  );
};

export default App;
