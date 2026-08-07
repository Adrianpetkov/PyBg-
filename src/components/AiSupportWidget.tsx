import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, Code2, Terminal, Lightbulb, Minimize2, Maximize2, Bug, CheckCircle2, AlertTriangle, FileText, SendHorizontal } from 'lucide-react';
import { UserProfile } from '../types';

interface AiSupportWidgetProps {
  userProfile: UserProfile;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiSupportWidget: React.FC<AiSupportWidgetProps> = ({ userProfile }) => {
  const isBg = userProfile.language === 'bg';
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Bug Report Form Modal State
  const [showBugForm, setShowBugForm] = useState(false);
  const [bugTitle, setBugTitle] = useState('');
  const [bugCategory, setBugCategory] = useState('Code Editor');
  const [bugDescription, setBugDescription] = useState('');
  const [bugCodeSnippet, setBugCodeSnippet] = useState('');
  const [bugReportSubmitted, setBugReportSubmitted] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: isBg 
        ? 'Здравейте! 👋 Аз съм вашият AI Python Учител и Поддръжка. С какво мога да ви помогна днес? Можете да питате за сбъркан код, синтаксис или да докладвате бъг с "Bug in app"!'
        : 'Hello! 👋 I am your AI Python Tutor & Support. How can I assist you today? Ask about code errors, syntax, or type "Bug in app" to report an issue!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Global Keyboard Shortcuts (Ctrl+K to toggle AI chat, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        if (showBugForm) {
          setShowBugForm(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showBugForm]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || loading) return;

