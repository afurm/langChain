'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = async (answerIndex: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Wait a moment to show the result
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
      const finalScore = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
      onComplete(finalScore);
    }

    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Quiz</h2>
      
      {!showResults ? (
        <div className="space-y-6">
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <h3 className="text-lg font-medium mt-2">
              {questions[currentQuestion].question}
            </h3>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isSubmitting || selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedAnswer === null
                    ? 'bg-gray-700/50 hover:bg-gray-700'
                    : selectedAnswer === index
                    ? index === questions[currentQuestion].correctIndex
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-red-500/20 border-red-500'
                    : index === questions[currentQuestion].correctIndex
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-700/50'
                } ${
                  selectedAnswer === null ? 'border-transparent' : 'border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer !== null && (
                    index === questions[currentQuestion].correctIndex ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : selectedAnswer === index ? (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    ) : null
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">
            Quiz Complete!
          </h3>
          <p className="text-gray-400">
            You scored {Math.round((score / questions.length) * 100)}%
          </p>
        </div>
      )}
    </motion.div>
  );
} 