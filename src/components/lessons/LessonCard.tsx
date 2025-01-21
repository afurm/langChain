'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { Question } from '@/types/quiz';

interface Lesson {
  id: number;
  title: string;
  description: string;
  language: string;
  difficulty: number;
  points: number;
  sections: {
    title: string;
    content: string;
  }[];
  quiz: Question[];
}

interface LessonCardProps {
  lesson: Lesson;
  lessonId: number;
  isCompleted: boolean;
}

export default function LessonCard({ lesson, lessonId, isCompleted }: LessonCardProps) {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'text-green-500';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

  return (
    <Link href={`/lessons/${lessonId}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer relative overflow-hidden"
      >
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          </div>
        )}
        <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-400 mb-4">{lesson.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={getDifficultyColor(lesson.difficulty)}>
              {getDifficultyText(lesson.difficulty)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{lesson.language}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">{lesson.points}</span>
            <span className="text-gray-400">points</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 