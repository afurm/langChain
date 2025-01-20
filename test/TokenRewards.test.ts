import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContracts, setupTestUser, createTestLesson, advanceTime } from "./helpers";

describe("TokenRewards", function () {
  it("Should allow users to claim tokens based on points", async function () {
    const { tokenRewards, userProfile, lessonManager, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);
    await createTestLesson(lessonManager);

    // Complete a lesson to earn points
    await lessonManager.connect(user1).completeLesson(0);
    
    // Claim tokens
    await tokenRewards.connect(user1).claimTokens();
    
    const balance = await tokenRewards.balanceOf(user1.address);
    expect(balance).to.be.above(0);
  });

  it("Should enforce claim cooldown period", async function () {
    const { tokenRewards, userProfile, lessonManager, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);
    await createTestLesson(lessonManager);

    // Complete lesson and claim tokens
    await lessonManager.connect(user1).completeLesson(0);
    await tokenRewards.connect(user1).claimTokens();

    // Try to claim again immediately
    await expect(
      tokenRewards.connect(user1).claimTokens()
    ).to.be.revertedWith("Please wait for cooldown period");

    // Advance time past cooldown
    await advanceTime(24 * 60 * 60 + 1);

    // Should be able to claim again
    await tokenRewards.connect(user1).claimTokens();
  });

  it("Should not allow claims with no points", async function () {
    const { tokenRewards, userProfile, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);

    await expect(
      tokenRewards.connect(user1).claimTokens()
    ).to.be.revertedWith("No tokens to claim");
  });

  it("Should respect max supply limit", async function () {
    const { tokenRewards, userProfile, lessonManager, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);

    // Create a high-value lesson
    const maxPoints = ethers.parseEther("1000000"); // 1 million tokens worth of points
    await lessonManager.createLesson("QmTest123", 3, maxPoints);

    // Complete the lesson
    await lessonManager.connect(user1).completeLesson(0);

    // Try to claim more than max supply
    await expect(
      tokenRewards.connect(user1).claimTokens()
    ).to.be.revertedWith("Would exceed max supply");
  });

  it("Should calculate cooldown correctly", async function () {
    const { tokenRewards, userProfile, lessonManager, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);
    await createTestLesson(lessonManager);

    // Initially no cooldown
    let cooldown = await tokenRewards.getClaimCooldown(user1.address);
    expect(cooldown).to.equal(0);

    // Complete lesson and claim
    await lessonManager.connect(user1).completeLesson(0);
    await tokenRewards.connect(user1).claimTokens();

    // Should have full cooldown
    cooldown = await tokenRewards.getClaimCooldown(user1.address);
    expect(cooldown).to.be.above(0);

    // Advance time partially
    await advanceTime(12 * 60 * 60); // 12 hours

    // Should have partial cooldown
    cooldown = await tokenRewards.getClaimCooldown(user1.address);
    expect(cooldown).to.be.above(0);
    expect(cooldown).to.be.below(24 * 60 * 60);
  });

  it("Should allow owner to update contract addresses", async function () {
    const { tokenRewards, userProfile, lessonManager, owner } = await deployContracts();
    const newUserProfile = await ethers.deployContract("UserProfile");
    const newLessonManager = await ethers.deployContract("LessonManager", [await newUserProfile.getAddress()]);

    await expect(
      tokenRewards.updateContracts(
        await newUserProfile.getAddress(),
        await newLessonManager.getAddress()
      )
    ).to.emit(tokenRewards, "ContractsUpdated")
      .withArgs(await newUserProfile.getAddress(), await newLessonManager.getAddress());
  });
}); 