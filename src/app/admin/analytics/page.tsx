'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLessons, useProfile } from '@/hooks/useContracts';
import { Lesson } from '@/types/contracts';
import {
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface Analytics {
  totalUsers: number;
  totalLessonsCompleted: number;
  averageScore: number;
  achievementsUnlocked: number;
  completionRates: Record<number, number>;
  userProgress: {
    labels: string[];
    data: number[];
  };
}

export default function AnalyticsPage() {
  const { totalLessons, getLessonDetails } = useLessons();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalLessonsCompleted: 0,
    averageScore: 0,
    achievementsUnlocked: 0,
    completionRates: {},
    userProgress: {
      labels: [],
      data: [],
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch lesson details
        const lessonPromises = Array.from({ length: totalLessons }, (_, i) =>
          getLessonDetails(i)
        );
        const lessons = await Promise.all(lessonPromises);

        // Calculate completion rates by difficulty
        const completionRates = lessons.reduce((acc, lesson) => {
          acc[lesson.difficulty] = (acc[lesson.difficulty] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        // Mock data - replace with real data from contracts
        setAnalytics({
          totalUsers: 150,
          totalLessonsCompleted: 450,
          averageScore: 85,
          achievementsUnlocked: 280,
          completionRates,
          userProgress: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [120, 180, 250, 450],
          },
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [totalLessons, getLessonDetails]);

  const stats = [
    {
      icon: UsersIcon,
      label: 'Total Users',
      value: analytics.totalUsers,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BookOpenIcon,
      label: 'Lessons Completed',
      value: analytics.totalLessonsCompleted,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: ChartBarIcon,
      label: 'Average Score',
      value: `${analytics.averageScore}%`,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrophyIcon,
      label: 'Achievements Unlocked',
      value: analytics.achievementsUnlocked,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-32 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-lg p-6`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Completion Rates by Difficulty */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            Completion Rates by Difficulty
          </h2>
          <div className="space-y-4">
            {Object.entries(analytics.completionRates).map(([difficulty, count]) => (
              <div key={difficulty}>
                <div className="flex justify-between text-sm mb-1">
                  <span>Level {difficulty}</span>
                  <span>{count} lessons</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(count / totalLessons) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Progress Over Time */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            User Progress Over Time
          </h2>
          <div className="relative h-64">
            {analytics.userProgress.data.map((value, index) => {
              const height = (value / Math.max(...analytics.userProgress.data)) * 100;
              return (
                <div
                  key={index}
                  className="absolute bottom-0 flex flex-col items-center"
                  style={{
                    left: `${(index / (analytics.userProgress.labels.length - 1)) * 100}%`,
                    width: '20%',
                  }}
                >
                  <motion.div
                    className="w-full bg-blue-500 rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {analytics.userProgress.labels[index]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 