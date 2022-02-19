import React, { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import { useConnectionContext } from './hooks/useConnection';

const BuyForm = () => {
  const {
    currentAccount,
    ethSwap,
    ethSwapRate,
    web3,
  } = useConnectionContext();

  const [ethToSend, setEthToSend] = useState('');

  const buyTokens = () => {
    ethSwap.methods.buyTokens()
      .send({ from: currentAccount, value: web3.utils.toWei(ethToSend) })
      .on('transactionHash', async (hash) => {
        console.log(hash);
      })
  }

  return (
    <>
      <label htmlFor="ether-amount" className="text-sm">
        Ether Amount
      </label>
      <div className="flex">
        <Input id="ether-amount" value={ethToSend} onChange={({ target: { value } }) => setEthToSend(value)} />
        <Button type="primary" className="ml-2" onClick={buyTokens}>
          Buy Tokens
        </Button>
      </div>
      Buy {(ethSwapRate * ethToSend) || 0} tokens with {ethToSend || 0} ether
    </>
  );
};

export default BuyForm;
