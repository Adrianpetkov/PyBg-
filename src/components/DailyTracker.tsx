import React from 'react';
import { Flame, Trophy, Calendar, Award, CheckCircle2, Zap, Target, Star } from 'lucide-react';
import { UserProfile } from '../types';

interface DailyTrackerProps {
  userProfile: UserProfile;
  onStartExercise: () => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({ userProfile, onStartExercise }) => {
  const isBg = userProfile.language === 'bg';
  const percentComplete = Math.min(100, Math.round((userProfile.todayXp / userProfile.dailyGoalXp) * 100));

  // Generate last 14 days
  const today = new Date();
  const pastDays = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date();
    d.setDate(today.getDate() - (13 - idx));
    const dateStr = d.toISOString().split('T')[0];
    const xp = userProfile.dailyActivityMap[dateStr] || (idx >= 10 ? 40 : 0);
    return {
      dateStr,
      dayName: d.toLocaleDateString(isBg ? 'bg-BG' : 'en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      xp,
      active: xp > 0
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner / Motivation Header */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900 p-5 sm:p-6 border border-slate-800 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>{isBg ? 'АКТИВНА СЕРИЯ / STREAK' : 'ACTIVE STREAK'}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">
              {isBg ? `${userProfile.streak} поредни дни учене!` : `${userProfile.streak} Days Learning Streak!`}
            </h2>
            <p className="text-slate-400 text-xs max-w-xl">
              {isBg 
                ? 'Редовното учене на Python всеки ден изгражда невронни връзки и прави програмирането интуитивно.' 
                : 'Consistent daily Python practice builds long-term neural memory and coding fluency.'}
            </p>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={onStartExercise}
            className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isBg ? 'Започни упражнение (+30 XP)' : 'Start Exercise (+30 XP)'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Daily Goal & Streak Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Daily XP Goal Card */}
        <div className={`p-4 rounded-xl border transition-colors ${
          userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs font-mono uppercase">
              <Target className="w-4 h-4" />
              <span>{isBg ? 'Дневна Цел XP' : 'Daily XP Goal'}</span>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {userProfile.todayXp} / {userProfile.dailyGoalXp} XP
            </span>
          </div>

          <div className="space-y-3">
            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-3 rounded border border-slate-800 p-0.5">
              <div 
                className="bg-sky-500 h-full rounded transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            
            <p className="text-xs text-slate-400 font-mono text-center">
              {percentComplete >= 100 
                ? (isBg ? '🎉 Поздравления! Постигнахте целта за днес!' : '🎉 Congratulations! You met today\'s goal!') 
                : (isBg ? `Остават още ${userProfile.dailyGoalXp - userProfile.todayXp} XP за завършване.` : `${userProfile.dailyGoalXp - userProfile.todayXp} XP left to complete.`)}
            </p>
          </div>
        </div>

        {/* 14-Day Heatmap Activity */}
        <div className={`col-span-1 md:col-span-2 p-4 rounded-xl border transition-colors ${
          userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase">
              <Calendar className="w-4 h-4" />
              <span>{isBg ? 'Календар на активността (Последени 14 дни)' : 'Activity Bar Chart (Last 14 Days)'}</span>
            </div>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 items-end h-20 pt-2">
            {pastDays.map((d, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center h-full justify-end group"
                title={`${d.dateStr}: ${d.xp} XP`}
              >
                <div 
                  className={`w-full rounded-t transition-all ${
                    d.active ? 'bg-sky-500 group-hover:bg-sky-400' : 'bg-slate-800'
                  }`}
                  style={{ height: d.active ? `${Math.max(25, Math.min(100, (d.xp / 60) * 100))}%` : '15%' }}
                />
                <span className="text-[9px] text-slate-500 font-mono mt-1">{d.dayName.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className={`p-4 rounded-xl border transition-colors ${
        userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-400 font-mono">
            <Award className="w-4 h-4" />
            <span>{isBg ? 'Постижения & Отличия' : 'Badges & Achievements'}</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {userProfile.badges.filter(b => b.unlocked).length} / {userProfile.badges.length} {isBg ? 'отключени' : 'unlocked'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {userProfile.badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-lg border flex flex-col items-center text-center space-y-1.5 transition-all ${
                b.unlocked
                  ? 'bg-slate-800/80 border-amber-500/30 text-amber-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-50'
              }`}
            >
              <div className="text-2xl p-1.5 rounded bg-slate-900 border border-slate-800">{b.icon}</div>
              <h4 className="font-bold text-xs font-mono">{isBg ? b.titleBg : b.titleEn}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {isBg ? b.descBg : b.descEn}
              </p>
              {b.unlocked && (
                <span className="text-[9px] font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {b.unlockedAt || 'Unlocked'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
