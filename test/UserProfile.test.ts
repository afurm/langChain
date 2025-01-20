import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContracts, setupTestUser } from "./helpers";

describe("UserProfile", function () {
  it("Should allow users to create profiles", async function () {
    const { userProfile, user1 } = await deployContracts();
    const username = "testuser";

    await userProfile.connect(user1).createProfile(username);
    const profile = await userProfile.getProfile(user1.address);

    expect(profile.username).to.equal(username);
    expect(profile.isActive).to.be.true;
    expect(profile.totalLessonsCompleted).to.equal(0);
    expect(profile.totalPoints).to.equal(0);
  });

  it("Should not allow duplicate profiles", async function () {
    const { userProfile, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);

    await expect(
      userProfile.connect(user1).createProfile("newuser")
    ).to.be.revertedWith("Profile already exists");
  });

  it("Should allow users to update their username", async function () {
    const { userProfile, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);

    const newUsername = "updateduser";
    await userProfile.connect(user1).updateUsername(newUsername);
    const profile = await userProfile.getProfile(user1.address);

    expect(profile.username).to.equal(newUsername);
  });

  it("Should track lesson completion correctly", async function () {
    const { userProfile, lessonManager, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);

    const lessonId = 1;
    const points = 100;
    await userProfile.connect(lessonManager).completeLesson(user1.address, lessonId, points);

    const profile = await userProfile.getProfile(user1.address);
    expect(profile.totalLessonsCompleted).to.equal(1);
    expect(profile.totalPoints).to.equal(points);

    const hasCompleted = await userProfile.hasCompletedLesson(user1.address, lessonId);
    expect(hasCompleted).to.be.true;
  });

  it("Should not allow completing the same lesson twice", async function () {
    const { userProfile, lessonManager, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);

    const lessonId = 1;
    const points = 100;

    await userProfile.connect(lessonManager).completeLesson(user1.address, lessonId, points);
    
    await expect(
      userProfile.connect(lessonManager).completeLesson(user1.address, lessonId, points)
    ).to.be.revertedWith("Lesson already completed");
  });

  it("Should require an active profile for operations", async function () {
    const { userProfile, user1 } = await deployContracts();

    await expect(
      userProfile.connect(user1).updateUsername("newname")
    ).to.be.revertedWith("Profile does not exist");

    await expect(
      userProfile.getProfile(user1.address)
    ).to.be.revertedWith("Profile does not exist");
  });
}); 