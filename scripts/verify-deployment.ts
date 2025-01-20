import { ethers } from "hardhat";
import { readFileSync } from "fs";
import { join } from "path";
import chalk from "chalk";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log(chalk.blue("\nVerifying deployment configuration..."));
  console.log(chalk.gray("Network:", network.name));
  console.log(chalk.gray("Chain ID:", network.chainId));
  console.log(chalk.gray("Deployer:", deployer.address));

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInDEV = ethers.formatEther(balance);
  console.log(chalk.gray("Deployer balance:", balanceInDEV, "DEV"));

  if (Number(balanceInDEV) < 1) {
    console.log(chalk.red("⚠️ Warning: Low deployer balance"));
    console.log(chalk.yellow("Please ensure you have enough DEV tokens for deployment"));
  } else {
    console.log(chalk.green("✓ Sufficient deployer balance"));
  }

  // Verify contract addresses
  console.log(chalk.blue("\nVerifying contract addresses..."));
  const requiredContracts = [
    "NEXT_PUBLIC_USER_PROFILE_CONTRACT",
    "NEXT_PUBLIC_LESSON_MANAGER_CONTRACT",
    "NEXT_PUBLIC_TOKEN_REWARDS_CONTRACT",
  ];

  let missingContracts = false;
  for (const contract of requiredContracts) {
    if (!process.env[contract]) {
      console.log(chalk.red(`⚠️ Missing ${contract} address`));
      missingContracts = true;
    } else {
      console.log(chalk.green(`✓ ${contract} configured`));
    }
  }

  // Verify API keys
  console.log(chalk.blue("\nVerifying API keys..."));
  const requiredKeys = [
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
    "NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID",
    "NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET",
    "OPENAI_API_KEY",
  ];

  let missingKeys = false;
  for (const key of requiredKeys) {
    if (!process.env[key]) {
      console.log(chalk.red(`⚠️ Missing ${key}`));
      missingKeys = true;
    } else {
      console.log(chalk.green(`✓ ${key} configured`));
    }
  }

  // Verify RPC URLs
  console.log(chalk.blue("\nVerifying RPC URLs..."));
  const requiredRPCs = [
    "NEXT_PUBLIC_MOONBEAM_RPC_URL",
    "NEXT_PUBLIC_MOONBASE_RPC_URL",
  ];

  let missingRPCs = false;
  for (const rpc of requiredRPCs) {
    if (!process.env[rpc]) {
      console.log(chalk.red(`⚠️ Missing ${rpc}`));
      missingRPCs = true;
    } else {
      console.log(chalk.green(`✓ ${rpc} configured`));
    }
  }

  // Summary
  console.log(chalk.blue("\nDeployment Configuration Summary:"));
  if (missingContracts || missingKeys || missingRPCs) {
    console.log(chalk.red("\n⚠️ Some configuration items are missing"));
    console.log(chalk.yellow("Please check the items marked with ⚠️ above"));
    process.exit(1);
  } else {
    console.log(chalk.green("\n✓ All configuration items verified"));
    console.log(chalk.blue("\nReady for deployment! 🚀"));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red("\nVerification failed:", error));
    process.exit(1);
  }); 