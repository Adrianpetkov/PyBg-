import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  ChevronRight, 
  Copy, 
  Eye, 
  Clock, 
  Code2, 
  Send,
  Bug,
  Wrench,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Exercise, SkillLevel, UserProfile } from '../types';
import { runPythonCode, ExecutionResult } from '../utils/pythonRunner';

interface CodeEditorProps {
  exercises: Exercise[];
  userProfile: UserProfile;
  onExerciseComplete: (exerciseId: string, xpEarned: number) => void;
  onRequestMentorReview: (code: string, title: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  exercises,
  userProfile,
  onExerciseComplete,
  onRequestMentorReview
}) => {
  const isBg = userProfile.language === 'bg';
  const [exerciseList, setExerciseList] = useState<Exercise[]>(exercises);
  
  const filteredExercises = exerciseList.filter(ex => ex.level === userProfile.skillLevel || userProfile.skillLevel === 'beginner');
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(filteredExercises[0] || exercises[0]);
  const [code, setCode] = useState<string>(selectedExercise ? selectedExercise.starterCode : '');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);
  
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [generatingInfiniteEx, setGeneratingInfiniteEx] = useState<boolean>(false);

  // AI Bug Diagnostics & Auto-Fix State
  const [bugFixData, setBugFixData] = useState<any | null>(null);
  const [loadingBugFix, setLoadingBugFix] = useState<boolean>(false);

  useEffect(() => {
    if (selectedExercise) {
      setCode(selectedExercise.starterCode);
      setExecutionResult(null);
      setAiAnalysis(null);
      setCurrentHint(null);
      setHintLevel(0);
      setShowSolution(false);
    }
  }, [selectedExercise]);

  // Handle Run Code
  const handleRun = async () => {
    const result = runPythonCode(code);
    setExecutionResult(result);

    // Call Gemini AI Real-Time Feedback
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          exerciseTitle: isBg ? selectedExercise.titleBg : selectedExercise.titleEn,
          language: userProfile.language,
          expectedOutput: selectedExercise.expectedOutput
        })
      });
      const data = await res.json();
      setAiAnalysis(data);

      if (data.isCorrect || result.output.trim() === selectedExercise.expectedOutput.trim()) {
        onExerciseComplete(selectedExercise.id, selectedExercise.xp);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  // Keyboard shortcut for Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, selectedExercise]);

  // Generate Infinite AI Exercise
  const handleGenerateInfiniteExercise = async () => {
    setGeneratingInfiniteEx(true);
    try {
      const topics = ['Data Structures', 'Functions & Algorithms', 'String Processing', 'File Handling', 'Logic Puzzles'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const res = await fetch('/api/gemini/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: userProfile.skillLevel,
          topic: randomTopic,
          language: userProfile.language
        })
      });

      const newEx: Exercise = await res.json();
      setExerciseList(prev => [newEx, ...prev]);
      setSelectedExercise(newEx);
    } catch (e) {
      console.error('Failed to generate infinite exercise', e);
    } finally {
      setGeneratingInfiniteEx(false);
    }
  };

  // Handle Hint Request
  const handleGetHint = async () => {
    const nextLevel = hintLevel + 1;
    setHintLevel(nextLevel);
    setLoadingHint(true);

    try {
      const res = await fetch('/api/gemini/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          exerciseTitle: isBg ? selectedExercise.titleBg : selectedExercise.titleEn,
          hintLevel: nextLevel,
          language: userProfile.language
        })
      });
      const data = await res.json();
      setCurrentHint(data.hint);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHint(false);
    }
  };

  // AI Bug Diagnostics & Auto-Fix Handler
  const handleFixBug = async () => {
    setLoadingBugFix(true);
    setBugFixData(null);
    try {
      const res = await fetch('/api/gemini/fix-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          errorMsg: executionResult?.error || executionResult?.output || "",
          exerciseTitle: isBg ? selectedExercise.titleBg : selectedExercise.titleEn,
          language: userProfile.language
        })
      });
      const data = await res.json();
      setBugFixData(data);
    } catch (e) {
      console.error("AI Bug Fix Error:", e);
    } finally {
      setLoadingBugFix(false);
    }
  };

  const handleApplyBugFix = () => {
    if (bugFixData && bugFixData.fixedCode) {
      setCode(bugFixData.fixedCode);
      setBugFixData(null);
      setExecutionResult(null);
    }
  };

  // Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      
      {/* Left Sidebar: Exercise List Picker */}
      <div className={`lg:col-span-4 p-4 rounded-xl border flex flex-col space-y-3 ${
        userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>{isBg ? 'Задачи & Упражнения' : 'Learning Modules'}</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
            {filteredExercises.length} {isBg ? 'налични' : 'tasks'}
          </span>
        </div>

        {/* Infinite AI Exercise Generator Action */}
        <button
          onClick={handleGenerateInfiniteExercise}
          disabled={generatingInfiniteEx}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${generatingInfiniteEx ? 'animate-spin' : ''}`} />
          <span>{generatingInfiniteEx ? (isBg ? 'Генериране...' : 'Generating...') : (isBg ? '+ Безкрайна AI Задача' : '+ Infinite AI Exercise')}</span>
        </button>

        <div className="space-y-1.5 overflow-y-auto max-h-[550px] pr-1 scrollbar-thin">
          {filteredExercises.map((ex) => {
            const isCompleted = userProfile.completedExerciseIds.includes(ex.id);
            const isSelected = selectedExercise.id === ex.id;

            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 font-semibold'
                    : userProfile.darkTheme
                      ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {isBg ? ex.titleBg : ex.titleEn}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{ex.category}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    +{ex.xp} XP
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Interactive Editor & Output */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Exercise Header & Description */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-sky-400">
              {isBg ? selectedExercise.titleBg : selectedExercise.titleEn}
            </h2>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {selectedExercise.category}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                +{selectedExercise.xp} XP
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {isBg ? selectedExercise.descBg : selectedExercise.descEn}
          </p>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
            <div>
              <span className="text-slate-500 uppercase text-[10px] block font-bold">
                {isBg ? 'Очакван изход / Expected Output' : 'Expected Output'}
              </span>
              <code>{selectedExercise.expectedOutput}</code>
            </div>
          </div>
        </div>

        {/* Code Editor Box */}
        <div className={`rounded-xl border overflow-hidden shadow-2xl ${
          userProfile.darkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          {/* Editor Action Toolbar */}
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-300 text-xs font-bold">exercise_script.py</span>
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(selectedExercise.starterCode)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
                title={isBg ? 'Нулирай кода' : 'Reset Code'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyCode}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition flex items-center gap-1"
                title={isBg ? 'Копирай кода' : 'Copy Code'}
              >
                <Copy className="w-3.5 h-3.5" />
                {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
              </button>

              <button
                onClick={handleGetHint}
                disabled={loadingHint}
                className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono text-xs font-semibold border border-amber-500/20 transition flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{isBg ? 'Подсказка' : 'Hint'}</span>
              </button>

              <button
                onClick={handleFixBug}
                disabled={loadingBugFix}
                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs font-semibold border border-rose-500/30 transition flex items-center gap-1 shadow-sm"
                title={isBg ? 'AI Анализ и Декъгване на бъгове' : 'AI Bug Analysis & Fix'}
              >
                <Bug className={`w-3.5 h-3.5 ${loadingBugFix ? 'animate-spin' : ''}`} />
                <span>{loadingBugFix ? (isBg ? 'Декъг...' : 'Fixing...') : (isBg ? 'AI Дебъг' : 'AI Debug')}</span>
              </button>

              <button
                onClick={handleRun}
                className="px-3.5 py-1 bg-green-600 hover:bg-green-500 text-white font-bold text-xs font-mono rounded shadow-lg shadow-green-900/20 flex items-center gap-1.5"
                title="Shortcut: Ctrl + Enter"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isBg ? 'ИЗПЪЛНИ' : 'RUN CODE'}</span>
                <span className="text-[9px] bg-green-700/80 px-1 rounded text-green-200 ml-1 hidden sm:inline-block">
                  Ctrl+↵
                </span>
              </button>
            </div>
          </div>

          {/* Code Textarea Area */}
          <div className="relative font-mono text-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={11}
              spellCheck={false}
              className="w-full bg-slate-950 text-sky-300 p-4 font-mono leading-relaxed focus:outline-none resize-y border-none"
              placeholder="# Write your Python code here..."
            />
          </div>
        </div>

        {/* AI Hint Popup */}
        {currentHint && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <span>{isBg ? `Подсказка Ниво ${hintLevel}` : `Hint Level ${hintLevel}`}</span>
            </div>
            <p>{currentHint}</p>
          </div>
        )}

        {/* Output Console & AI Feedback Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Console Stdout */}
          <div className={`p-4 rounded-2xl border font-mono text-xs space-y-2 ${
            userProfile.darkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBg ? 'Конзолен изход / Console' : 'Console Output'}</span>
              </span>
              {executionResult && (
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  {executionResult.executionTimeMs} ms
                </span>
              )}
            </div>

            <div className="min-h-[100px] whitespace-pre-wrap text-emerald-400 leading-relaxed">
              {executionResult ? (
                executionResult.error ? (
                  <div className="space-y-3">
                    <span className="text-rose-400 block font-mono">{executionResult.error}</span>
                    <button
                      onClick={handleFixBug}
                      disabled={loadingBugFix}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Wrench className={`w-3.5 h-3.5 ${loadingBugFix ? 'animate-spin' : ''}`} />
                      <span>{loadingBugFix ? (isBg ? 'Анализиране...' : 'Analyzing...') : (isBg ? '🐛 Поправи грешката с AI' : '🐛 Fix Bug with AI')}</span>
                    </button>
                  </div>
                ) : (
                  executionResult.output || <span className="text-slate-600 italic">(Няма изход в конзолата / No output)</span>
                )
              ) : (
                <span className="text-slate-600 italic">
                  {isBg ? 'Натиснете "Изпълни" за да видите резултата...' : 'Click "Run Code" to view execution result...'}
                </span>
              )}
            </div>
          </div>

          {/* AI Real-time Feedback */}
          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
            userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isBg ? 'AI Анализ в реално време' : 'AI Real-time Review'}</span>
              </span>
              {loadingAi && (
                <span className="text-[10px] text-indigo-400 animate-pulse">
                  {isBg ? 'Анализиране...' : 'Analyzing...'}
                </span>
              )}
            </div>

            {aiAnalysis ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    aiAnalysis.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {aiAnalysis.isCorrect 
                      ? (isBg ? '✅ Вярно решение!' : '✅ Correct Solution!') 
                      : (isBg ? '⚠️ Нужда от корекция' : '⚠️ Needs Correction')}
                  </span>
                  {aiAnalysis.score && (
                    <span className="font-bold text-slate-400 text-[11px]">
                      Точки: {aiAnalysis.score}/100
                    </span>
                  )}
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {aiAnalysis.analysis}
                </p>

                {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                  <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                    {aiAnalysis.suggestions.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-slate-500 italic text-center py-6">
                {isBg ? 'Пуснете кода за автоматичен AI преглед на синтаксиса и логиката.' : 'Run your code to get immediate AI syntax & logic analysis.'}
              </p>
            )}
          </div>
        </div>

        {/* AI Bug Diagnostics & Auto-Fix Panel */}
        {bugFixData && (
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <Bug className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-rose-300 font-mono">
                    {isBg ? '🐛 AI Автоматична Диагностика на Бъгове' : '🐛 AI Automatic Bug Diagnostics'}
                  </h4>
                  <span className="text-[11px] text-rose-400 font-mono">
                    {bugFixData.lineLocation || (isBg ? 'Открит бъг в логиката' : 'Bug detected in logic')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setBugFixData(null)}
                className="text-xs text-rose-400 hover:text-rose-200 px-2 py-1 rounded bg-rose-900/40"
              >
                ✕ {isBg ? 'Затвори' : 'Close'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-rose-300 font-semibold font-mono">
                {isBg ? (bugFixData.bugDescriptionBg || bugFixData.bugDescriptionEn) : (bugFixData.bugDescriptionEn || bugFixData.bugDescriptionBg)}
              </div>

              <p className="text-slate-300 leading-relaxed">
                {isBg ? (bugFixData.explanationBg || bugFixData.explanationEn) : (bugFixData.explanationEn || bugFixData.explanationBg)}
              </p>

              {/* Fixed Code Preview */}
              {bugFixData.fixedCode && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                    <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>{isBg ? 'Предложено Коригирано Решение:' : 'Suggested Corrected Code:'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{bugFixData.fixedCode}</pre>
                  </div>

                  <button
                    onClick={handleApplyBugFix}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>{isBg ? '⚡ ПРИЛОЖИ AI ПОПРАВКАТА В РЕДАКТОРА' : '⚡ APPLY AI FIX TO EDITOR'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mentor Review Request Footer */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <Send className="w-4 h-4 text-indigo-400" />
            <span>
              {isBg 
                ? 'Искате по-дълбок анализ на кода от старши ментор?' 
                : 'Want a deeper code review from a senior Python mentor?'}
            </span>
          </div>

          <button
            onClick={() => onRequestMentorReview(code, isBg ? selectedExercise.titleBg : selectedExercise.titleEn)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-600/20"
          >
            {isBg ? 'Изпрати за Менторско Ревю' : 'Submit for Mentor Review'}
          </button>
        </div>

      </div>
    </div>
  );
};
