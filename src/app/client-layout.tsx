'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AchievementProvider } from '@/contexts/AchievementContext';
import AchievementNotification from '@/components/notifications/AchievementNotification';
import { useAchievements } from '@/contexts/AchievementContext';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { moonbeam, moonbaseAlpha } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const inter = Inter({ subsets: ["latin"] });

const config = createConfig(
  getDefaultConfig({
    chains: [process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? moonbeam : moonbaseAlpha],
    transports: {
      [moonbeam.id]: http(process.env.NEXT_PUBLIC_MOONBEAM_RPC_URL),
      [moonbaseAlpha.id]: http(process.env.NEXT_PUBLIC_MOONBASE_RPC_URL),
    },
    appName: 'Language Courses on Chain',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  })
);

const queryClient = new QueryClient();

function Notifications() {
  const { currentAchievement, clearAchievement } = useAchievements();
  return currentAchievement ? (
    <AchievementNotification
      achievement={currentAchievement}
      onClose={clearAchievement}
    />
  ) : null;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider theme="midnight">
              <AchievementProvider>
                <div className="relative min-h-screen flex flex-col">
                  {/* Background Effects */}
                  <div className="fixed inset-0 bg-[#0A0F1C]">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-pink-900/20 opacity-30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 30%),
                        radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 30%),
                        radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)
                      `,
                      backgroundSize: '100% 100%, 100% 100%, 24px 24px'
                    }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                  </div>

                  {/* Notifications */}
                  <div className="relative z-50">
                    <Notifications />
                  </div>
                </div>
              </AchievementProvider>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
} 