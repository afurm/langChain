'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  difficulty: number;
  getFeedback: (answer: string, correctAnswer: string, difficulty: number) => Promise<string>;
  onComplete: (score: number) => void;
}

export default function Quiz({
  questions,
  difficulty,
  getFeedback,
  onComplete,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = async (answerIndex: number) => {
    if (isSubmitting || selectedAnswer !== null) return;

    setIsSubmitting(true);
    setSelectedAnswer(answerIndex);

    const currentQuiz = questions[currentQuestion];
    const isCorrect = answerIndex === currentQuiz.correctIndex;

    try {
      const feedback = await getFeedback(
        currentQuiz.options[answerIndex],
        currentQuiz.options[currentQuiz.correctIndex],
        difficulty
      );
      setFeedback(feedback);
    } catch (error) {
      setFeedback(isCorrect ? 'Correct!' : 'Incorrect. Try again next time.');
    } finally {
      setIsSubmitting(false);
    }

    // Store the answer
    setAnswers(prev => [...prev, answerIndex]);

    // Wait a moment before moving to next question or completing
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setFeedback('');
      } else {
        // Calculate score
        const correctAnswers = answers.filter(
          (answer, index) => answer === questions[index].correctIndex
        ).length + (isCorrect ? 1 : 0);
        const score = Math.round((correctAnswers / questions.length) * 100);
        onComplete(score);
      }
    }, 2000);
  };

  const currentQuiz = questions[currentQuestion];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <span className="text-gray-400">
          Score: {answers.filter(
            (answer, index) => answer === questions[index].correctIndex
          ).length} / {questions.length}
        </span>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <p className="text-lg">{currentQuiz.question}</p>

        <div className="space-y-3">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null || isSubmitting}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedAnswer === null
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : selectedAnswer === index
                  ? index === currentQuiz.correctIndex
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : 'bg-red-500/20 border-2 border-red-500'
                  : index === currentQuiz.correctIndex
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedAnswer !== null && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    {index === currentQuiz.correctIndex && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </motion.span>
                )}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg ${
                selectedAnswer === currentQuiz.correctIndex
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              }`}
            >
              <p className="text-sm">{feedback}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading State */}
      {isSubmitting && (
        <div className="flex justify-center">
          <ArrowPathIcon className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Progress */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
} 