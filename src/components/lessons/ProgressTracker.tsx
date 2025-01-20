import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  timeSpent: number;
  onComplete?: () => void;
}

export default function ProgressTracker({
  currentStep,
  totalSteps,
  timeSpent,
  onComplete,
}: ProgressTrackerProps) {
  const progress = (currentStep / totalSteps) * 100;
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Time: {formatTime(timeSpent)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">
            Progress: {currentStep}/{totalSteps}
          </span>
          {currentStep === totalSteps && (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>

      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {currentStep === totalSteps && onComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <button
            onClick={onComplete}
            className="btn-primary"
          >
            Complete Lesson
          </button>
        </motion.div>
      )}
    </div>
  );
} 