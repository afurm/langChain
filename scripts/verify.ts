import { run } from "hardhat";
import { join } from "path";
import { readFileSync } from "fs";
import chalk from "chalk";

async function main() {
  const network = process.env.HARDHAT_NETWORK;
  if (!network) {
    throw new Error("Please specify network (moonbase/moonbeam)");
  }

  console.log(chalk.blue(`Verifying contracts on ${network}...`));

  // Read deployment info
  const deploymentPath = join(__dirname, "..", "deployments", `${network}.json`);
  const deploymentInfo = JSON.parse(readFileSync(deploymentPath, "utf8"));

  // Verify UserProfile
  console.log(chalk.yellow("\nVerifying UserProfile..."));
  try {
    await run("verify:verify", {
      address: deploymentInfo.contracts.UserProfile,
      constructorArguments: [],
    });
    console.log(chalk.green("UserProfile verified successfully"));
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(chalk.yellow("UserProfile already verified"));
    } else {
      console.error(chalk.red("Error verifying UserProfile:", error));
    }
  }

  // Verify LessonManager
  console.log(chalk.yellow("\nVerifying LessonManager..."));
  try {
    await run("verify:verify", {
      address: deploymentInfo.contracts.LessonManager,
      constructorArguments: [deploymentInfo.contracts.UserProfile],
    });
    console.log(chalk.green("LessonManager verified successfully"));
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(chalk.yellow("LessonManager already verified"));
    } else {
      console.error(chalk.red("Error verifying LessonManager:", error));
    }
  }

  // Verify TokenRewards
  console.log(chalk.yellow("\nVerifying TokenRewards..."));
  try {
    await run("verify:verify", {
      address: deploymentInfo.contracts.TokenRewards,
      constructorArguments: [
        deploymentInfo.contracts.UserProfile,
        deploymentInfo.contracts.LessonManager,
      ],
    });
    console.log(chalk.green("TokenRewards verified successfully"));
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(chalk.yellow("TokenRewards already verified"));
    } else {
      console.error(chalk.red("Error verifying TokenRewards:", error));
    }
  }

  console.log(chalk.blue("\nVerification complete! 🎉"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red("Verification failed:", error));
    process.exit(1);
  }); 