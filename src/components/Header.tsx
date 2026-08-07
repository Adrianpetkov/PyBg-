import React from 'react';
import { 
  Code2, 
  Flame, 
  Trophy, 
  Moon, 
  Sun, 
  Globe, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  Blocks, 
  HelpCircle, 
  Map, 
  Users, 
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Language, SkillLevel, TabType, UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onOpenSyncModal: () => void;
  onSelectLevel: (level: SkillLevel) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  activeTab,
  setActiveTab,
  onToggleTheme,
  onToggleLanguage,
  onOpenSyncModal,
  onSelectLevel
}) => {
  const isBg = userProfile.language === 'bg';

  const navItems: { id: TabType; labelBg: string; labelEn: string; icon: React.ReactNode; isBadge?: boolean }[] = [
    { id: 'exercises', labelBg: 'Упражнения', labelEn: 'Learning Lab', icon: <BookOpen className="w-4 h-4 text-sky-400" /> },
    { id: 'kids', labelBg: 'Детски блокове 🐢', labelEn: 'Kids Zone 🐢', icon: <Blocks className="w-4 h-4 text-emerald-400" /> },
    { id: 'quiz', labelBg: 'Викторина', labelEn: 'Quick Quiz', icon: <HelpCircle className="w-4 h-4 text-amber-400" /> },
    { id: 'path', labelBg: 'Учебен план', labelEn: 'Study Path', icon: <Map className="w-4 h-4 text-purple-400" /> },
    { id: 'tracker', labelBg: 'Дневен прогрес', labelEn: 'Daily Tracker', icon: <Calendar className="w-4 h-4 text-rose-400" /> },
    { id: 'mentors', labelBg: 'Ментори', labelEn: 'Mentor Hub', icon: <Users className="w-4 h-4 text-indigo-400" /> },
    { id: 'forum', labelBg: 'Форум', labelEn: 'Community', icon: <MessageSquare className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
      userProfile.darkTheme 
        ? 'bg-slate-900 border-slate-800 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* High Density Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-slate-950 text-sm shadow-md shadow-sky-500/20">
              Py
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-100">
                PyBG <span className="text-sky-400 font-bold">Pro</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 hidden sm:inline-block">
                {isBg ? 'България' : 'Pro IDE'}
              </span>
            </div>
          </div>

          {/* Skill Level Quick Selector */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs font-mono">
            {(['beginner', 'intermediate', 'advanced', 'kids'] as SkillLevel[]).map((lvl) => {
              const isActive = userProfile.skillLevel === lvl;
              const labels: Record<SkillLevel, { bg: string; en: string }> = {
                beginner: { bg: 'Основи', en: 'Fundamentals' },
                intermediate: { bg: 'Напреднали', en: 'Intermediate' },
                advanced: { bg: 'Експерт', en: 'Advanced' },
                kids: { bg: 'Детски', en: 'Kids' }
              };
              return (
                <button
                  key={lvl}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {isBg ? labels[lvl].bg : labels[lvl].en}
                </button>
              );
            })}
          </div>

          {/* High Density Status Pill & Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Streak & XP Badge Pill */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono">
              <span className="text-orange-400 flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                {userProfile.streak}d
              </span>
              <div className="w-px h-3.5 bg-slate-700"></div>
              <span className="text-yellow-400 font-bold">
                ✨ {userProfile.xp} XP
              </span>
            </div>

            {/* Sync Cloud Button */}
            <button
              onClick={onOpenSyncModal}
              title={isBg ? 'Синхронизиране между устройства' : 'Sync across devices'}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isBg ? 'Синхрон' : 'Sync'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              title={isBg ? 'Превключи на Английски' : 'Switch to Bulgarian'}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="uppercase">{userProfile.language}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              title={isBg ? 'Нощен/Дневен режим' : 'Toggle Night/Day Mode'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {userProfile.darkTheme ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold shadow-sm'
                    : userProfile.darkTheme
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{isBg ? item.labelBg : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

