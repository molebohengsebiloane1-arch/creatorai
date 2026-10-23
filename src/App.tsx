/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppTab, AIStatus, HistoryRecord, UserUsageState } from './types';
import { fetchAIStatus, fetchUserUsage } from './services/api';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SetupModal } from './components/SetupModal';
import { Dashboard } from './components/Dashboard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { YoutubeAssistant } from './components/YoutubeAssistant';
import { SocialCaptionGenerator } from './components/SocialCaptionGenerator';
import { VideoPlanner } from './components/VideoPlanner';
import { ContentIdeas } from './components/ContentIdeas';
import { PricingPage } from './components/PricingPage';
import { HistoryDrawer } from './components/HistoryDrawer';
import { UsageCostModal } from './components/UsageCostModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [status, setStatus] = useState<AIStatus>({
    configured: false,
    model: 'gemini-3.8-flash',
    provider: 'Google Gemini',
  });
  const [usage, setUsage] = useState<UserUsageState>({
    plan: 'free',
    planName: 'Free Tier',
    dailyLimit: 5,
    dailyUsed: 0,
    dailyRemaining: 5,
    monthlyLimit: 150,
    monthlyUsed: 0,
    monthlyRemaining: 150,
    resetsAt: new Date(Date.now() + 86400000).toISOString(),
    totalGenerationsAllTime: 0,
    isUnlimitedDemo: true,
  });
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [usageCostModalOpen, setUsageCostModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  
  // Cross-tool topic transfer
  const [activeTopic, setActiveTopic] = useState<string>('');

  // Local storage history
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('creatorai_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const checkStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const res = await fetchAIStatus();
      setStatus(res);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const refreshUsage = async () => {
    try {
      const u = await fetchUserUsage();
      setUsage(u);
    } catch (e) {
      console.warn('Failed to refresh user usage quota', e);
    }
  };

  useEffect(() => {
    checkStatus();
    refreshUsage();
  }, []);

  const saveHistoryRecord = (
    type: HistoryRecord['type'],
    title: string,
    topic: string,
    data: any,
    isDemo?: boolean
  ) => {
    const newRecord: HistoryRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      topic,
      createdAt: Date.now(),
      data,
      isDemo: isDemo !== undefined ? isDemo : demoMode,
    };
    setHistory((prev) => {
      const updated = [newRecord, ...prev.slice(0, 49)];
      try {
        localStorage.setItem('creatorai_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });

    if (!newRecord.isDemo) {
      refreshUsage();
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('creatorai_history');
    } catch {}
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('creatorai_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleQuickStart = (tab: AppTab, topic: string) => {
    setActiveTopic(topic);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryRecord = (record: HistoryRecord) => {
    const tabMap: Record<HistoryRecord['type'], AppTab> = {
      script: 'script-generator',
      youtube: 'youtube-assistant',
      social: 'social-captions',
      planner: 'video-planner',
      ideas: 'content-ideas',
    };
    setActiveTopic(record.topic);
    setActiveTab(tabMap[record.type]);
    setHistoryDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        status={status}
        onOpenSetup={() => setSetupModalOpen(true)}
        historyCount={history.length}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        demoMode={demoMode}
        onToggleDemoMode={setDemoMode}
        usage={usage}
        onOpenUsageModal={() => setUsageCostModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:pb-12">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            status={status}
            onOpenSetup={() => setSetupModalOpen(true)}
            onQuickStart={handleQuickStart}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
            usage={usage}
            onOpenUsageModal={() => setUsageCostModalOpen(true)}
          />
        )}

        {activeTab === 'script-generator' && (
          <ScriptGenerator
            status={status}
            onOpenSetup={() => setSetupModalOpen(true)}
            onSaveHistory={saveHistoryRecord}
            initialTopic={activeTopic}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
          />
        )}

        {activeTab === 'youtube-assistant' && (
          <YoutubeAssistant
            status={status}
            onOpenSetup={() => setSetupModalOpen(true)}
            onSaveHistory={saveHistoryRecord}
            initialTopic={activeTopic}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
          />
        )}

        {activeTab === 'social-captions' && (
          <SocialCaptionGenerator
            status={status}
            onOpenSetup={() => setSetupModalOpen(true)}
            onSaveHistory={saveHistoryRecord}
            initialTopic={activeTopic}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
          />
        )}

        {activeTab === 'video-planner' && (
          <VideoPlanner
            status={status}
            onOpenSetup={() => setSetupModalOpen(true)}
            onSaveHistory={saveHistoryRecord}
            initialConcept={activeTopic}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
          />
        )}

        {activeTab === 'content-ideas' && (
          <ContentIdeas
            status={status}
            onOpenSetup={() => setSetupModalOpen(true)}
            onSaveHistory={saveHistoryRecord}
            onTransferToTool={handleQuickStart}
            initialNiche={activeTopic}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingPage
            setActiveTab={setActiveTab}
            onOpenSetup={() => setSetupModalOpen(true)}
            usage={usage}
          />
        )}
      </main>

      {/* Footer (Desktop & Tablet) */}
      <footer className="border-t border-slate-800/80 bg-[#070A12] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">CreatorAI</span>
            <span>—</span>
            <span className="text-slate-400">Create Smarter. Grow Faster.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Google Gemini 3.8 Flash</span>
            <span>•</span>
            <button
              onClick={() => setSetupModalOpen(true)}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              API Key Setup
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('pricing')}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (One-Thumb Android Experience) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Setup Guide Modal */}
      <SetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        status={status}
        onRefreshStatus={checkStatus}
        isChecking={isCheckingStatus}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        records={history}
        onClearAll={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onSelectRecord={handleSelectHistoryRecord}
      />

      {/* Usage & Cost Audit Modal */}
      <UsageCostModal
        isOpen={usageCostModalOpen}
        onClose={() => setUsageCostModalOpen(false)}
        usage={usage}
        onRefreshUsage={refreshUsage}
        onNavigateToPricing={() => {
          setUsageCostModalOpen(false);
          setActiveTab('pricing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
