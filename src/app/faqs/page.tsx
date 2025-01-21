'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is LangChain?",
      answer: "LangChain is a decentralized language learning platform that combines Web3 technology with interactive education. Users can earn rewards while learning languages through AI-generated lessons and various quiz types."
    },
    {
      question: "Do I need a crypto wallet to use LangChain?",
      answer: "Yes, you'll need a Web3 wallet like MetaMask to connect to the platform. This wallet will be used to store your earned tokens and achievement NFTs."
    },
    {
      question: "How do I earn rewards?",
      answer: "You can earn rewards by completing lessons, maintaining daily streaks, achieving high scores in quizzes, and unlocking achievements. Rewards are automatically sent to your connected wallet."
    },
    {
      question: "What types of lessons are available?",
      answer: "We offer various lesson types including multiple choice questions, speaking practice, matching exercises, reordering tasks, and cloze passages. Each lesson is tailored to help you master different aspects of language learning."
    },
    {
      question: "How are the lessons generated?",
      answer: "Our lessons are generated using advanced AI technology that considers your skill level, learning pace, and preferences to create personalized content that helps you learn effectively."
    },
    {
      question: "Are my achievements permanent?",
      answer: "Yes, all your achievements and progress are stored on the Moonbeam blockchain, making them permanent and verifiable. You can view your achievements anytime in your profile."
    },
    {
      question: "Can I learn multiple languages?",
      answer: "Yes, you can learn multiple languages on our platform. Each language has its own set of lessons and progression track, allowing you to learn at your own pace."
    },
    {
      question: "What happens if I lose my internet connection during a lesson?",
      answer: "Your progress is automatically saved locally, and once your connection is restored, it will be synchronized with the blockchain. You won't lose any progress due to connection issues."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700"
                  >
                    <p className="p-4 text-gray-400">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 