import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export async function deployContracts() {
  const [owner, user1, user2] = await ethers.getSigners();

  // Deploy UserProfile
  const UserProfile = await ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();

  // Deploy LessonManager
  const LessonManager = await ethers.getContractFactory("LessonManager");
  const lessonManager = await LessonManager.deploy(await userProfile.getAddress());

  // Deploy TokenRewards
  const TokenRewards = await ethers.getContractFactory("TokenRewards");
  const tokenRewards = await TokenRewards.deploy(
    await userProfile.getAddress(),
    await lessonManager.getAddress()
  );

  return {
    userProfile,
    lessonManager,
    tokenRewards,
    owner,
    user1,
    user2,
  };
}

export async function setupTestUser(
  userProfile: any,
  signer: HardhatEthersSigner,
  username: string = "testuser"
) {
  await userProfile.connect(signer).createProfile(username);
}

export async function createTestLesson(
  lessonManager: any,
  difficulty: number = 1,
  basePoints: number = 100
) {
  const contentHash = "QmTest123";
  await lessonManager.createLesson(contentHash, difficulty, basePoints);
  return contentHash;
}

export async function advanceTime(seconds: number) {
  await time.increase(seconds);
} 