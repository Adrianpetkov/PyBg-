import React, { useState } from 'react';
import { Users, Star, Send, Code2, Sparkles, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { Mentor, MentorRequest, MentorReviewResult, UserProfile } from '../types';
import { INITIAL_MENTORS } from '../data/courses';

interface MentorConnectProps {
  userProfile: UserProfile;
  initialCode?: string;
  initialProjectTitle?: string;
}

export const MentorConnect: React.FC<MentorConnectProps> = ({
  userProfile,
  initialCode = 'def process_data(items):\n    res = []\n    for i in items:\n        if i > 0:\n            res.append(i * 2)\n    return res\n',
  initialProjectTitle = 'Филтриране и умножаване на списък'
}) => {
  const isBg = userProfile.language === 'bg';
  
  const [mentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(INITIAL_MENTORS[0]);
  
  const [projectTitle, setProjectTitle] = useState<string>(initialProjectTitle);
  const [codeToReview, setCodeToReview] = useState<string>(initialCode);
  
  const [reviewResult, setReviewResult] = useState<MentorReviewResult | null>(null);
  const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [submittedRequests, setSubmittedRequests] = useState<MentorRequest[]>([]);

  const handleRequestReview = async () => {
    setLoadingReview(true);
    try {
      const res = await fetch('/api/gemini/mentor-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToReview,
          projectTitle,
          language: userProfile.language
        })
      });
      const data = await res.json();
      setReviewResult(data);

      const newReq: MentorRequest = {
        id: `req-${Date.now()}`,
        mentorId: selectedMentor.id,
        studentName: userProfile.name,
        projectTitle,
        code: codeToReview,
        status: 'reviewed',
        createdAt: 'Току-що / Just now',
        review: data
      };
      setSubmittedRequests(prev => [newReq, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border space-y-3 ${
        userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-indigo-400">
              {isBg ? 'Менторство & Дълбоко Код Ревю' : 'Mentors & Deep Code Review'}
            </h2>
            <p className="text-xs text-slate-400">
              {isBg 
                ? 'Свържете се с опитни Python инженери за личен преглед на кода, съвети за архитекура и подготвяне за работа.' 
                : 'Connect with experienced Python mentors for line-by-line feedback, architecture tips, and career guidance.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Mentor Directory (Left) & Request Review Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mentor Directory */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isBg ? 'Сертифицирани Ментори' : 'Certified Mentors'}</span>
          </h3>

          <div className="space-y-3">
            {mentors.map((m) => {
              const isSelected = selectedMentor.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMentor(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/30'
                      : userProfile.darkTheme
                        ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-100 truncate">{m.name}</h4>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{m.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {isBg ? m.titleBg : m.titleEn}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {isBg ? m.bioBg : m.bioEn}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {m.specialties.map((spec, sidx) => (
                      <span key={sidx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Review Submission Form & Review Result */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Submission Card */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>{isBg ? `Изпрати код до ${selectedMentor.name}` : `Submit code to ${selectedMentor.name}`}</span>
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {isBg ? 'Заглавие на Проекта / Задачата' : 'Project / Exercise Title'}
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {isBg ? 'Вашият Python Код за Ревю' : 'Your Python Code for Review'}
              </label>
              <textarea
                value={codeToReview}
                onChange={(e) => setCodeToReview(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRequestReview}
              disabled={loadingReview}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{loadingReview ? (isBg ? 'Менторът анализира кода...' : 'Mentor analyzing code...') : (isBg ? 'Получи Код Ревю от Ментор' : 'Get Mentor Code Review')}</span>
            </button>
          </div>

          {/* Review Output Card */}
          {reviewResult && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-indigo-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{reviewResult.mentorName}</span>
                </div>
              </div>

              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">{isBg ? 'Четимост' : 'Readability'}</span>
                  <span className="text-lg font-black text-indigo-400">{reviewResult.readabilityScore}/100</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">{isBg ? 'Ефективност' : 'Efficiency'}</span>
                  <span className="text-lg font-black text-emerald-400">{reviewResult.efficiencyScore}/100</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Pythonic</span>
                  <span className="text-lg font-black text-amber-400">{reviewResult.pythonicScore}/100</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-200">{isBg ? 'Обща менторска обратна връзка:' : 'Overall Mentor Feedback:'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {reviewResult.overallFeedback}
                </p>
              </div>

              {reviewResult.refactoredCode && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-emerald-400">{isBg ? 'Оптимизирана версия на кода (Refactored):' : 'Optimized Refactored Code:'}</h4>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                    {reviewResult.refactoredCode}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
