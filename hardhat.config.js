require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();



module.exports = {
  defaultNetwork: "localhost",
  // networks: {
  //   arb: {
  //     url: process.env.RPC_URL, 
  //     accounts: [process.env.PRIVATE_KEY], 
  //   },
  // },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};