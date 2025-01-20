'use client';

import { useState } from 'react';
import { LessonContent, generateLesson, generateFeedback } from '@/lib/openai';

export function useLessonContent() {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (difficulty: number, topic: string) => {
    setLoading(true);
    setError(null);

    try {
      const lessonContent = await generateLesson(difficulty, topic);
      setContent(lessonContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lesson content');
    } finally {
      setLoading(false);
    }
  };

  const getFeedback = async (userAnswer: string, correctAnswer: string, difficulty: number) => {
    try {
      return await generateFeedback(userAnswer, correctAnswer, difficulty);
    } catch (err) {
      console.error('Error getting feedback:', err);
      return 'Failed to generate feedback';
    }
  };

  return {
    content,
    loading,
    error,
    generateContent,
    getFeedback,
  };
} 