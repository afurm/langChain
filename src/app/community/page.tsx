'use client';

import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function CommunityPage() {
  const sections = [
    {
      title: "Join Our Discord",
      description: "Connect with fellow learners, share your progress, and get help from our community.",
      icon: ChatBubbleLeftRightIcon,
      link: "https://discord.gg/langchain",
      buttonText: "Join Discord"
    },
    {
      title: "Social Media",
      description: "Follow us on social media for updates, tips, and community highlights.",
      icon: GlobeAltIcon,
      links: [
        { name: "Twitter", url: "https://twitter.com/langchain" },
        { name: "LinkedIn", url: "https://linkedin.com/company/langchain" },
        { name: "Instagram", url: "https://instagram.com/langchain" }
      ]
    },
    {
      title: "Study Groups",
      description: "Join or create study groups to practice together and motivate each other.",
      icon: UserGroupIcon,
      link: "/groups",
      buttonText: "Find Groups"
    },
    {
      title: "Contribute",
      description: "Help improve LangChain by contributing to our open-source codebase or suggesting new features.",
      icon: CodeBracketIcon,
      link: "https://github.com/yourusername/language-courses-on-chain",
      buttonText: "View GitHub"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Join Our Community</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <section.icon className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              
              <p className="text-gray-400 mb-6 flex-grow">{section.description}</p>
              
              {section.link ? (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
                >
                  {section.buttonText}
                </a>
              ) : section.links ? (
                <div className="flex flex-wrap gap-2">
                  {section.links.map(link => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Community Guidelines</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Be respectful and supportive of fellow learners</li>
            <li>Share your knowledge and experiences</li>
            <li>Keep discussions relevant to language learning and Web3</li>
            <li>No spam or self-promotion</li>
            <li>Report any issues or violations to moderators</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
} 