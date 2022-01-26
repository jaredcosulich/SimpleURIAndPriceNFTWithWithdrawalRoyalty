require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");

module.exports = {
  solidity: "0.8.4",
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};
