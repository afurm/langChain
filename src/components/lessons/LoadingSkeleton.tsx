'use client';

import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-700/50 rounded-lg w-2/3 animate-pulse" />

        {/* Content Skeletons */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-700/50 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-700/50 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-700/50 rounded w-4/6 animate-pulse" />
        </div>

        {/* Section Skeletons */}
        <div className="space-y-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-gray-700/50 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-700/50 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-700/50 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 