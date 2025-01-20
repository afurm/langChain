'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface Section {
  title: string;
  content: string;
}

export interface LessonContent {
  title: string;
  sections: Section[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

interface LessonContentProps {
  content: LessonContent;
  currentStep: number;
  onNext: () => void;
}

export default function LessonContent({
  content,
  currentStep,
  onNext,
}: LessonContentProps) {
  const currentSection = content.sections[currentStep];
  const isLastSection = currentStep === content.sections.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
    >
      <div className="prose prose-invert max-w-none">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">{currentSection.title}</h2>
          <ReactMarkdown>{currentSection.content}</ReactMarkdown>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
        >
          <span>{isLastSection ? 'Start Quiz' : 'Next'}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
} 