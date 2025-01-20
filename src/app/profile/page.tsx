'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useProfile, useTokenRewards } from '@/hooks/useContracts';
import { achievements } from '@/config/achievements';
import StatsOverview from '@/components/profile/StatsOverview';
import AchievementCard from '@/components/profile/AchievementCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import {
  PencilIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { isConnected } = useAccount();
  const { profile, isLoading, updateUsername } = useProfile();
  const { balance, claimCooldown, claimTokens } = useTokenRewards();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  // Mock data - replace with real data from contracts
  const [stats, setStats] = useState({
    lessonsCompleted: profile?.totalLessonsCompleted || 0,
    totalPoints: profile?.totalPoints || 0,
    currentStreak: 0,
    bestStreak: 0,
    achievementsUnlocked: 0,
    averageScore: 0,
  });

  const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (profile) {
      // Update stats when profile data changes
      setStats(prev => ({
        ...prev,
        lessonsCompleted: profile.totalLessonsCompleted,
        totalPoints: profile.totalPoints,
      }));

      // Calculate achievement progress
      const progress: Record<string, number> = {};
      achievements.forEach(achievement => {
        if (achievement.category === 'lessons') {
          progress[achievement.id] = profile.totalLessonsCompleted;
        } else if (achievement.category === 'points') {
          progress[achievement.id] = profile.totalPoints;
        }
        // Add other achievement progress calculations
      });
      setAchievementProgress(progress);
    }
  }, [profile]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername) return;

    try {
      await updateUsername(newUsername);
      setIsEditing(false);
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleClaimTokens = async () => {
    if (isClaiming || claimCooldown > 0) return;
    
    try {
      setIsClaiming(true);
      await claimTokens();
    } catch (error) {
      console.error('Error claiming tokens:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-gray-400">Please connect your wallet to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton type="profile" count={1} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                {profile?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                {isEditing ? (
                  <form onSubmit={handleUpdateUsername} className="flex gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="New username"
                      className="bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button type="submit" className="btn-primary">Save</button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{profile?.username}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <p className="text-gray-400">Member since {new Date(Number(profile?.lastActivityTimestamp) * 1000).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Token Balance</p>
                <p className="text-2xl font-bold">{balance.toFixed(2)} LLT</p>
              </div>
              <button
                onClick={handleClaimTokens}
                disabled={isClaiming || claimCooldown > 0}
                className={`btn-primary flex items-center gap-2 ${
                  (isClaiming || claimCooldown > 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isClaiming ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <CurrencyDollarIcon className="w-5 h-5" />
                )}
                {claimCooldown > 0
                  ? `Claim in ${Math.ceil(claimCooldown / 3600)}h`
                  : 'Claim Tokens'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Statistics</h2>
          <StatsOverview stats={stats} />
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                progress={achievementProgress[achievement.id] || 0}
                unlocked={
                  (achievementProgress[achievement.id] || 0) >= achievement.requirement
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 