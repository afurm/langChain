import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1281, // Moonbeam development chain ID
    },
    moonbase: {
      url: process.env.NEXT_PUBLIC_MOONBASE_RPC_URL || "",
      chainId: 1287, // Moonbase Alpha TestNet
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    moonbeam: {
      url: process.env.NEXT_PUBLIC_MOONBEAM_RPC_URL || "",
      chainId: 1284, // Moonbeam MainNet
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      moonbeam: process.env.MOONBEAM_API_KEY || "",
      moonbaseAlpha: process.env.MOONBASE_API_KEY || "",
    },
    customChains: [
      {
        network: "moonbeam",
        chainId: 1284,
        urls: {
          apiURL: "https://api-moonbeam.moonscan.io/api",
          browserURL: "https://moonscan.io",
        },
      },
      {
        network: "moonbaseAlpha",
        chainId: 1287,
        urls: {
          apiURL: "https://api-moonbase.moonscan.io/api",
          browserURL: "https://moonbase.moonscan.io",
        },
      },
    ],
  },
  typechain: {
    outDir: "src/types/contracts",
    target: "ethers-v6",
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./src/artifacts",
  },
};

export default config; 