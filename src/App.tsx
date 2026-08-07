import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyTracker } from './components/DailyTracker';
import { CodeEditor } from './components/CodeEditor';
import { KidsVisualCoder } from './components/KidsVisualCoder';
import { QuizView } from './components/QuizView';
import { PersonalizedStudyPath } from './components/PersonalizedStudyPath';
import { MentorConnect } from './components/MentorConnect';
import { CommunityForum } from './components/CommunityForum';
import { SyncModal } from './components/SyncModal';
import { AiSupportWidget } from './components/AiSupportWidget';
import { SoundscapePlayer } from './components/SoundscapePlayer';

import { SkillLevel, TabType, UserProfile } from './types';
import { INITIAL_EXERCISES, INITIAL_BADGES } from './data/courses';

export default function App() {
  // User Profile state with local storage initialization
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pybg_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Български Ученик',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      skillLevel: 'beginner',
      language: 'bg',
      darkTheme: true, // Default to dark mode for night learning
      xp: 120,
      streak: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedExerciseIds: ['ex-beg-1'],
      badges: INITIAL_BADGES,
      syncCode: `PY-${Math.floor(100000 + Math.random() * 900000)}`,
      dailyGoalXp: 100,
      todayXp: 40,
      dailyActivityMap: {
        [new Date().toISOString().split('T')[0]]: 40
      }
    };
  });

  const [activeTab, setActiveTab] = useState<TabType>('exercises');
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [mentorCodeToReview, setMentorCodeToReview] = useState<{ code: string; title: string } | null>(null);

  // Save profile state on update
  useEffect(() => {
    localStorage.setItem('pybg_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Apply dark mode class to root body
  useEffect(() => {
    if (userProfile.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProfile.darkTheme]);

  // Toggle Theme
  const handleToggleTheme = () => {
    setUserProfile(prev => ({ ...prev, darkTheme: !prev.darkTheme }));
  };

  // Toggle Language
  const handleToggleLanguage = () => {
    setUserProfile(prev => ({
      ...prev,
      language: prev.language === 'bg' ? 'en' : 'bg'
    }));
  };

  // Select Skill Level
  const handleSelectLevel = (level: SkillLevel) => {
    setUserProfile(prev => ({ ...prev, skillLevel: level }));
    if (level === 'kids') {
      setActiveTab('kids');
    }
  };

  // Award XP helper
  const handleAwardXp = (amount: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setUserProfile(prev => {
      const newTodayXp = prev.todayXp + amount;
      const newMap = { ...prev.dailyActivityMap, [todayStr]: (prev.dailyActivityMap[todayStr] || 0) + amount };
      return {
        ...prev,
        xp: prev.xp + amount,
        todayXp: newTodayXp,
        dailyActivityMap: newMap
      };
    });
  };

  // Exercise Complete Callback
  const handleExerciseComplete = (exerciseId: string, xpEarned: number) => {
    if (!userProfile.completedExerciseIds.includes(exerciseId)) {
      setUserProfile(prev => ({
        ...prev,
        completedExerciseIds: [...prev.completedExerciseIds, exerciseId]
      }));
      handleAwardXp(xpEarned);
    }
  };

  // Trigger Mentor Review tab with code
  const handleRequestMentorReview = (code: string, title: string) => {
    setMentorCodeToReview({ code, title });
    setActiveTab('mentors');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      userProfile.darkTheme 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white'
    }`}>
      
      {/* Top Header Navigation */}
      <Header
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleTheme={handleToggleTheme}
        onToggleLanguage={handleToggleLanguage}
        onOpenSyncModal={() => setShowSyncModal(true)}
        onSelectLevel={handleSelectLevel}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Relax Soundscape & Shortcuts Global Sub-Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1">
            <SoundscapePlayer />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-400 flex items-center gap-3 shrink-0">
            <span className="text-sky-400 font-bold">⌨️ Shortcuts:</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 border border-slate-700">Ctrl + ↵ (Run)</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 border border-slate-700">Ctrl + K (AI Tutor)</span>
          </div>
        </div>
        
        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <CodeEditor
            exercises={INITIAL_EXERCISES}
            userProfile={userProfile}
            onExerciseComplete={handleExerciseComplete}
            onRequestMentorReview={handleRequestMentorReview}
          />
        )}

        {/* Kids Visual Block Coding Tab */}
        {activeTab === 'kids' && (
          <KidsVisualCoder
            userProfile={userProfile}
            onAwardXp={handleAwardXp}
          />
        )}

        {/* Gamified Quizzes Tab */}
        {activeTab === 'quiz' && (
          <QuizView
            userProfile={userProfile}
            onAwardXp={handleAwardXp}
          />
        )}

        {/* Personalized Study Path Tab */}
        {activeTab === 'path' && (
          <PersonalizedStudyPath
            userProfile={userProfile}
          />
        )}

        {/* Daily Progress Tracker Tab */}
        {activeTab === 'tracker' && (
          <DailyTracker
            userProfile={userProfile}
            onStartExercise={() => setActiveTab('exercises')}
          />
        )}

        {/* Mentors & Code Review Tab */}
        {activeTab === 'mentors' && (
          <MentorConnect
            userProfile={userProfile}
            initialCode={mentorCodeToReview?.code}
            initialProjectTitle={mentorCodeToReview?.title}
          />
        )}

        {/* Community Forum Tab */}
        {activeTab === 'forum' && (
          <CommunityForum
            userProfile={userProfile}
          />
        )}

      </main>

      {/* Cross-Device Sync Modal */}
      {showSyncModal && (
        <SyncModal
          userProfile={userProfile}
          onClose={() => setShowSyncModal(false)}
          onRestoreState={(restored) => setUserProfile(restored)}
        />
      )}

      {/* High Density Status Footer */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-4 sm:px-8 flex items-center justify-between text-[10px] text-slate-500 font-mono mt-12 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Syncing: All devices up to date</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Cloud Session: Active</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PyBG v3.12.1</span>
          <span className="text-sky-400">UTF-8</span>
          <span className="hidden md:inline text-slate-400">Ln 14, Col 28</span>
        </div>
      </footer>

      {/* Floating AI Support Tutor Widget */}
      <AiSupportWidget userProfile={userProfile} />

    </div>
  );
}
