'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import LessonCard from '@/components/lessons/LessonCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useProgress } from '@/hooks/useProgress';
import lessonsData from '@/data/lessonsData.json';
import type { Question } from '@/types/quiz';
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

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

type SortOption = 'newest' | 'oldest' | 'points-high' | 'points-low';
type FilterOption = 'all' | '1' | '2' | '3' | 'completed' | 'incomplete';

export default function LessonsPage() {
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filter, setFilter] = useState<FilterOption>('all');
  const { progress, isLessonCompleted } = useProgress();

  const lessons = lessonsData.lessons as Lesson[];
  const filteredAndSortedLessons = lessons
    .filter(lesson => {
      if (filter === 'all') return true;
      if (filter === 'completed') return isLessonCompleted(lesson.id);
      if (filter === 'incomplete') return !isLessonCompleted(lesson.id);
      return lesson.difficulty.toString() === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'points-high':
          return b.points - a.points;
        case 'points-low':
          return a.points - b.points;
        default:
          return 0;
      }
    })
    .filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Available Lessons</h1>
          <p className="text-gray-400">
            Completed: {progress.completedLessons.length} / {lessonsData.lessons.length}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'incomplete'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Incomplete
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="points-high">Highest Points</option>
              <option value="points-low">Lowest Points</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} type="card" />
        </div>
      ) : filteredAndSortedLessons.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredAndSortedLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lessonId={lesson.id}
              isCompleted={isLessonCompleted(lesson.id)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No lessons found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 