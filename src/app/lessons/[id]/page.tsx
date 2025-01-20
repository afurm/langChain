'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useLessonContent } from '@/hooks/useLessonContent';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/contexts/AchievementContext';
import { Achievement } from '@/types/achievements';
import LessonContent from '@/components/lessons/LessonContent';
import Quiz from '@/components/lessons/Quiz';
import LoadingSkeleton from '@/components/lessons/LoadingSkeleton';

const MOCK_LESSONS = {
  '1': {
    title: 'Basic Spanish Greetings',
    difficulty: 1,
    topic: 'Spanish greetings and introductions',
  },
  '2': {
    title: 'French Numbers 1-10',
    difficulty: 1,
    topic: 'French numbers and counting',
  },
  // Add more mock lessons as needed
};

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const lesson = MOCK_LESSONS[lessonId as keyof typeof MOCK_LESSONS];

  const [showQuiz, setShowQuiz] = useState(false);
  const { content, loading, error, generateContent } = useLessonContent();
  const { showAchievement } = useAchievements();
  const { currentStep, timeSpent, nextStep, isComplete } = useProgress({
    totalSteps: content ? content.sections.length : 0,
    onProgressComplete: () => setShowQuiz(true),
  });

  // Load lesson content
  useEffect(() => {
    if (lesson) {
      generateContent(lesson.difficulty, lesson.topic);
    }
  }, [lesson, generateContent]);

  const handleQuizComplete = (score: number) => {
    // Check for achievements
    if (score === 100) {
      showAchievement('PERFECT_QUIZ' as Achievement);
    }
    if (timeSpent < 300) { // 5 minutes
      showAchievement('FAST_LEARNER' as Achievement);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500">Error loading lesson: {error}</div>;
  if (!content) return <div>No lesson content available.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">{lesson?.title}</h1>

        {!showQuiz ? (
          <LessonContent
            content={content}
            currentStep={currentStep}
            onNext={nextStep}
          />
        ) : (
          <Quiz
            questions={content.quiz}
            onComplete={handleQuizComplete}
          />
        )}
      </motion.div>
    </div>
  );
} 