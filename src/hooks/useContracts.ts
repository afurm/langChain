'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { UserProfileABI, LessonManagerABI, TokenRewardsABI } from '@/lib/contracts/abis';
import { Profile, Lesson } from '@/types/contracts';

const CONTRACT_ADDRESSES = {
  userProfile: process.env.NEXT_PUBLIC_USER_PROFILE_CONTRACT as `0x${string}`,
  lessonManager: process.env.NEXT_PUBLIC_LESSON_MANAGER_CONTRACT as `0x${string}`,
  tokenRewards: process.env.NEXT_PUBLIC_TOKEN_REWARDS_CONTRACT as `0x${string}`,
};

export function useProfile() {
  const { address } = useAccount();
  const { data: profile, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.userProfile,
    abi: UserProfileABI,
    functionName: 'getProfile',
    args: [address!],
    enabled: !!address,
  });

  const { writeContractAsync: createProfile } = useWriteContract();
  const { writeContractAsync: updateUsername } = useWriteContract();

  const handleCreateProfile = async (username: string) => {
    await createProfile({
      address: CONTRACT_ADDRESSES.userProfile,
      abi: UserProfileABI,
      functionName: 'createProfile',
      args: [username],
    });
  };

  const handleUpdateUsername = async (newUsername: string) => {
    await updateUsername({
      address: CONTRACT_ADDRESSES.userProfile,
      abi: UserProfileABI,
      functionName: 'updateUsername',
      args: [newUsername],
    });
  };

  return {
    profile: profile as Profile | undefined,
    isLoading,
    createProfile: handleCreateProfile,
    updateUsername: handleUpdateUsername,
  };
}

export function useLessons() {
  const { writeContractAsync: completeLesson } = useWriteContract();
  
  const { data: totalLessons } = useReadContract({
    address: CONTRACT_ADDRESSES.lessonManager,
    abi: LessonManagerABI,
    functionName: 'totalLessons',
  });

  const getLessonDetails = async (lessonId: number) => {
    const result = await useReadContract.read({
      address: CONTRACT_ADDRESSES.lessonManager,
      abi: LessonManagerABI,
      functionName: 'getLessonDetails',
      args: [BigInt(lessonId)],
    });
    return result as Lesson;
  };

  const handleCompleteLesson = async (lessonId: number) => {
    await completeLesson({
      address: CONTRACT_ADDRESSES.lessonManager,
      abi: LessonManagerABI,
      functionName: 'completeLesson',
      args: [BigInt(lessonId)],
    });
  };

  return {
    totalLessons: Number(totalLessons || 0),
    getLessonDetails,
    completeLesson: handleCompleteLesson,
  };
}

export function useTokenRewards() {
  const { address } = useAccount();
  const { writeContractAsync: claimTokens } = useWriteContract();

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.tokenRewards,
    abi: TokenRewardsABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
  });

  const { data: claimCooldown } = useReadContract({
    address: CONTRACT_ADDRESSES.tokenRewards,
    abi: TokenRewardsABI,
    functionName: 'getClaimCooldown',
    args: [address!],
    enabled: !!address,
  });

  const handleClaimTokens = async () => {
    await claimTokens({
      address: CONTRACT_ADDRESSES.tokenRewards,
      abi: TokenRewardsABI,
      functionName: 'claimTokens',
    });
  };

  return {
    balance: balance ? Number(balance) / 10**18 : 0,
    claimCooldown: Number(claimCooldown || 0),
    claimTokens: handleClaimTokens,
  };
} 