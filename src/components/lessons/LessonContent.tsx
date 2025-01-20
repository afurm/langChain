'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { LessonContent as LessonContentType } from '@/lib/openai';
import { useProgress } from '@/hooks/useProgress';
import ProgressTracker from './ProgressTracker';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface LessonContentProps {
  content: LessonContentType;
  onStartQuiz: () => void;
}

export default function LessonContent({ content, onStartQuiz }: LessonContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = content.content.split('\n\n## ').map((section, index) => 
    index === 0 ? section : `## ${section}`
  );

  const { currentStep, timeSpent, isComplete, nextStep } = useProgress({
    totalSteps: sections.length,
    onProgressComplete: () => {
      // Add a small delay before showing the quiz
      setTimeout(onStartQuiz, 1000);
    },
  });

  const handleNext = () => {
    nextStep();
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  return (
    <div className="space-y-6">
      <ProgressTracker
        currentStep={currentStep}
        totalSteps={sections.length}
        timeSpent={timeSpent}
      />

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="card"
      >
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{sections[currentSection]}</ReactMarkdown>
        </div>

        {currentSection < sections.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-end"
          >
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              Next Section
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {currentSection === sections.length - 1 && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-end"
          >
            <button
              onClick={nextStep}
              className="btn-primary flex items-center gap-2"
            >
              Start Quiz
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 