'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/contexts/AchievementContext';
import LessonContent from '@/components/lessons/LessonContent';
import Quiz from '@/components/lessons/Quiz';
import type { Question } from '@/types/quiz';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import lessonsData from '@/data/lessonsData.json';

interface LessonData {
  id: number;
  title: string;
  description: string;
  language: string;
  difficulty: number;
  points: number;
  sections: {
    title: string;
    content: string;
  }[];
  quiz: Question[];
}

export default function LessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const lessonId = parseInt(id as string);
  const lesson = lessonsData.lessons.find(l => l.id === lessonId) as LessonData;
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { showAchievement, ACHIEVEMENTS } = useAchievements();
  const { completeLesson, isLessonCompleted } = useProgress();

  useEffect(() => {
    if (!lesson) {
      router.push('/lessons');
    }
  }, [lesson, router]);

  const handleQuizComplete = (score: number) => {
    // Check for achievements
    if (score === 100) {
      showAchievement(ACHIEVEMENTS.PERFECT_QUIZ);
    }
    if (!isLessonCompleted(lessonId)) {
      showAchievement(ACHIEVEMENTS.FIRST_LESSON);
    }
    completeLesson(lessonId, score);
    router.push('/lessons');
  };

  if (!lesson) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">{lesson.title}</h1>

        {!showQuiz ? (
          <LessonContent
            content={{
              title: lesson.title,
              sections: lesson.sections,
              quiz: lesson.quiz.map(q => ({
                question: q.question,
                options: q.options || [],
                correctIndex: q.correctIndex || 0
              }))
            }}
            currentStep={currentStep}
            onNext={() => {
              if (currentStep < lesson.sections.length - 1) {
                setCurrentStep(prev => prev + 1);
              } else {
                setShowQuiz(true);
              }
            }}
          />
        ) : (
          <Quiz
            questions={lesson.quiz}
            onComplete={handleQuizComplete}
            lessonId={lessonId}
            topic={lesson.title}
          />
        )}
      </motion.div>
    </div>
  );
} 