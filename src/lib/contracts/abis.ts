export const UserProfileABI = [
  {
    inputs: [{ name: "username", type: "string" }],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getProfile",
    outputs: [
      { name: "username", type: "string" },
      { name: "totalLessonsCompleted", type: "uint256" },
      { name: "totalPoints", type: "uint256" },
      { name: "lastActivityTimestamp", type: "uint256" },
      { name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "lessonId", type: "uint256" },
    ],
    name: "hasCompletedLesson",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "newUsername", type: "string" }],
    name: "updateUsername",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const LessonManagerABI = [
  {
    inputs: [{ name: "lessonId", type: "uint256" }],
    name: "getLessonDetails",
    outputs: [
      { name: "contentHash", type: "string" },
      { name: "difficulty", type: "uint256" },
      { name: "basePoints", type: "uint256" },
      { name: "isActive", type: "bool" },
      { name: "createdAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "lessonId", type: "uint256" }],
    name: "completeLesson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalLessons",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const TokenRewardsABI = [
  {
    inputs: [],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getClaimCooldown",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const; 