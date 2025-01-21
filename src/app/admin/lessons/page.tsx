'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonContent } from '@/hooks/useLessonContent';
import { LessonContent } from '@/lib/openai';
import { uploadToIPFS } from '@/lib/ipfs';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function AdminLessonsPage() {
  const { generateContent } = useLessonContent();
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newLesson, setNewLesson] = useState({
    topic: '',
    difficulty: 1,
    basePoints: 100,
  });

  const handleGenerateContent = async () => {
    if (!newLesson.topic) return;
    
    try {
      setIsGenerating(true);
      await generateContent(newLesson.difficulty, newLesson.topic);
      // Mock lesson creation - replace with actual contract call
      console.log('Generated content for:', newLesson.topic);
      setIsCreating(false);
      setNewLesson({ topic: '', difficulty: 1, basePoints: 100 });
    } catch (error) {
      console.error('Error generating lesson:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lesson Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create Lesson
        </button>
      </div>

      {/* Create Lesson Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card space-y-6">
              <h2 className="text-xl font-semibold">Create New Lesson</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={newLesson.topic}
                    onChange={(e) => setNewLesson(prev => ({
                      ...prev,
                      topic: e.target.value
                    }))}
                    placeholder="e.g., Past Perfect Tense"
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newLesson.difficulty}
                    onChange={(e) => setNewLesson(prev => ({
                      ...prev,
                      difficulty: Number(e.target.value)
                    }))}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    value={newLesson.basePoints}
                    onChange={(e) => setNewLesson(prev => ({
                      ...prev,
                      basePoints: Number(e.target.value)
                    }))}
                    min={1}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !newLesson.topic}
                  className="btn-primary flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      Generate & Create
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Lessons</h2>
        <div className="grid gap-4">
          {/* Lesson items will be mapped here */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 