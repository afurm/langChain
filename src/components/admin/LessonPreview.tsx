'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lesson } from '@/types/contracts';
import { LessonContent } from '@/lib/openai';
import { getFromIPFS } from '@/lib/ipfs';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface LessonPreviewProps {
  lesson: Lesson;
  onUpdate: (lessonId: number, updates: Partial<Lesson>) => Promise<void>;
  onDelete: (lessonId: number) => Promise<void>;
}

export default function LessonPreview({
  lesson,
  onUpdate,
  onDelete,
}: LessonPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [editForm, setEditForm] = useState({
    difficulty: lesson.difficulty,
    basePoints: lesson.basePoints,
  });

  const difficultyLabels = ['Beginner', 'Intermediate', 'Advanced'];

  const handlePreview = async () => {
    if (!isPreviewOpen && !content) {
      try {
        setIsLoading(true);
        const ipfsContent = await getFromIPFS(lesson.contentHash);
        setContent(ipfsContent);
      } catch (error) {
        console.error('Error fetching lesson content:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsPreviewOpen(!isPreviewOpen);
  };

  const handleUpdate = async () => {
    try {
      await onUpdate(lesson.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold mb-1">
              Lesson {lesson.id + 1}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>
                Difficulty: {difficultyLabels[lesson.difficulty - 1]}
              </span>
              <span>Points: {lesson.basePoints}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreview}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(lesson.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={editForm.difficulty}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      difficulty: Number(e.target.value)
                    }))}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={1}>Beginner</option>
                    <option value={2}>Intermediate</option>
                    <option value={3}>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Base Points
                  </label>
                  <input
                    type="number"
                    value={editForm.basePoints}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      basePoints: Number(e.target.value)
                    }))}
                    min={1}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Preview */}
        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-gray-700 pt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <ArrowPathIcon className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : content ? (
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-xl font-bold mb-4">{content.title}</h2>
                    <ReactMarkdown>{content.content}</ReactMarkdown>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Quiz Questions</h3>
                      <ol className="list-decimal pl-4 space-y-4">
                        {content.quiz.map((q, i) => (
                          <li key={i}>
                            <p className="font-medium">{q.question}</p>
                            <ul className="mt-2 space-y-1">
                              {q.options.map((option, j) => (
                                <li
                                  key={j}
                                  className={
                                    j === q.correctIndex
                                      ? 'text-green-500'
                                      : 'text-gray-400'
                                  }
                                >
                                  {option}
                                  {j === q.correctIndex && ' ✓'}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Failed to load content</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 