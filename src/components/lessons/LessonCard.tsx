'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';

interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: number;
  points: number;
  createdAt: Date;
}

interface LessonCardProps {
  lesson: Lesson;
  lessonId: number;
  isCompleted?: boolean;
}

export default function LessonCard({ lesson, lessonId, isCompleted = false }: LessonCardProps) {
  const difficultyLabels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all duration-300 ${
        isCompleted ? 'bg-green-900/10' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">{lesson.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{lesson.description}</p>
          </div>
          {isCompleted && (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {Array.from({ length: lesson.difficulty }).map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-5 h-5 text-yellow-500"
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {difficultyLabels[lesson.difficulty - 1]}
            </span>
          </div>
          <div className="text-sm font-medium text-blue-400">
            {lesson.points} Points
          </div>
        </div>

        <Link
          href={`/lessons/${lessonId}`}
          className="absolute inset-0 z-10"
          aria-label={`View lesson: ${lesson.title}`}
        />
      </div>
    </motion.div>
  );
} 