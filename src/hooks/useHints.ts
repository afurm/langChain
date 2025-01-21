'use client';

import { useState } from 'react';

export function useHints() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHint = async (params: {
    lessonId?: number;
    question?: string;
    userAnswer?: string;
    topic?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/openai/hints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hint');
      }

      const data = await response.json();
      return data.hint;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get hint');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getHint,
    loading,
    error,
  };
} 