import React, { useState } from 'react';
import { RefreshCw, Copy, Check, CloudUpload, CloudDownload, Smartphone, Key } from 'lucide-react';
import { UserProfile } from '../types';

interface SyncModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onRestoreState: (restoredState: UserProfile) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ userProfile, onClose, onRestoreState }) => {
  const isBg = userProfile.language === 'bg';
  const [syncCodeInput, setSyncCodeInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Save current profile state to cloud
  const handleSaveToCloud = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncCode: userProfile.syncCode,
          userState: userProfile
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(isBg ? '✅ Прогресът е запазен успешно в облака!' : '✅ Progress successfully backed up to cloud!');
      }
    } catch (e) {
      setStatusMessage(isBg ? '❌ Грешка при запазване.' : '❌ Backup failed.');
    } finally {
      setLoading(false);
    }
  };

  // Load state from cloud using sync code
  const handleLoadFromCloud = async () => {
    const codeToUse = syncCodeInput.trim() || userProfile.syncCode;
    setLoading(true);
    try {
      const res = await fetch(`/api/sync/load/${codeToUse}`);
      const data = await res.json();
      if (data.success && data.userState) {
        onRestoreState(data.userState);
        setStatusMessage(isBg ? '🎉 Прогресът е синхронизиран успешно от другото устройство!' : '🎉 State synchronized successfully from other device!');
      } else {
        setStatusMessage(isBg ? '⚠️ Неуспешно намерена такъв синхронизационен код.' : '⚠️ Sync code not found.');
      }
    } catch (e) {
      setStatusMessage(isBg ? '❌ Грешка при синхронизация.' : '❌ Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userProfile.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-slate-100 shadow-2xl relative">
        
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-cyan-400">
              {isBg ? 'Синхронизация между устройства' : 'Cross-Device Cloud Sync'}
            </h3>
            <p className="text-xs text-slate-400">
              {isBg 
                ? 'Продължете ученето си на телефон, лаптоп или таблет без загуба на данни.' 
                : 'Continue your learning session on any phone, laptop, or tablet.'}
            </p>
          </div>
        </div>

        {/* Current Sync Code Display */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBg ? 'Вашият уникален синхро код:' : 'Your Unique Sync Code:'}
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-2xl font-black text-amber-400 tracking-widest">
              {userProfile.syncCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Копирай кода"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Cloud Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSaveToCloud}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isBg ? 'Запази текущия прогрес в Облака' : 'Save Current Progress to Cloud'}</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <label className="block text-xs font-semibold text-slate-400">
              {isBg ? 'Въведете код от друго устройство за сдвояване:' : 'Enter sync code from another device:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={syncCodeInput}
                onChange={(e) => setSyncCodeInput(e.target.value.toUpperCase())}
                placeholder="PY-123456"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 focus:outline-none uppercase"
              />
              <button
                onClick={handleLoadFromCloud}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <CloudDownload className="w-4 h-4" />
                <span>{isBg ? 'Зареди' : 'Sync'}</span>
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center text-slate-300 font-medium">
            {statusMessage}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            {isBg ? 'Затвори' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
