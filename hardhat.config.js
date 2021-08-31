/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
        settings: {},
      },
    ],
  },
};
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ROPSTEN_MNEMONIC = process.env.ROPSTEN_MNEMONIC;
const BNB_TESTNET_MNEMONIC = process.env.BNB_TESTNET_MNEMONIC;
const BNB_MAINNET_MNEMONIC = process.env.BNB_MAINNET_MNEMONIC;
const BSC_SCAN_KEY = process.env.BSC_SCAN_KEY;

const NETWORKS = {
  gas: 40000000,
  blockGasLimit: 9500000,
  gasPrice: 20000000000,
};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 21,
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      live: false,
      saveDeployments: true,
      initialBaseFeePerGas: 0,
      tags: ["test", "local"],
    },
    bnb_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: { mnemonic: BNB_TESTNET_MNEMONIC },
      tags: ["staging"],
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: { mnemonic: ROPSTEN_MNEMONIC },
      tags: ["staging"],
    },
    bnb_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: NETWORKS.gasPrice,
      blockGasLimit: NETWORKS.blockGasLimit,
      gasPrice: NETWORKS.gasPrice,
      accounts: { mnemonic: BNB_MAINNET_MNEMONIC },
      tags: ["product"],
    },
  },
  etherscan: {
    apiKey: BSC_SCAN_KEY,
  },
};
