'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { achievements } from '@/config/achievements';
import StatsOverview from '@/components/profile/StatsOverview';
import AchievementCard from '@/components/profile/AchievementCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import {
  PencilIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Mock user data for development
const MOCK_USER = {
  username: "Language Learner",
  totalLessonsCompleted: 5,
  totalPoints: 750,
  currentStreak: 3,
  bestStreak: 5,
  achievementsUnlocked: 2,
  averageScore: 85,
  lastActivityTimestamp: new Date("2024-02-15"),
  achievements: [
    { id: "FIRST_LESSON", unlockedAt: new Date("2024-02-01") },
    { id: "STREAK_3", unlockedAt: new Date("2024-02-10") }
  ]
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(MOCK_USER.username);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
              {username.charAt(0)}
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{username}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              <p className="text-gray-400">
                Last active:{' '}
                {MOCK_USER.lastActivityTimestamp.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview
          stats={{
            lessonsCompleted: MOCK_USER.totalLessonsCompleted,
            totalPoints: MOCK_USER.totalPoints,
            currentStreak: MOCK_USER.currentStreak,
            bestStreak: MOCK_USER.bestStreak,
            achievementsUnlocked: MOCK_USER.achievementsUnlocked,
            averageScore: MOCK_USER.averageScore
          }}
        />

        {/* Achievements */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={MOCK_USER.achievements.some(a => a.id === achievement.id)}
                progress={achievement.requirement}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 