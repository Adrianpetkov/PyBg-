import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Keyboard, Sparkles, Play, Pause, Waves, Headphones } from 'lucide-react';

export const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [preset, setPreset] = useState<'lofi' | 'keyboard' | 'zen' | 'waves'>('lofi');
  const [volume, setVolume] = useState<number>(0.3);
  const [typingClicksEnabled, setTypingClicksEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);

  // Initialize Web Audio API
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Play ambient chord or synth sound
  const playAmbientNote = (freq: number, duration = 3, type: OscillatorType = 'sine') => {
    if (!audioCtxRef.current || !masterGainRef.current) return;

    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

      // Envelope: soft attack, long release
      const now = audioCtxRef.current.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.error(e);
    }
  };

  // Play mechanical keyboard click sound
  const playKeyboardClick = () => {
    if (!typingClicksEnabled) return;
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current) return;

    try {
      const now = audioCtxRef.current.currentTime;
      // High click noise
      const bufferSize = audioCtxRef.current.sampleRate * 0.03;
      const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtxRef.current.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800 + Math.random() * 400;

      const clickGain = audioCtxRef.current.createGain();
      clickGain.gain.setValueAtTime(0.08, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(masterGainRef.current);

      noise.start(now);
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard typing listener for keyboard click sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      playKeyboardClick();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typingClicksEnabled]);

  // Handle ambient loop
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isPlaying) {
      initAudio();

      if (preset === 'lofi') {
        const lofiChords = [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [220.00, 261.63, 329.63, 392.00], // Am7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [196.00, 246.94, 293.66, 349.23], // G7
        ];
        let chordIndex = 0;

        intervalRef.current = setInterval(() => {
          const chord = lofiChords[chordIndex % lofiChords.length];
          chord.forEach((freq) => playAmbientNote(freq, 4.5, 'triangle'));
          chordIndex++;
        }, 4000);
      } else if (preset === 'zen') {
        // Binaural relaxation
        intervalRef.current = setInterval(() => {
          playAmbientNote(108, 6, 'sine'); // Left/base
          playAmbientNote(118, 6, 'sine'); // +10Hz Alpha pulse
        }, 5000);
      } else if (preset === 'waves') {
        intervalRef.current = setInterval(() => {
          playAmbientNote(130 + Math.random() * 20, 5, 'sine');
          playAmbientNote(196 + Math.random() * 10, 6, 'sine');
        }, 4500);
      } else if (preset === 'keyboard') {
        // Auto typing rhythm background
        intervalRef.current = setInterval(() => {
          playKeyboardClick();
        }, 300);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, preset]);

  // Master volume change
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const togglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-300 shadow-md">
      {/* Title & Status */}
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${isPlaying ? 'bg-sky-500/20 text-sky-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
          <Headphones className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <span>Relax Ambient Audio</span>
            {isPlaying && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
          </div>
          <span className="text-[10px] text-slate-400">Coding Focus & Mechanical Click</span>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
        <button
          onClick={() => { setPreset('lofi'); setIsPlaying(true); }}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${preset === 'lofi' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          🎵 Lo-Fi Beats
        </button>
        <button
          onClick={() => { setPreset('keyboard'); setIsPlaying(true); }}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${preset === 'keyboard' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          ⌨️ Keyboard Click
        </button>
        <button
          onClick={() => { setPreset('zen'); setIsPlaying(true); }}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${preset === 'zen' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          🧘 Zen Alpha
        </button>
        <button
          onClick={() => { setPreset('waves'); setIsPlaying(true); }}
          className={`px-2 py-1 rounded text-[11px] font-medium transition ${preset === 'waves' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          🌊 Waves
        </button>
      </div>

      {/* Controls: Play/Pause, Typing Switch, Volume */}
      <div className="flex items-center gap-3">
        {/* Typing clicks switch */}
        <button
          onClick={() => setTypingClicksEnabled(!typingClicksEnabled)}
          className={`px-2 py-1 rounded border text-[10px] flex items-center gap-1 font-semibold transition ${
            typingClicksEnabled 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}
          title="Toggle keyboard click sounds when you type"
        >
          <Keyboard className="w-3 h-3" />
          <span>{typingClicksEnabled ? 'Type Sound: ON' : 'Type Sound: OFF'}</span>
        </button>

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>

        {/* Main Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 text-xs transition ${
            isPlaying 
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
              : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>
      </div>
    </div>
  );
};
