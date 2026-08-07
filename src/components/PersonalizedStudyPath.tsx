import React, { useState } from 'react';
import { Map, Sparkles, Clock, CheckCircle2, Circle, ArrowRight, Compass, Target } from 'lucide-react';
import { StudyPath, SkillLevel, UserProfile } from '../types';

interface PersonalizedStudyPathProps {
  userProfile: UserProfile;
}

export const PersonalizedStudyPath: React.FC<PersonalizedStudyPathProps> = ({ userProfile }) => {
  const isBg = userProfile.language === 'bg';
  
  const [goal, setGoal] = useState<string>('Data Science & AI');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(userProfile.skillLevel);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5);
  
  const [studyPath, setStudyPath] = useState<StudyPath | null>({
    goal: 'Data Science & AI',
    skillLevel: 'beginner',
    hoursPerWeek: 5,
    estimatedWeeks: 6,
    modules: [
      {
        id: 'm1',
        titleBg: 'Модул 1: Python Синтаксис и Структури от Данни',
        titleEn: 'Module 1: Python Syntax & Data Structures',
        topics: ['Променливи', 'Списъци и Речници', 'Условни оператори'],
        estimatedHours: 6,
        completed: true,
        descBg: 'Изграждане на стабилна основа в основните за Data Science елементи.',
        descEn: 'Building a strong baseline in fundamental data science concepts.'
      },
      {
        id: 'm2',
        titleBg: 'Модул 2: Обработка на данни с Pandas & NumPy',
        titleEn: 'Module 2: Data Manipulation with Pandas & NumPy',
        topics: ['DataFrames', 'Филтриране', 'Агрегиране и Групиране'],
        estimatedHours: 10,
        completed: false,
        descBg: 'Работа с реални масиви от данни и подготовка за AI модели.',
        descEn: 'Working with real-world datasets and preparing data for AI models.'
      },
      {
        id: 'm3',
        titleBg: 'Модул 3: Визуализация с Matplotlib & Seaborn',
        titleEn: 'Module 3: Visualization with Matplotlib & Seaborn',
        topics: ['Графики', 'Хистограми', 'Анализ на корелации'],
        estimatedHours: 8,
        completed: false,
        descBg: 'Създаване на интерактивни графики и доклади.',
        descEn: 'Creating interactive charts and visual reporting.'
      }
    ]
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleGeneratePath = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/study-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          skillLevel,
          hoursPerWeek,
          language: userProfile.language
        })
      });
      const data = await res.json();
      if (data.modules) {
        setStudyPath({
          goal,
          skillLevel,
          hoursPerWeek,
          estimatedWeeks: data.estimatedWeeks || 6,
          modules: data.modules
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleModuleComplete = (modId: string) => {
    if (!studyPath) return;
    setStudyPath({
      ...studyPath,
      modules: studyPath.modules.map(m => m.id === modId ? { ...m, completed: !m.completed } : m)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-purple-400">
              {isBg ? 'Персонализиран Учебен Път (AI Study Roadmap)' : 'AI Personalized Study Path'}
            </h2>
            <p className="text-xs text-slate-400">
              {isBg 
                ? 'Генерирайте персонален план за учене съобразен с вашите цели и свободно време.' 
                : 'Generate a custom study plan tailored to your career goals and weekly schedule.'}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isBg ? 'Основна Цел' : 'Primary Goal'}
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Web Development (Django/FastAPI)">Web Development (FastAPI)</option>
              <option value="Automation & Web Scraping">Automation & Scraping</option>
              <option value="Kids Logic & Games">Kids Logic & Game Dev</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isBg ? 'Текущо Ниво' : 'Current Level'}
            </label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="beginner">{isBg ? 'Основи (Beginner)' : 'Beginner'}</option>
              <option value="intermediate">{isBg ? 'Напреднали (Intermediate)' : 'Intermediate'}</option>
              <option value="advanced">{isBg ? 'Експерт (Advanced)' : 'Advanced'}</option>
              <option value="kids">{isBg ? 'Детски (Kids)' : 'Kids'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isBg ? 'Часове/Седмица' : 'Hours / Week'}
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            />
          </div>

        </div>

        <button
          onClick={handleGeneratePath}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>{loading ? (isBg ? 'Генериране...' : 'Generating...') : (isBg ? 'Генерирай Персонален План с AI' : 'Generate AI Study Path')}</span>
        </button>
      </div>

      {/* Generated Modules Timeline */}
      {studyPath && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-100">
                {studyPath.goal}
              </h3>
              <p className="text-xs text-purple-400">
                {isBg ? `Очаквана продължителност: ~${studyPath.estimatedWeeks} седмици` : `Estimated duration: ~${studyPath.estimatedWeeks} weeks`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                {studyPath.modules.filter(m => m.completed).length} / {studyPath.modules.length} {isBg ? 'завършени' : 'completed'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {studyPath.modules.map((mod, index) => (
              <div
                key={mod.id || index}
                onClick={() => toggleModuleComplete(mod.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  mod.completed
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                    : userProfile.darkTheme
                      ? 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <button className="mt-0.5">
                  {mod.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">
                      {isBg ? (mod.titleBg || mod.titleEn || mod.title) : (mod.titleEn || mod.title || mod.titleBg)}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mod.estimatedHours} {isBg ? 'ч.' : 'hrs'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    {isBg ? (mod.descBg || mod.descEn || mod.description) : (mod.descEn || mod.description || mod.descBg)}
                  </p>

                  {mod.topics && mod.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mod.topics.map((t, tidx) => (
                        <span key={tidx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
