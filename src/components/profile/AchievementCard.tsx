'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/config/achievements';

interface AchievementCardProps {
  achievement: Achievement;
  progress: number;
  unlocked: boolean;
}

export default function AchievementCard({ achievement, progress, unlocked }: AchievementCardProps) {
  const progressPercentage = Math.min((progress / achievement.requirement) * 100, 100);
  
  const tierColors = {
    1: 'from-amber-600 to-amber-800', // Bronze
    2: 'from-gray-400 to-gray-600',   // Silver
    3: 'from-yellow-400 to-yellow-600', // Gold
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-lg ${
        unlocked ? 'bg-gray-800' : 'bg-gray-800/50'
      } p-4`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${tierColors[achievement.tier]}`}>
            {achievement.points} pts
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}/{achievement.requirement}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                unlocked ? 'bg-green-500' : 'bg-blue-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Unlocked Status */}
        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2"
          >
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 