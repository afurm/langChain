'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lesson } from '@/types/contracts';
import {
  BeakerIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface LessonCardProps {
  lesson: Lesson;
  lessonId: number;
  isCompleted?: boolean;
}

export default function LessonCard({ lesson, lessonId, isCompleted }: LessonCardProps) {
  const difficultyConfig = {
    1: {
      label: 'Beginner',
      icon: BookOpenIcon,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-500',
    },
    2: {
      label: 'Intermediate',
      icon: BeakerIcon,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-500',
    },
    3: {
      label: 'Advanced',
      icon: AcademicCapIcon,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-500',
    },
  };

  const config = difficultyConfig[lesson.difficulty as keyof typeof difficultyConfig];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/lessons/${lessonId}`}>
        <div className={`relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border ${
          isCompleted ? 'border-green-500/30' : 'border-gray-700/50'
        } hover:border-blue-500/50 transition-all duration-300 group`}>
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50" />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }} />
          </div>

          {/* Content */}
          <div className="relative p-6 space-y-4">
            <div className="flex justify-between items-start">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-6 w-6 ${config.textColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Lesson {lessonId + 1}
                  </h3>
                  <span className={`text-sm ${config.textColor}`}>
                    {config.label}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${config.bgColor}`}>
                  <StarIcon className={`w-4 h-4 ${config.textColor}`} />
                  <span className={`text-sm font-medium ${config.textColor}`}>
                    {lesson.basePoints * lesson.difficulty}
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>
                  {new Date(Number(lesson.createdAt) * 1000).toLocaleDateString()}
                </span>
              </div>

              {isCompleted ? (
                <div className="flex items-center space-x-1 text-green-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-1 text-blue-400"
                >
                  <span className="text-sm">Start Learning</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/0 to-blue-500/0 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  );
} 