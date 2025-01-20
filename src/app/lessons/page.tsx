'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useLessons, useProfile } from '@/hooks/useContracts';
import { Lesson } from '@/types/contracts';
import LessonCard from '@/components/lessons/LessonCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

type SortOption = 'newest' | 'oldest' | 'points-high' | 'points-low';
type FilterOption = 'all' | '1' | '2' | '3' | 'completed' | 'incomplete';

export default function LessonsPage() {
  const { isConnected } = useAccount();
  const { totalLessons, getLessonDetails } = useLessons();
  const { profile } = useProfile();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchLessons = async () => {
      if (!isConnected) return;
      
      try {
        const lessonPromises = Array.from({ length: totalLessons }, (_, i) =>
          getLessonDetails(i).then(lesson => ({ ...lesson, id: i }))
        );
        const fetchedLessons = await Promise.all(lessonPromises);
        setLessons(fetchedLessons);

        // Get completed lessons
        if (profile) {
          const completedPromises = fetchedLessons.map((_, index) =>
            useProfile().hasCompletedLesson(profile.address, index)
          );
          const completed = await Promise.all(completedPromises);
          setCompletedLessons(new Set(
            completed.map((isCompleted, index) => isCompleted ? index : -1).filter(i => i !== -1)
          ));
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [isConnected, totalLessons, getLessonDetails, profile]);

  const filteredAndSortedLessons = lessons
    .filter(lesson => {
      if (filterBy === 'all') return true;
      if (filterBy === 'completed') return completedLessons.has(lesson.id);
      if (filterBy === 'incomplete') return !completedLessons.has(lesson.id);
      return lesson.difficulty.toString() === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return Number(b.createdAt) - Number(a.createdAt);
        case 'oldest':
          return Number(a.createdAt) - Number(b.createdAt);
        case 'points-high':
          return (b.basePoints * b.difficulty) - (a.basePoints * a.difficulty);
        case 'points-low':
          return (a.basePoints * a.difficulty) - (b.basePoints * b.difficulty);
        default:
          return 0;
      }
    })
    .filter(lesson =>
      lesson.contentHash.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-gray-400">Please connect your wallet to view lessons</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Available Lessons</h1>
          <p className="text-gray-400">
            Completed: {completedLessons.size} / {totalLessons}
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
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="1">Beginner</option>
              <option value="2">Intermediate</option>
              <option value="3">Advanced</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>

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
              isCompleted={completedLessons.has(lesson.id)}
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