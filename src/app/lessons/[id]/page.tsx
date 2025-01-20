'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessons } from '@/hooks/useContracts';
import { useLessonContent } from '@/hooks/useLessonContent';
import { useAchievements } from '@/contexts/AchievementContext';
import { Lesson } from '@/types/contracts';
import { LessonContent as LessonContentType } from '@/lib/openai';
import { getFromIPFS } from '@/lib/ipfs';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import LessonContent from '@/components/lessons/LessonContent';
import Quiz from '@/components/lessons/Quiz';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function LessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { getLessonDetails, completeLesson } = useLessons();
  const { getFeedback } = useLessonContent();
  const { showAchievement, ACHIEVEMENTS } = useAchievements();
  const [lesson, setLesson] = useState<Lesson>();
  const [content, setContent] = useState<LessonContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const fetchLesson = async () => {
      if (!isConnected || !id) return;
      
      try {
        setLoading(true);
        const lessonData = await getLessonDetails(Number(id));
        setLesson(lessonData);
        
        if (lessonData.contentHash) {
          const ipfsContent = await getFromIPFS(lessonData.contentHash);
          setContent(ipfsContent);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setError('Failed to load lesson content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [isConnected, id, getLessonDetails]);

  const handleComplete = async (quizScore: number) => {
    if (!id || completing) return;
    
    try {
      setCompleting(true);
      await completeLesson(Number(id));

      // Check for achievements
      const timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
      
      // First lesson achievement
      if (Number(id) === 0) {
        showAchievement(ACHIEVEMENTS.FIRST_LESSON);
      }

      // Fast learner achievement
      if (timeSpent < 300) { // Less than 5 minutes
        showAchievement(ACHIEVEMENTS.FAST_LEARNER);
      }

      // Perfect quiz achievement
      if (quizScore === 100) {
        showAchievement(ACHIEVEMENTS.PERFECT_QUIZ);
      }

      router.push('/lessons');
    } catch (error) {
      console.error('Error completing lesson:', error);
      setError('Failed to complete lesson. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-gray-400">Please connect your wallet to view this lesson</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton type="text" count={3} />
      </div>
    );
  }

  if (error || !lesson || !content) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {error || 'Lesson Not Found'}
        </h1>
        <button
          onClick={() => router.push('/lessons')}
          className="btn-primary inline-flex items-center"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Lessons
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.push('/lessons')}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Lessons
            </button>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <LessonContent
                key="content"
                content={content}
                onStartQuiz={() => setShowQuiz(true)}
              />
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="card"
              >
                <Quiz
                  questions={content.quiz}
                  difficulty={lesson.difficulty}
                  getFeedback={getFeedback}
                  onComplete={handleComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 