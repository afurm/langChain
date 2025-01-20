export type AchievementCategory = 'lessons' | 'points' | 'streaks' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  requirement: number;
  points: number;
  tier: 1 | 2 | 3; // Bronze, Silver, Gold
}

export const achievements: Achievement[] = [
  // Lesson Completion Achievements
  {
    id: 'first_lesson',
    title: 'First Step',
    description: 'Complete your first lesson',
    category: 'lessons',
    icon: '🎯',
    requirement: 1,
    points: 50,
    tier: 1,
  },
  {
    id: 'lesson_master',
    title: 'Lesson Master',
    description: 'Complete 10 lessons',
    category: 'lessons',
    icon: '📚',
    requirement: 10,
    points: 200,
    tier: 2,
  },
  {
    id: 'lesson_champion',
    title: 'Learning Champion',
    description: 'Complete 50 lessons',
    category: 'lessons',
    icon: '👑',
    requirement: 50,
    points: 1000,
    tier: 3,
  },

  // Points Achievements
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 1,000 points',
    category: 'points',
    icon: '💎',
    requirement: 1000,
    points: 100,
    tier: 1,
  },
  {
    id: 'point_master',
    title: 'Point Master',
    description: 'Earn 10,000 points',
    category: 'points',
    icon: '🏆',
    requirement: 10000,
    points: 500,
    tier: 2,
  },
  {
    id: 'point_legend',
    title: 'Point Legend',
    description: 'Earn 100,000 points',
    category: 'points',
    icon: '⭐',
    requirement: 100000,
    points: 2000,
    tier: 3,
  },

  // Streak Achievements
  {
    id: 'streak_starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day learning streak',
    category: 'streaks',
    icon: '🔥',
    requirement: 3,
    points: 150,
    tier: 1,
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day learning streak',
    category: 'streaks',
    icon: '⚡',
    requirement: 7,
    points: 300,
    tier: 2,
  },
  {
    id: 'streak_legend',
    title: 'Streak Legend',
    description: 'Maintain a 30-day learning streak',
    category: 'streaks',
    icon: '🌟',
    requirement: 30,
    points: 1500,
    tier: 3,
  },

  // Special Achievements
  {
    id: 'perfect_quiz',
    title: 'Perfect Score',
    description: 'Complete a quiz with 100% accuracy',
    category: 'special',
    icon: '🎯',
    requirement: 1,
    points: 250,
    tier: 2,
  },
  {
    id: 'advanced_master',
    title: 'Advanced Master',
    description: 'Complete 5 advanced level lessons',
    category: 'special',
    icon: '🎓',
    requirement: 5,
    points: 500,
    tier: 2,
  },
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Join during the platform launch period',
    category: 'special',
    icon: '🚀',
    requirement: 1,
    points: 1000,
    tier: 3,
  },
]; 