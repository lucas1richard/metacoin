import React, { useEffect, useState } from 'react';
// import Web3 from 'web3';
import Button from './components/Button';
import Input from './components/Input';
import PageWrapper from './components/PageWrapper';
import { DLSProvider } from './hooks/useDLS';
import Token from './abis/Token.json';
import EthSwap from './abis/EthSwap.json';

let web3;
let ethSwap;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [ethBalance, setEthBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [ethSwapRate, setEthSwapRate] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [ethToSend, setEthToSend] = useState('');

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }
  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch(error) {
      console.error(error);
    }
  }

  const handleConnection = async () => {
    // eslint-disable-next-line no-undef
    const [accounts, networkId] = await Promise.all([
      web3.eth.getAccounts(),
      web3.eth.net.getId(),
    ]);
    if (accounts[0]) {
      const weiBalance = await web3.eth.getBalance(accounts[0]);
      setEthBalance(web3.utils.fromWei(weiBalance));
      setNetworkId(networkId);
      handleAccountsChanged(accounts);
      const tokenData = Token.networks[networkId];
      const ethSwapData = EthSwap.networks[networkId];
      
      if (!tokenData) throw new Error('Token contract not deployed to detected network.');
      if (!ethSwapData) throw new Error('EthSwap contract not deployed to detected network.');
      
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);

      // eslint-disable-next-line no-undef
      const [tokenBalanceBuffer, ethSwapRateBuffer] = await Promise.all([
        token.methods.balanceOf(accounts[0]).call(),
        ethSwap.methods.rate.call().call(),
      ]);

      console.log(ethSwap);

      setEthSwapRate(ethSwapRateBuffer.toString());
      setTokenBalance(web3.utils.fromWei(tokenBalanceBuffer.toString()))
    }
  }
  useEffect(async () => {
    const dismount = () => {
      window.ethereum.removeListener('connect');
      window.ethereum.removeListener('accountsChanged');
      window.ethereum.removeListener('message');
    };
    try {
      const isConnected = window.ethereum.isConnected();
      console.log({ isConnected });
      web3 = new window.Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log({ accounts });
      // eslint-disable-next-line no-undef
      
      
      window.ethereum.on('connect', handleConnection);
      window.ethereum.on('accountsChanged', handleConnection);
      window.ethereum.on('message', console.log);
      await handleConnection();

      return dismount;
    } catch (error) {
      console.error(error);
      return dismount;
    }
  }, []);

  const buyTokens = () => {
    // this.setState({ loading: true });
    // const { ethSwap, account } = this.state;
    ethSwap.methods.buyTokens()
      .send({ from: currentAccount, value: web3.utils.toWei(ethToSend) })
      .on('transactionHash', async (hash) => {
        console.log(hash);
        // this.setState({ loading: false })
      })
  }

  return (
  <DLSProvider value={{}}>
    <PageWrapper>
      <>
        <div className="mb-2">
          <div className="text-gray-900 font-semibold">Account:</div>
          <div className="text-gray-600 text-sm">
            {currentAccount}
          </div>
        </div>
        <div className=" mb-2">
          <div className="text-gray-900 font-semibold">Ether Balance:</div>
          <div className="text-gray-600 text-sm">
            {ethBalance}
          </div>
        </div>
        <div className=" mb-2">
          <div className="text-gray-900 font-semibold">Token Balance:</div>
          <div className="text-gray-600 text-sm">
            {tokenBalance}
          </div>
        </div>
        <div className=" mb-2">
          <div className="text-gray-900 font-semibold">EthSwap Rate:</div>
          <div className="text-gray-600 text-sm">
            {ethSwapRate}
          </div>
        </div>
        <div className="">
        <div className="text-gray-900 font-semibold">Network Id:</div>
          <div className="text-gray-600 text-sm">
            {networkId}
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={connect}>
            Connect Metamask
          </Button>
        </div>
        <div className="mt-4">
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
        </div>
      </>
    </PageWrapper>
  </DLSProvider>
);
}
export default App;
