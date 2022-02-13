const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  // deployer.deploy(EthSwap);
  // deployer.link(ConvertLib, Token);
  // deployer.deploy(Token);

  // deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed();
  
  // deploy ethswap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed();

  // transfer all tokens to EthSwap (1 million)
  const totalSupplyBuffer = await token.totalSupply();
  const totalSupply = totalSupplyBuffer.toString();
  await token.transfer(ethSwap.address, totalSupply);
};
