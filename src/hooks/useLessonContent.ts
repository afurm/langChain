'use client';

import { useState } from 'react';
import { LessonContent } from '@/lib/openai';

export function useLessonContent() {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (difficulty: number, topic?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson content');
      }

      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  const getFeedback = async (
    answer: string,
    correctAnswer: string,
    difficulty: number
  ) => {
    try {
      const response = await fetch('/api/lessons/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, correctAnswer, difficulty }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const data = await response.json();
      return data.feedback;
    } catch (err) {
      console.error('Error getting feedback:', err);
      return 'Unable to generate feedback at this time.';
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