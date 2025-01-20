export interface Profile {
  username: string;
  totalLessonsCompleted: number;
  totalPoints: number;
  lastActivityTimestamp: number;
  isActive: boolean;
}

export interface Lesson {
  contentHash: string;
  difficulty: number;
  basePoints: number;
  isActive: boolean;
  createdAt: number;
}

export interface UserProfileContract {
  createProfile: (username: string) => Promise<void>;
  getProfile: (address: string) => Promise<Profile>;
  hasCompletedLesson: (address: string, lessonId: number) => Promise<boolean>;
  updateUsername: (newUsername: string) => Promise<void>;
}

export interface LessonManagerContract {
  getLessonDetails: (lessonId: number) => Promise<Lesson>;
  completeLesson: (lessonId: number) => Promise<void>;
  totalLessons: () => Promise<number>;
}

export interface TokenRewardsContract {
  claimTokens: () => Promise<void>;
  getClaimCooldown: (address: string) => Promise<number>;
  balanceOf: (address: string) => Promise<bigint>;
} 