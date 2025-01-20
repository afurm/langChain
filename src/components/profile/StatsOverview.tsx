'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface StatsOverviewProps {
  stats: {
    lessonsCompleted: number;
    totalPoints: number;
    currentStreak: number;
    bestStreak: number;
    achievementsUnlocked: number;
    averageScore: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: 'Lessons Completed',
      value: stats.lessonsCompleted,
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-blue-600',
      description: 'Total lessons you have completed',
    },
    {
      title: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      icon: StarIcon,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Points earned from lessons and achievements',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: FireIcon,
      color: 'from-red-500 to-red-600',
      description: 'Keep learning to maintain your streak',
    },
    {
      title: 'Best Streak',
      value: `${stats.bestStreak} days`,
      icon: TrophyIcon,
      color: 'from-purple-500 to-purple-600',
      description: 'Your longest learning streak',
    },
    {
      title: 'Achievements',
      value: stats.achievementsUnlocked,
      icon: ClockIcon,
      color: 'from-green-500 to-green-600',
      description: 'Achievements you have unlocked',
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: ChartBarIcon,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Your average quiz score',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative group"
        >
          <div className="relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            {/* Background Gradient */}
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${stat.color}`} />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }} />
            </div>

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${stat.color} text-white`}
                >
                  <span>Details</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </motion.button>
              </div>

              <div className="space-y-2">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-2xl font-bold text-white"
                >
                  {stat.value}
                </motion.h3>
                <div className="space-y-1">
                  <p className="text-gray-400 font-medium">{stat.title}</p>
                  <p className="text-gray-500 text-sm">{stat.description}</p>
                </div>
              </div>

              {/* Progress Bar for Average Score */}
              {stat.title === 'Average Score' && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.averageScore}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.5 + index * 0.1,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Streak Flame Animation */}
              {(stat.title === 'Current Streak' || stat.title === 'Best Streak') && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-t ${stat.color} opacity-20 blur-lg`}
                />
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 