    // Check if user is typing "Bug in app" or "bug"
    if (text.toLowerCase().includes('bug in app') || text.toLowerCase().includes('report bug') || text.toLowerCase().includes('докладвай бъг')) {
      setShowBugForm(true);
      setInputMsg('');
      
      const promptMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const systemMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: isBg
          ? '📋 Отворих формата за Докладване на Бъг в приложението! Моля попълнете детайлите.'
          : '📋 Opened the Bug Report Form! Please fill in the details below.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, promptMsg, systemMsg]);
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory: history,
          language: userProfile.language
        })
      });

      const data = await res.json();
      const botReply = data.reply || (isBg ? 'Възникна грешка при връзката с AI.' : 'Failed to connect to AI.');

      const botMessage: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: isBg ? '⚠️ В момента има проблем с мрежата. Моля опитайте отново.' : '⚠️ Network issue. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBugReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle.trim() || !bugDescription.trim()) return;

    setBugReportSubmitted(true);
    const reportId = `BUG-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setShowBugForm(false);
      setBugReportSubmitted(false);

      const botConfirmation: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: isBg
          ? `✅ Благодарим ви! Докладът за бъг (${reportId}) бе изпратен успешно!\n\n📌 Заглавие: "${bugTitle}"\n📂 Категория: ${bugCategory}\n📝 AI инженерният екип го преглежда.`
          : `✅ Thank you! Bug report (${reportId}) submitted successfully!\n\n📌 Title: "${bugTitle}"\n📂 Category: ${bugCategory}\n📝 Our AI engineering team is reviewing it.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botConfirmation]);

      // Reset form fields
      setBugTitle('');
      setBugDescription('');
      setBugCodeSnippet('');
    }, 1200);
  };

  const sampleQuestions = isBg ? [
    '🐛 Bug in app (Докладвай Бъг)',
    'Анализирай моя код за синтактични бъгове',
    'Защо получавам IndentationError или SyntaxError?',
    'Как се декларира функция с def?'
  ] : [
    '🐛 Bug in app',
    'Debug my code for syntax and logic errors',
    'Why do I get IndentationError or SyntaxError?',
    'How to define a function with def?'
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-bold font-mono text-xs shadow-2xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all"
          title="Shortcut: Ctrl + K"
        >
          <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950 animate-pulse" />
          <span>{isBg ? 'AI Поддръжка & Чат' : 'AI Support Chat'}</span>
          <span className="text-[10px] bg-slate-950/20 text-slate-950 px-1.5 py-0.5 rounded border border-slate-950/20 font-bold hidden sm:inline-block">
            Ctrl+K
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div 
          className={`fixed right-4 bottom-4 z-50 flex flex-col rounded-2xl border shadow-2xl transition-all ${
            userProfile.darkTheme ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          } ${
            isExpanded ? 'w-[90vw] md:w-[600px] h-[80vh]' : 'w-[92vw] sm:w-[380px] h-[520px]'
          }`}
        >
          {/* Header Bar */}
          <div className="p-3.5 bg-slate-800/90 rounded-t-2xl border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h4 className="font-bold text-xs font-mono text-slate-100 flex items-center gap-1.5">
                  <span>PyBG AI Tutor</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold">
                    Gemini 3.6
                  </span>
                </h4>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {isBg ? 'Онлайн • Реален AI' : 'Online • Live AI'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                title={isExpanded ? 'Свий' : 'Разшири'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body or Bug Form */}
          {showBugForm ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-rose-950/20 text-xs scrollbar-thin">
              <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold font-mono">
                  <Bug className="w-4 h-4 animate-bounce text-rose-400" />
                  <span>{isBg ? 'Докладване на Бъг в Приложението' : 'Report App Bug Form'}</span>
                </div>
                <button
                  onClick={() => setShowBugForm(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                >
                  ✕ {isBg ? 'Отказ' : 'Cancel'}
                </button>
              </div>

              {bugReportSubmitted ? (
                <div className="py-8 text-center space-y-2 text-emerald-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce text-emerald-400" />
                  <p className="font-bold font-mono text-sm">{isBg ? 'Докладът е Изпратен Успешно!' : 'Bug Report Sent Successfully!'}</p>
                  <p className="text-[11px] text-slate-300">{isBg ? 'Обработваме проблема...' : 'Processing issue...'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitBugReport} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold font-mono text-slate-300 mb-1">
                      {isBg ? 'Заглавие на бъга *' : 'Bug Title *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={bugTitle}
                      onChange={(e) => setBugTitle(e.target.value)}
                      placeholder={isBg ? 'напр. Бутонът RUN не се натиска' : 'e.g. Run button fails on code'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold font-mono text-slate-300 mb-1">
                      {isBg ? 'Модул / Категория' : 'Module / Category'}
                    </label>
                    <select
                      value={bugCategory}
                      onChange={(e) => setBugCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                    >
                      <option value="Code Editor">Code Editor (Редактор)</option>
                      <option value="Quiz & Exercises">Quiz & Exercises (Викторина)</option>
                      <option value="Kids Visual Coder">Kids Visual Coder (Детски Блокове)</option>
                      <option value="AI Chat">AI Chat (AI Чат)</option>
                      <option value="Audio Soundscape">Audio Soundscape (Аудио)</option>
                      <option value="Other">Other (Друго)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold font-mono text-slate-300 mb-1">
                      {isBg ? 'Описание на проблема *' : 'Bug Description *'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      placeholder={isBg ? 'Какво се случи и как да го възпроизведем?' : 'What went wrong and how to reproduce it?'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold font-mono text-slate-300 mb-1">
                      {isBg ? 'Код / Грешка (незадължително)' : 'Code Snippet / Error (optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={bugCodeSnippet}
                      onChange={(e) => setBugCodeSnippet(e.target.value)}
                      placeholder={isBg ? 'Копирайте грешката тук...' : 'Paste Python error log here...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-emerald-400 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    <span>{isBg ? 'ИЗПРАТИ ДОКЛАД ЗА БЪГ' : 'SUBMIT BUG REPORT'}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap font-sans ${
                    msg.role === 'user'
                      ? 'bg-sky-500 text-slate-950 font-medium rounded-tr-none'
                      : userProfile.darkTheme
                        ? 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none'
                        : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1 opacity-60 font-mono`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-sky-400 text-xs italic p-2 bg-sky-500/10 rounded-lg border border-sky-500/20 w-max font-mono">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{isBg ? 'AI мисли и генерира отговор...' : 'AI is thinking...'}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Action Bug Form Button Bar */}
          {!showBugForm && (
            <div className="px-3 py-1 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between shrink-0 font-mono text-[11px]">
              <button
                onClick={() => setShowBugForm(true)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold transition hover:underline"
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>{isBg ? '🐛 Намерихте Бъг? Натиснете тук' : '🐛 Found a Bug in app? Click to open form'}</span>
              </button>
            </div>
          )}

          {/* Suggested Quick Prompts */}
          {messages.length < 3 && (
            <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-800/60 bg-slate-950/40 shrink-0">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-slate-300 font-mono whitespace-nowrap transition"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 rounded-b-2xl shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={isBg ? 'Задайте въпрос за Python...' : 'Ask a Python question...'}
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={loading || !inputMsg.trim()}
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
