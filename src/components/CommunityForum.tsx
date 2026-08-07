import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Search, PlusCircle, CheckCircle2, Tag, Send, ShieldCheck, Sparkles, Bot } from 'lucide-react';
import { ForumPost, ForumReply, UserProfile } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/courses';

interface CommunityForumProps {
  userProfile: UserProfile;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({ userProfile }) => {
  const isBg = userProfile.language === 'bg';
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Help' | 'Projects' | 'KidsCoding' | 'PythonTip'>('Help');
  const [newContent, setNewContent] = useState<string>('');

  const [activePostReplyId, setActivePostReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [aiGeneratingPostId, setAiGeneratingPostId] = useState<string | null>(null);

  // Ask AI to generate forum answer
  const handleGenerateAiReply = async (post: ForumPost) => {
    setAiGeneratingPostId(post.id);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Генерирай точен, загрижен и изчерпателен отговор за въпрос във форума за Python.\nЗаглавие: ${post.title}\nСъдържание: ${post.content}`,
          language: userProfile.language
        })
      });

      const data = await res.json();
      const aiReplyText = data.reply || (isBg ? 'AI Асистентът прегледа въпроса ви и препоръчва проверяване на синтаксиса.' : 'AI Assistant reviewed your question.');

      const aiReply: ForumReply = {
        id: `ai-${Date.now()}`,
        author: 'PyBG AI Tutor Bot',
        authorAvatar: '🤖',
        authorRole: 'AI Mentor',
        content: aiReplyText,
        createdAt: 'Току-що / Just now',
        upvotes: 5
      };

      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, replies: [...p.replies, aiReply] } : p));
    } catch (e) {
      console.error(e);
    } finally {
      setAiGeneratingPostId(null);
    }
  };

  // Upvote post
  const handleUpvotePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  // Create new post
  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: ForumPost = {
      id: `fp-${Date.now()}`,
      title: newTitle,
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorRole: 'Student',
      category: newCategory,
      tags: [`#${newCategory}`, '#Python'],
      content: newContent,
      upvotes: 1,
      createdAt: 'Току-що / Just now',
      isSolved: false,
      replies: []
    };

    setPosts([post, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  // Add reply
  const handleAddReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const reply: ForumReply = {
      id: `r-${Date.now()}`,
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorRole: 'Student',
      content: replyContent,
      createdAt: 'Току-що / Just now',
      upvotes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, reply]
        };
      }
      return p;
    }));

    setReplyContent('');
    setActivePostReplyId(null);
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Forum Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-cyan-400">
              {isBg ? 'Общност & Форум за Подкрепа' : 'Community & Peer Support Forum'}
            </h2>
            <p className="text-xs text-slate-400">
              {isBg 
                ? 'Задавайте въпроси, споделяйте Python проекти и помагайте на колеги и деца.' 
                : 'Ask questions, share Python projects, and get help from peers & mentors.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isBg ? 'Нова Тема във Форума' : 'New Forum Topic'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBg ? 'Търсене на теми...' : 'Search topics...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['All', 'Help', 'Projects', 'KidsCoding', 'PythonTip'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forum Post List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">{post.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                      {post.authorRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{post.createdAt}</span>
                </div>
              </div>

              {post.isSolved && (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isBg ? 'Решено' : 'Solved'}</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-100">{post.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpvotePost(post.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{post.upvotes}</span>
                </button>

                <button
                  onClick={() => setActivePostReplyId(activePostReplyId === post.id ? null : post.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{post.replies.length} {isBg ? 'отговора' : 'replies'}</span>
                </button>

                <button
                  onClick={() => handleGenerateAiReply(post)}
                  disabled={aiGeneratingPostId === post.id}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-mono text-xs font-semibold border border-sky-500/30 flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiGeneratingPostId === post.id ? 'animate-spin' : ''}`} />
                  <span>{aiGeneratingPostId === post.id ? (isBg ? 'AI Отговаря...' : 'AI Replying...') : (isBg ? 'Поискай AI Отговор' : 'Ask AI Reply')}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {post.tags.map((t, tidx) => (
                  <span key={tidx} className="text-[10px] text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Replies List */}
            {post.replies.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-800/40 pl-4 border-l-2 border-indigo-500/30">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-300">{reply.author}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
                          {reply.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{reply.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            {activePostReplyId === post.id && (
              <div className="pt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={isBg ? 'Напишете вашия отговор...' : 'Write your reply...'}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleAddReply(post.id)}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isBg ? 'Публикувай' : 'Publish Reply'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-slate-100 shadow-2xl">
            <h3 className="font-extrabold text-lg text-cyan-400">
              {isBg ? 'Нова Тема във Форума' : 'Create New Forum Topic'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {isBg ? 'Заглавие' : 'Title'}
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {isBg ? 'Категория' : 'Category'}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              >
                <option value="Help">Help (Помощ)</option>
                <option value="Projects">Projects (Проекти)</option>
                <option value="KidsCoding">KidsCoding (Детски код)</option>
                <option value="PythonTip">PythonTip (Съвети)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {isBg ? 'Съдържание' : 'Content'}
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {isBg ? 'Отказ' : 'Cancel'}
              </button>
              <button
                onClick={handleCreatePost}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20"
              >
                {isBg ? 'Публикувай' : 'Post Topic'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
