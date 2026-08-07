import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Trash2, 
  Sparkles, 
  Blocks, 
  Palette, 
  RotateCcw, 
  Award, 
  Code2, 
  Smile, 
  Wand2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VisualBlock, UserProfile } from '../types';
import { VISUAL_BLOCK_PALETTE } from '../data/visualBlocks';
import { runPythonCode, TurtleCommand } from '../utils/pythonRunner';

interface KidsVisualCoderProps {
  userProfile: UserProfile;
  onAwardXp: (xp: number) => void;
}

export const KidsVisualCoder: React.FC<KidsVisualCoderProps> = ({ userProfile, onAwardXp }) => {
  const isBg = userProfile.language === 'bg';
  
  // Kids Program Missions
  const KIDS_MISSIONS = [
    {
      id: 'mission-space',
      titleBg: '🚀 Космическа Костенурка (Space Turtle)',
      titleEn: '🚀 Space Turtle Mission',
      descBg: 'Нарисувай квадрат в космоса с твоето костенурче!',
      descEn: 'Draw a space square with your turtle robot!',
      blocks: [
        { ...VISUAL_BLOCK_PALETTE[4], defaultValue: 'cyan' }, // color cyan
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '100' }, // forward 100
        { ...VISUAL_BLOCK_PALETTE[3], defaultValue: '90' },  // right 90
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '100' }, // forward 100
        { ...VISUAL_BLOCK_PALETTE[3], defaultValue: '90' },  // right 90
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '100' }, // forward 100
        { ...VISUAL_BLOCK_PALETTE[3], defaultValue: '90' },  // right 90
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '100' }  // forward 100
      ]
    },
    {
      id: 'mission-rainbow',
      titleBg: '🌈 Дъгова Линия (Rainbow Line)',
      titleEn: '🌈 Rainbow Path',
      descBg: 'Сменяй цветовете и тръгни напред!',
      descEn: 'Change colors and draw a colorful ray!',
      blocks: [
        { ...VISUAL_BLOCK_PALETTE[4], defaultValue: 'red' },
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '50' },
        { ...VISUAL_BLOCK_PALETTE[4], defaultValue: 'yellow' },
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '50' },
        { ...VISUAL_BLOCK_PALETTE[4], defaultValue: 'lime' },
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '50' }
      ]
    },
    {
      id: 'mission-maze',
      titleBg: '🏴‍☠️ Лабиринт с Съкровище (Treasure Maze)',
      titleEn: '🏴‍☠️ Treasure Maze',
      descBg: 'Завий наляво и надясно за съкровището!',
      descEn: 'Turn left and right to reach the treasure!',
      blocks: [
        { ...VISUAL_BLOCK_PALETTE[4], defaultValue: 'gold' },
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '80' },
        { ...VISUAL_BLOCK_PALETTE[3], defaultValue: '90' },
        { ...VISUAL_BLOCK_PALETTE[2], defaultValue: '80' }
      ]
    }
  ];

  const [activeMission, setActiveMission] = useState(KIDS_MISSIONS[0]);

  // Kids workspace blocks list
  const [workspaceBlocks, setWorkspaceBlocks] = useState<VisualBlock[]>(KIDS_MISSIONS[0].blocks);

  const [synthesizedPython, setSynthesizedPython] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [aiKidsStory, setAiKidsStory] = useState<string | null>(null);
  const [loadingKidsAi, setLoadingKidsAi] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ask AI to generate fun kids story for the code
  const handleGetKidsStory = async () => {
    setLoadingKidsAi(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Разкажи кратка (2 изречения), супер забавна и вдъхновяваща приказка за деца, обясняваща какво прави този Python код с Костенурката:\n\`\`\`python\n${synthesizedPython}\n\`\`\``,
          language: userProfile.language
        })
      });

      const data = await res.json();
      setAiKidsStory(data.reply || (isBg ? 'Костенурката нарисува прекрасна форма!' : 'The turtle drew an awesome shape!'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKidsAi(false);
    }
  };

  // Generate Python code from active blocks
  useEffect(() => {
    const pythonLines = workspaceBlocks.map(block => {
      return block.codeTemplate.replace('{val}', block.defaultValue).replace('{varName}', 'робот');
    });
    setSynthesizedPython(pythonLines.join('\n'));
  }, [workspaceBlocks]);

  // Add block to workspace
  const handleAddBlock = (block: VisualBlock) => {
    setWorkspaceBlocks(prev => [...prev, { ...block, id: `block-${Date.now()}-${Math.random()}` }]);
  };

  // Remove block
  const handleRemoveBlock = (index: number) => {
    setWorkspaceBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // Update block input value
  const handleUpdateBlockValue = (index: number, newVal: string) => {
    setWorkspaceBlocks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], defaultValue: newVal };
      return updated;
    });
  };

  // Run Visual Program & Turtle Canvas Drawing
  const handleRunProgram = () => {
    const res = runPythonCode(synthesizedPython);
    setConsoleOutput(res.output || (isBg ? 'Програмата се изпълни успешно! 🌟' : 'Program completed! 🌟'));

    // Draw Turtle graphics on Canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid/background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center position
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let angle = -90; // Facing up
        let currentColor = '#38bdf8'; // Default cyan
        ctx.lineWidth = 3;
        ctx.strokeStyle = currentColor;

        ctx.beginPath();
        ctx.moveTo(x, y);

        res.turtleCommands.forEach((cmd: TurtleCommand) => {
          if (cmd.type === 'forward') {
            const dist = Number(cmd.value) || 50;
            const rad = (angle * Math.PI) / 180;
            x += Math.cos(rad) * dist;
            y += Math.sin(rad) * dist;
            ctx.lineTo(x, y);
            ctx.stroke();
          } else if (cmd.type === 'right') {
            angle += Number(cmd.value) || 90;
          } else if (cmd.type === 'left') {
            angle -= Number(cmd.value) || 90;
          } else if (cmd.type === 'color') {
            currentColor = String(cmd.value);
            ctx.strokeStyle = currentColor;
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
        });

        // Draw turtle icon / circle at final position
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Celebrate with confetti!
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    onAwardXp(15);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner for Kids Mode */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 border border-emerald-500/30 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Blocks className="w-4 h-4 text-emerald-400" />
              <span>{isBg ? 'ДЕТСКИ ВИЗУАЛЕН РЕЖИМ 🐢' : 'KIDS VISUAL MODE 🐢'}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-emerald-300">
              {isBg ? 'Сглоби Python код като Лего!' : 'Build Python Code like Lego!'}
            </h2>
            <p className="text-teal-200 text-sm max-w-xl">
              {isBg 
                ? 'Плъзгай и кликвай цветни блокове, виж как се превръщат в законен Python код и рисувай магически фигури с Костенурката!' 
                : 'Click colorful blocks, watch them instantly transform into real Python code, and draw magical shapes!'}
            </p>
          </div>

          <div className="text-5xl animate-bounce">🐢</div>
        </div>
      </div>

      {/* Kids Missions Preset Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
            <Award className="w-4 h-4" />
            <span>{isBg ? 'Нова Детска Програма & Мисии 🎮' : 'Kids Missions & Program 🎮'}</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Select a mission to auto-load blocks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {KIDS_MISSIONS.map((m) => {
            const isSelected = activeMission.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMission(m);
                  setWorkspaceBlocks(m.blocks);
                }}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs font-mono">{isBg ? m.titleBg : m.titleEn}</div>
                <div className="text-[11px] text-slate-400 mt-1">{isBg ? m.descBg : m.descEn}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Block Palette (Left Column) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border space-y-4 ${
          userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            <span>{isBg ? 'Палитра с Магически Блокове' : 'Magic Block Palette'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {isBg ? 'Кликнете на блок, за да го добавите към вашата програма:' : 'Click a block to add it to your program workspace:'}
          </p>

          <div className="space-y-2.5">
            {VISUAL_BLOCK_PALETTE.map((block) => (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className={`w-full p-3 rounded-xl ${block.color} font-bold text-xs shadow-md transition transform hover:scale-102 active:scale-95 flex items-center justify-between`}
              >
                <span>{isBg ? block.labelBg : block.labelEn}</span>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">+ Добави</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace & Python Synthesis (Middle Column) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Workspace List */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Blocks className="w-4 h-4 text-indigo-400" />
                <span>{isBg ? 'Твоята Работилница (Работна Площ)' : 'Your Block Workspace'}</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWorkspaceBlocks([])}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isBg ? 'Изчисти' : 'Clear All'}</span>
                </button>

                <button
                  onClick={handleRunProgram}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isBg ? 'Пусни Магията! 🚀' : 'Run Magic! 🚀'}</span>
                </button>
              </div>
            </div>

            {/* Block Sequence Stack */}
            <div className="space-y-3 min-h-[160px] p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {workspaceBlocks.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {isBg ? 'Празно пано. Добавете блокове от лявата палитра!' : 'Empty workspace. Add blocks from the left palette!'}
                </div>
              ) : (
                workspaceBlocks.map((blk, idx) => (
                  <div
                    key={blk.id}
                    className={`p-3 rounded-xl ${blk.color} flex flex-wrap items-center justify-between gap-3 shadow-md`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs bg-black/20 px-2 py-0.5 rounded text-white/80">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-xs">{isBg ? blk.labelBg : blk.labelEn}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={blk.defaultValue}
                        onChange={(e) => handleUpdateBlockValue(idx, e.target.value)}
                        className="px-2.5 py-1 rounded bg-black/40 text-white font-mono text-xs focus:outline-none border border-white/20 w-36 text-center"
                      />
                      <button
                        onClick={() => handleRemoveBlock(idx)}
                        className="p-1 rounded hover:bg-black/30 text-white/80 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Generated Real Python Code + Live Turtle Drawing Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Real Python Code Box */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              userProfile.darkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>{isBg ? 'Генериран Python Код' : 'Synthesized Python Code'}</span>
                </span>
              </div>
              <pre className="font-mono text-xs text-emerald-300 p-2 leading-relaxed min-h-[140px] whitespace-pre-wrap">
                {synthesizedPython}
              </pre>
            </div>

            {/* Turtle Canvas Graphic */}
            <div className={`p-4 rounded-2xl border space-y-2 flex flex-col items-center justify-center ${
              userProfile.darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 self-start border-b border-slate-800/50 pb-1 w-full">
                <Palette className="w-4 h-4" />
                <span>{isBg ? 'Костенурка Чертожно Пано 🐢' : 'Turtle Drawing Canvas 🐢'}</span>
              </span>

              <canvas
                ref={canvasRef}
                width={260}
                height={160}
                className="rounded-xl border border-slate-700/60 shadow-inner bg-slate-950"
              />

              {consoleOutput && (
                <div className="p-2 rounded bg-slate-950 text-emerald-400 font-mono text-[11px] w-full text-center">
                  {consoleOutput}
                </div>
              )}
            </div>

          </div>

          {/* AI Magic Story Banner for Kids */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{isBg ? 'AI Разказвач на Магически Приказки 🪄' : 'AI Magic Code Storyteller 🪄'}</span>
              </div>
              <p className="text-slate-300">
                {aiKidsStory || (isBg ? 'Поискайте от AI да ви разкаже приказка за това какво прави вашият код!' : 'Ask AI to tell a short story about what your code does!')}
              </p>
            </div>

            <button
              onClick={handleGetKidsStory}
              disabled={loadingKidsAi}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-600/20 shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loadingKidsAi ? 'animate-spin' : ''}`} />
              <span>{loadingKidsAi ? (isBg ? 'Генериране...' : 'Generating...') : (isBg ? 'Разкажи Приказка' : 'Tell Story')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
