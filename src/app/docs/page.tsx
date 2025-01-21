'use client';

import { motion } from 'framer-motion';

export default function DocumentationPage() {
  const sections = [
    {
      title: "Getting Started",
      content: [
        {
          heading: "Connecting Your Wallet",
          text: "To start using LangChain, you'll need a Web3 wallet like MetaMask. Click the 'Connect Wallet' button in the top right corner and follow the prompts to connect your wallet."
        },
        {
          heading: "Setting Up Your Profile",
          text: "Once connected, visit your profile page to customize your learning preferences and track your progress."
        }
      ]
    },
    {
      title: "Lesson Structure",
      content: [
        {
          heading: "Lesson Types",
          text: "LangChain offers various types of lessons including multiple choice, speaking practice, matching exercises, and more. Each lesson is designed to help you master different aspects of language learning."
        },
        {
          heading: "Quiz Format",
          text: "Quizzes combine different question types to test your knowledge comprehensively. Complete quizzes to earn rewards and track your progress."
        }
      ]
    },
    {
      title: "Rewards System",
      content: [
        {
          heading: "Token Rewards",
          text: "Earn tokens by completing lessons, maintaining streaks, and unlocking achievements. Tokens are automatically sent to your connected wallet."
        },
        {
          heading: "Achievements",
          text: "Special achievements are awarded for reaching milestones in your learning journey. Each achievement comes with bonus token rewards."
        }
      ]
    },
    {
      title: "Technical Details",
      content: [
        {
          heading: "Smart Contracts",
          text: "Your progress and achievements are stored on the Moonbeam blockchain using secure smart contracts. This ensures your learning history is permanent and verifiable."
        },
        {
          heading: "AI Integration",
          text: "Lessons are generated using advanced AI technology to provide personalized content tailored to your skill level and learning pace."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-blue-500">{section.title}</h2>
              <div className="space-y-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                {section.content.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-xl font-medium text-gray-200">{item.heading}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 