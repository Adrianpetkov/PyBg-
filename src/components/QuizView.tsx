import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, Sparkles, ChevronRight, RotateCcw, Flame, Filter, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, UserProfile } from '../types';
import { INITIAL_QUIZZES } from '../data/courses';

interface QuizViewProps {
  userProfile: UserProfile;
  onAwardXp: (xp: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ userProfile, onAwardXp }) => {
  const isBg = userProfile.language === 'bg';
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(INITIAL_QUIZZES);
  const [activeLevel, setActiveLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'kids'>('all');
  
  const filteredQuizzes = quizzes.filter(q => activeLevel === 'all' || q.level === activeLevel);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [generatingAiQuiz, setGeneratingAiQuiz] = useState<boolean>(false);

  const currentQuiz: QuizQuestion = filteredQuizzes[currentIndex] || quizzes[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOption === currentQuiz.correctIndex) {
      const bonusStreakXp = streak >= 2 ? 10 : 0;
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      onAwardXp(currentQuiz.xp + bonusStreakXp);

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
  };

  // Generate Infinite AI Quiz Question
  const handleGenerateAiQuiz = async () => {
    setGeneratingAiQuiz(true);
    try {
      const topics = ['Core Python Syntax', 'Lists & Dictionaries', 'Functions & Scope', 'OOP Classes', 'Exception Handling'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: activeLevel === 'all' ? userProfile.skillLevel : activeLevel,
          topic: randomTopic,
          language: userProfile.language
        })
      });

      const newQuiz: QuizQuestion = await res.json();
      setQuizzes(prev => [newQuiz, ...prev]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
    } catch (e) {
      console.error('Failed to generate AI quiz', e);
    } finally {
      setGeneratingAiQuiz(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Quiz Progress Top Bar */}
      <div className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-indigo-400">
              {isBg ? 'Геймифицирани Викторини & AI Загадки' : 'Gamified Quizzes & AI Riddles'}
            </h2>
            <p className="text-xs text-slate-400">
              {isBg ? `Въпрос ${currentIndex + 1} от ${filteredQuizzes.length}` : `Question ${currentIndex + 1} of ${filteredQuizzes.length}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak} {isBg ? 'Серия!' : 'Streak!'}</span>
            </span>
          )}

          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {isBg ? `Точки: ${score}/${filteredQuizzes.length}` : `Score: ${score}/${filteredQuizzes.length}`}
          </span>

          <button
            onClick={handleGenerateAiQuiz}
            disabled={generatingAiQuiz}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generatingAiQuiz ? 'animate-spin' : ''}`} />
            <span>{generatingAiQuiz ? (isBg ? 'Генериране...' : 'Generating...') : (isBg ? '+ Безкрайна AI Загадка' : '+ Infinite AI Quiz')}</span>
          </button>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <span className="text-slate-400 flex items-center gap-1 text-[11px] shrink-0 font-bold">
          <Filter className="w-3.5 h-3.5" />
          <span>{isBg ? 'Ниво:' : 'Level:'}</span>
        </span>
        {[
          { id: 'all', labelBg: 'Всички', labelEn: 'All' },
          { id: 'beginner', labelBg: 'Начинаещи', labelEn: 'Beginner' },
          { id: 'intermediate', labelBg: 'Средно', labelEn: 'Intermediate' },
          { id: 'advanced', labelBg: 'Напреднали', labelEn: 'Advanced' },
          { id: 'kids', labelBg: 'За Деца 🐢', labelEn: 'For Kids 🐢' }
        ].map((lvl) => {
          const isActive = activeLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => {
                setActiveLevel(lvl.id as any);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isBg ? lvl.labelBg : lvl.labelEn}
            </button>
          );
        })}
      </div>

      {/* Main Quiz Card */}
      {currentQuiz && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Question Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider font-mono">
                +{currentQuiz.xp} XP • {currentQuiz.level}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                ID: {currentQuiz.id}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              {isBg ? currentQuiz.titleBg : currentQuiz.titleEn}
            </h3>
          </div>

          {/* Code Snippet if present */}
          {currentQuiz.codeSnippet && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
              <pre>{currentQuiz.codeSnippet}</pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3">
            {(isBg ? currentQuiz.optionsBg : currentQuiz.optionsEn).map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQuiz.correctIndex;

              let buttonStyle = userProfile.darkTheme 
                ? 'bg-slate-800/50 border-slate-700/60 text-slate-200 hover:bg-slate-800' 
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

              if (isSelected) {
                buttonStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/40';
              }

              if (isSubmitted) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 font-bold';
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${buttonStyle}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Popup */}
          {isSubmitted && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400 block">
                  {isBg ? '💡 Обяснение:' : '💡 Explanation:'}
                </span>
                <span className="text-[10px] font-mono text-sky-400">
                  {isBg ? 'Натиснете Ctrl+K за допълнителни въпроси към AI' : 'Press Ctrl+K for AI Chat'}
                </span>
              </div>
              <p>{isBg ? currentQuiz.explanationBg : currentQuiz.explanationEn}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isBg ? 'Рестартирай' : 'Restart'}</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition"
              >
                {isBg ? 'Потвърди отговора' : 'Submit Answer'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
              >
                <span>{isBg ? 'Следващ въпрос' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

