import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContracts, setupTestUser, createTestLesson } from "./helpers";

describe("LessonManager", function () {
  it("Should allow owner to create lessons", async function () {
    const { lessonManager } = await deployContracts();
    const contentHash = "QmTest123";
    const difficulty = 1;
    const basePoints = 100;

    await lessonManager.createLesson(contentHash, difficulty, basePoints);
    const lesson = await lessonManager.getLessonDetails(0);

    expect(lesson.contentHash).to.equal(contentHash);
    expect(lesson.difficulty).to.equal(difficulty);
    expect(lesson.basePoints).to.equal(basePoints);
    expect(lesson.isActive).to.be.true;
  });

  it("Should not allow non-owners to create lessons", async function () {
    const { lessonManager, user1 } = await deployContracts();
    const contentHash = "QmTest123";

    await expect(
      lessonManager.connect(user1).createLesson(contentHash, 1, 100)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should validate difficulty levels", async function () {
    const { lessonManager } = await deployContracts();
    const contentHash = "QmTest123";

    await expect(
      lessonManager.createLesson(contentHash, 0, 100)
    ).to.be.revertedWith("Invalid difficulty level");

    await expect(
      lessonManager.createLesson(contentHash, 4, 100)
    ).to.be.revertedWith("Invalid difficulty level");
  });

  it("Should allow users to complete lessons", async function () {
    const { lessonManager, userProfile, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);
    await createTestLesson(lessonManager);

    await lessonManager.connect(user1).completeLesson(0);
    const hasCompleted = await userProfile.hasCompletedLesson(user1.address, 0);
    expect(hasCompleted).to.be.true;
  });

  it("Should not allow completing inactive lessons", async function () {
    const { lessonManager, userProfile, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);
    await createTestLesson(lessonManager);

    await lessonManager.deactivateLesson(0);
    
    await expect(
      lessonManager.connect(user1).completeLesson(0)
    ).to.be.revertedWith("Lesson does not exist or is inactive");
  });

  it("Should allow owner to update lesson content", async function () {
    const { lessonManager } = await deployContracts();
    await createTestLesson(lessonManager);

    const newContentHash = "QmNewTest123";
    await lessonManager.updateLesson(0, newContentHash);

    const lesson = await lessonManager.getLessonDetails(0);
    expect(lesson.contentHash).to.equal(newContentHash);
  });

  it("Should track total lessons correctly", async function () {
    const { lessonManager } = await deployContracts();

    const initialTotal = await lessonManager.totalLessons();
    expect(initialTotal).to.equal(0);

    await createTestLesson(lessonManager);
    await createTestLesson(lessonManager);

    const newTotal = await lessonManager.totalLessons();
    expect(newTotal).to.equal(2);
  });

  it("Should emit appropriate events", async function () {
    const { lessonManager, userProfile, user1 } = await deployContracts();
    await setupTestUser(userProfile, user1);
    const contentHash = "QmTest123";

    await expect(lessonManager.createLesson(contentHash, 1, 100))
      .to.emit(lessonManager, "LessonCreated")
      .withArgs(0, contentHash, 1);

    await expect(lessonManager.connect(user1).completeLesson(0))
      .to.emit(lessonManager, "LessonCompleted")
      .withArgs(user1.address, 0, 100);
  });
}); 