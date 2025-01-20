import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'lesson' | 'streak' | 'quiz' | 'special';
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-4 pr-12 max-w-md">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-yellow-900 hover:text-yellow-800 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <TrophyIcon className="w-8 h-8 text-yellow-900" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">
                Achievement Unlocked!
              </h3>
              <p className="font-semibold text-yellow-900 mb-1">
                {achievement.title}
              </p>
              <p className="text-sm text-yellow-900/80 mb-2">
                {achievement.description}
              </p>
              <p className="text-sm font-medium text-yellow-900">
                +{achievement.points} points
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 