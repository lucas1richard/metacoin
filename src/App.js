import React from 'react';
import BuyForm from './BuyForm';
import PageWrapper from './components/PageWrapper';
import Connection from './Connection';
import { DLSProvider } from './hooks/useDLS';
import InfoSummary from './InfoSummary';
import SellForm from './SellForm';


const App = () => {
  return (
  <DLSProvider value={{}}>
    <PageWrapper>
      <Connection>
        <InfoSummary />
        
        <div className="mt-4">
          <BuyForm />
        </div>
        <div className="mt-4">
          <SellForm />
        </div>
      </Connection>
    </PageWrapper>
  </DLSProvider>
);
}
export default App;
