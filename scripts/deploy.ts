import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";
import chalk from "chalk";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(chalk.blue("Deploying contracts with the account:", deployer.address));

  const network = await ethers.provider.getNetwork();
  console.log(chalk.blue("Network:", network.name));

  // Deploy UserProfile contract
  console.log(chalk.yellow("\nDeploying UserProfile..."));
  const UserProfile = await ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  console.log(chalk.green("UserProfile deployed to:", await userProfile.getAddress()));

  // Deploy LessonManager contract
  console.log(chalk.yellow("\nDeploying LessonManager..."));
  const LessonManager = await ethers.getContractFactory("LessonManager");
  const lessonManager = await LessonManager.deploy(await userProfile.getAddress());
  await lessonManager.waitForDeployment();
  console.log(chalk.green("LessonManager deployed to:", await lessonManager.getAddress()));

  // Deploy TokenRewards contract
  console.log(chalk.yellow("\nDeploying TokenRewards..."));
  const TokenRewards = await ethers.getContractFactory("TokenRewards");
  const tokenRewards = await TokenRewards.deploy(
    await userProfile.getAddress(),
    await lessonManager.getAddress()
  );
  await tokenRewards.waitForDeployment();
  console.log(chalk.green("TokenRewards deployed to:", await tokenRewards.getAddress()));

  // Save contract addresses
  const addresses = {
    UserProfile: await userProfile.getAddress(),
    LessonManager: await lessonManager.getAddress(),
    TokenRewards: await tokenRewards.getAddress(),
  };

  // Update .env file
  const envPath = join(__dirname, "..", ".env");
  const envContent = `
# Contract Addresses
NEXT_PUBLIC_USER_PROFILE_CONTRACT=${addresses.UserProfile}
NEXT_PUBLIC_LESSON_MANAGER_CONTRACT=${addresses.LessonManager}
NEXT_PUBLIC_TOKEN_REWARDS_CONTRACT=${addresses.TokenRewards}
`;

  try {
    writeFileSync(envPath, envContent, { flag: "a" });
    console.log(chalk.green("\nContract addresses appended to .env file"));
  } catch (error) {
    console.error(chalk.red("Error updating .env file:", error));
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    contracts: addresses,
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = join(
    __dirname,
    "..",
    "deployments",
    `${network.name}.json`
  );

  try {
    writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(chalk.green("\nDeployment info saved to:", deploymentPath));
  } catch (error) {
    console.error(chalk.red("Error saving deployment info:", error));
  }

  console.log(chalk.blue("\nDeployment complete! 🚀"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red("Deployment failed:", error));
    process.exit(1);
  }); 