'use client';

import { useState, useEffect } from 'react';

interface Progress {
  completedLessons: number[];
  quizScores: Record<number, number>;
  lastLoginDate: string;
  currentStreak: number;
  totalPoints: number;
}

const defaultProgress: Progress = {
  completedLessons: [],
  quizScores: {},
  lastLoginDate: new Date().toISOString().split('T')[0],
  currentStreak: 0,
  totalPoints: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useEffect(() => {
    // Load progress from localStorage on mount
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    // Check and update streak
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      setProgress(prev => ({
        ...prev,
        lastLoginDate: today,
        currentStreak: prev.lastLoginDate === yesterdayStr ? prev.currentStreak + 1 : 1,
      }));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (lessonId: number, score: number) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, lessonId])],
      quizScores: { ...prev.quizScores, [lessonId]: score },
      totalPoints: prev.totalPoints + Math.round(score),
    }));
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getLessonScore = (lessonId: number) => {
    return progress.quizScores[lessonId] || 0;
  };

  return {
    progress,
    completeLesson,
    isLessonCompleted,
    getLessonScore,
  };
} 