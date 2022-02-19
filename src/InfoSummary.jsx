import React from 'react';
import { useConnectionContext } from './hooks/useConnection';

const InfoSummary = () => {
  const {
    currentAccount,
    ethBalance,
    ethSwapAddress,
    ethSwapRate,
    tokenBalance,
    networkId,
  } = useConnectionContext();
  return (
    <>
    <div className="mb-2">
      <div className="text-gray-900 font-semibold">EthSwap Address:</div>
      <div className="text-gray-600 text-sm">
        {ethSwapAddress}
      </div>
    </div><div className="mb-2">
        <div className="text-gray-900 font-semibold">Account:</div>
        <div className="text-gray-600 text-sm">
          {currentAccount}
        </div>
      </div><div className=" mb-2">
        <div className="text-gray-900 font-semibold">Ether Balance:</div>
        <div className="text-gray-600 text-sm">
          {ethBalance}
        </div>
      </div><div className=" mb-2">
        <div className="text-gray-900 font-semibold">Token Balance:</div>
        <div className="text-gray-600 text-sm">
          {tokenBalance}
        </div>
      </div><div className=" mb-2">
        <div className="text-gray-900 font-semibold">EthSwap Rate:</div>
        <div className="text-gray-600 text-sm">
          {ethSwapRate}
        </div>
      </div><div className="">
        <div className="text-gray-900 font-semibold">Network Id:</div>
        <div className="text-gray-600 text-sm">
          {networkId}
        </div>
      </div>
    </>
  );
};

export default InfoSummary;
