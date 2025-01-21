'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Mock data for demonstration
  useEffect(() => {
    // Simulated analytics data
    setAnalytics({
      totalUsers: 150,
      totalLessonsCompleted: 450,
      averageScore: 85,
      achievementsUnlocked: 230,
      completionRates: {
        1: 75,
        2: 60,
        3: 45,
      },
      userProgress: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [10, 25, 45, 60],
      },
    });
  }, []);

  const stats = [
    {
      icon: UsersIcon,
      value: analytics.totalUsers,
      label: 'Active Users',
    },
    {
      icon: BookOpenIcon,
      value: analytics.totalLessonsCompleted,
      label: 'Lessons Completed',
    },
    {
      icon: ChartBarIcon,
      value: `${analytics.averageScore}%`,
      label: 'Average Score',
    },
    {
      icon: TrophyIcon,
      value: analytics.achievementsUnlocked,
      label: 'Achievements Unlocked',
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
          >
            <div className="flex items-center gap-4">
              <stat.icon className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
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
            {Object.entries(analytics.completionRates).map(([difficulty, rate]) => (
              <div key={difficulty} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {difficulty}</span>
                  <span>{rate}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${rate}%` }}
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