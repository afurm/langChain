import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  UserIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Start Learning', href: '/lessons', icon: BookOpenIcon },
        { label: 'Your Profile', href: '/profile', icon: UserIcon },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs', icon: DocumentTextIcon },
        { label: 'FAQs', href: '/faqs', icon: QuestionMarkCircleIcon },
        { label: 'Community', href: '/community', icon: UsersIcon },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'GitHub', href: 'https://github.com/yourusername/language-courses-on-chain', icon: GlobeAltIcon },
        { label: 'Twitter', href: 'https://twitter.com/langchain', icon: GlobeAltIcon },
        { label: 'Discord', href: 'https://discord.gg/langchain', icon: GlobeAltIcon },
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          <motion.div variants={item} className="space-y-4">
            <Link href="/" className="block">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LangChain
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Learn languages with blockchain-powered rewards and AI-generated content. Join our community of learners today.
            </p>
          </motion.div>

          {footerSections.map((section) => (
            <motion.div key={section.title} variants={item}>
              <h4 className="text-white font-medium mb-6 relative inline-block">
                {section.title}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors text-sm group"
                      {...(link.href.startsWith('http') ? {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      } : {})}
                    >
                      <link.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} LangChain. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
} 