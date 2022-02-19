import React, { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import { useConnectionContext } from './hooks/useConnection';

const SellForm = () => {
  const {
    currentAccount,
    token,
    ethSwap,
    ethSwapAddress,
    ethSwapRate
  } = useConnectionContext();

  const [tokensToSend, setTokensToSend] = useState('');

  const sellTokens = async () => {
    await token.methods.approve(ethSwapAddress, tokensToSend)
      .send({ from: currentAccount })
      .on('transactionHash', async (hash) => {
        console.log('approval:', hash);
      });
    ethSwap.methods.sellTokens(tokensToSend)
      .send({ from: currentAccount })
      .on('transactionHash', async (hash) => {
        console.log('sell:', hash);
      });
  }
  return (
    <>
      <label htmlFor="tokens-amount" className="text-sm">
        Tokens Amount
      </label>
      <div className="flex">
        <Input
          id="tokens-amount"
          value={tokensToSend}
          onChange={({ target: { value } }) => setTokensToSend(value)}
        />
        <Button type="primary" className="ml-2" onClick={sellTokens}>
          Sell Tokens
        </Button>
      </div>
      Sell {tokensToSend || 0} tokens for {tokensToSend/ethSwapRate} ether
    </>
  );
};

export default SellForm;
