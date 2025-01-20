'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import {
  Squares2X2Icon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Admin addresses - in production, this should come from a contract or secure configuration
const ADMIN_ADDRESSES = [
  '0x1234567890123456789012345678901234567890', // Replace with actual admin addresses
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const isAdmin = address && ADMIN_ADDRESSES.includes(address.toLowerCase());

  useEffect(() => {
    if (!isConnected || !isAdmin) {
      router.push('/');
    }
  }, [isConnected, isAdmin, router]);

  if (!isConnected || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Squares2X2Icon },
    { href: '/admin/lessons', label: 'Lessons', icon: BookOpenIcon },
    { href: '/admin/users', label: 'Users', icon: UsersIcon },
    { href: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
    { href: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Admin Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-xl font-bold">
              Admin Dashboard
            </Link>
            <div className="text-sm text-gray-400">
              Connected as Admin
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </motion.nav>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
} 