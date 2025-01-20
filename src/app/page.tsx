'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      variants={item}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-colors"
    >
      <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {number}
      </h3>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:border-blue-500/30 transition-all"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
      </div>
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-2.5 mb-6">
          <Icon className="w-full h-full text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:border-blue-500/30 transition-all">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 text-xl font-bold text-white">
            {number}
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 25%),
              radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 25%),
              radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 25%),
              radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px'
          }} />
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              variants={item}
              className="inline-block mb-6 px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
                🎓 The Future of Language Learning is Here
              </span>
            </motion.div>
            
            <motion.h1
              variants={item}
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Master Languages
              </span>
              <br />
              <span className="text-white">
                Earn While You Learn
              </span>
            </motion.h1>
            
            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-gray-300/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Experience a revolutionary way to learn languages with AI-powered lessons
              and blockchain rewards for your progress.
            </motion.p>
            
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              {!isConnected ? (
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectKitButton />
                </div>
              ) : (
                <Link
                  href="/lessons"
                  className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-lg transform hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Start Learning
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link
                href="#features"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group font-medium"
              >
                Explore Features
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <Stat number="1000+" label="Active Learners" />
              <Stat number="50+" label="AI Lessons" />
              <Stat number="10k+" label="Rewards Earned" />
              <Stat number="4.9" label="User Rating" />
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] via-[#0F1629] to-[#0A0F1C]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LangChain
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the perfect blend of technology and education
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={SparklesIcon}
              title="AI-Powered Learning"
              description="Personalized lessons generated by advanced AI technology, adapting to your unique learning style."
            />
            <FeatureCard
              icon={CurrencyDollarIcon}
              title="Token Rewards"
              description="Earn valuable tokens for completing lessons and achieving milestones in your language journey."
            />
            <FeatureCard
              icon={ShieldCheckIcon}
              title="On-Chain Progress"
              description="Your achievements and progress are securely stored on the Moonbeam blockchain."
            />
            <FeatureCard
              icon={BookOpenIcon}
              title="Interactive Lessons"
              description="Engage with dynamic content, interactive quizzes, and real-world examples."
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Track Progress"
              description="Monitor your learning journey with detailed analytics and personalized insights."
            />
            <FeatureCard
              icon={LightBulbIcon}
              title="Smart Learning"
              description="AI-driven recommendations to optimize your learning path and maximize results."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[#0A0F1C]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start your learning journey in three simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 transform -translate-y-1/2" />
            
            <StepCard
              number={1}
              title="Connect Wallet"
              description="Link your Web3 wallet to begin your personalized learning experience."
            />
            <StepCard
              number={2}
              title="Choose Lessons"
              description="Select from AI-generated lessons perfectly tailored to your skill level."
            />
            <StepCard
              number={3}
              title="Earn Rewards"
              description="Complete lessons to earn tokens and track your progress on-chain."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 30%),
              radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 30%),
              radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)
            `,
            backgroundSize: '100% 100%, 100% 100%, 24px 24px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Start Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Learning Journey
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of learners already mastering new languages and earning rewards.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {!isConnected ? (
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectKitButton />
                </div>
              ) : (
                <Link
                  href="/lessons"
                  className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-lg transform hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Start Learning Now
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
