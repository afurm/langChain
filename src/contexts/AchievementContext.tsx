'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Achievement } from '@/components/notifications/AchievementNotification';

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
  currentAchievement: Achievement | null;
  clearAchievement: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const ACHIEVEMENTS = {
  FIRST_LESSON: {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    points: 100,
    type: 'lesson' as const,
  },
  STREAK_3: {
    id: 'streak-3',
    title: 'Consistency is Key',
    description: 'Complete lessons 3 days in a row',
    points: 150,
    type: 'streak' as const,
  },
  PERFECT_QUIZ: {
    id: 'perfect-quiz',
    title: 'Perfect Score!',
    description: 'Get all questions right in a quiz',
    points: 200,
    type: 'quiz' as const,
  },
  FAST_LEARNER: {
    id: 'fast-learner',
    title: 'Fast Learner',
    description: 'Complete a lesson in under 5 minutes',
    points: 100,
    type: 'special' as const,
  },
};

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const showAchievement = useCallback((achievement: Achievement) => {
    setCurrentAchievement(achievement);
    // Auto-clear after 5 seconds
    setTimeout(() => {
      setCurrentAchievement(null);
    }, 5000);
  }, []);

  const clearAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  return (
    <AchievementContext.Provider
      value={{
        showAchievement,
        currentAchievement,
        clearAchievement,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return { ...context, ACHIEVEMENTS };
} 