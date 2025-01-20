'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'text' | 'profile';
}

export default function LoadingSkeleton({ count = 1, type = 'card' }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const skeletons = {
    card: (
      <div className="card animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-700 rounded" />
            <div className="h-6 w-32 bg-gray-700 rounded" />
          </div>
          <div className="h-6 w-24 bg-gray-700 rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-700 rounded" />
            <div className="h-4 w-24 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    ),
    text: (
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    ),
    profile: (
      <div className="card animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-700 rounded w-1/4" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-8 bg-gray-700 rounded" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <>
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          {skeletons[type]}
        </motion.div>
      ))}
    </>
  );
} 