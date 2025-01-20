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
  lastActivityTimestamp: new Date("2024-02-15"),
  achievements: [
    { id: "FIRST_LESSON", unlockedAt: new Date("2024-02-01") },
    { id: "STREAK_3", unlockedAt: new Date("2024-02-10") }
  ]
};

export default function ProfilePage() {
  const [loading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(MOCK_USER.username);

  const handleUpdateUsername = async (newUsername: string) => {
    setUsername(newUsername);
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton count={3} type="card" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              {editMode ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdateUsername(username)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{username}</h1>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <PencilIcon className="w-4 h-4" />
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
      </div>

      {/* Stats Overview */}
      <StatsOverview
        lessonsCompleted={MOCK_USER.totalLessonsCompleted}
        totalPoints={MOCK_USER.totalPoints}
      />

      {/* Achievements */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={MOCK_USER.achievements.some(a => a.id === achievement.id)}
              unlockedAt={MOCK_USER.achievements.find(a => a.id === achievement.id)?.unlockedAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 