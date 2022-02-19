import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Token from './abis/Token.json';
import EthSwap from './abis/EthSwap.json';
import { ConnectionContextProvider } from './hooks/useConnection';
import Button from './components/Button';

let web3;

const Connection = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [ethBalance, setEthBalance] = useState('');
  const [ethSwapAddress, setEthSwapAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [ethSwapRate, setEthSwapRate] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [token, setToken] = useState('');
  const [ethSwap, setEthSwap] = useState('');
  
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
      
      const tokenContract = new web3.eth.Contract(Token.abi, tokenData.address);
      const ethSwapContract = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);

      setEthSwap(ethSwapContract);
      setToken(tokenContract);
      setEthSwapAddress(ethSwapData.address);

      // eslint-disable-next-line no-undef
      const [tokenBalanceBuffer, ethSwapRateBuffer] = await Promise.all([
        tokenContract.methods.balanceOf(accounts[0]).call(),
        ethSwapContract.methods.rate.call().call(),
      ]);

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
      web3 = new window.Web3(window.ethereum);
      // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
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

  const connectionContext = {
    currentAccount,
    ethBalance,
    ethSwapAddress,
    ethSwapRate,
    tokenBalance,
    networkId,
    token,
    ethSwap,
    web3,
  };
  
  return (
    <ConnectionContextProvider value={connectionContext}>
      {!currentAccount && (
        <div className="my-4">
          <Button onClick={connect}>
            Connect Metamask
          </Button>
        </div>
      )}
      {children}
    </ConnectionContextProvider>
  );
};

Connection.propTypes = {
  children: PropTypes.node,
};

export default Connection;
