import { VisualBlock } from '../types';

export const VISUAL_BLOCK_PALETTE: VisualBlock[] = [
  {
    id: 'vb-print',
    type: 'output',
    labelBg: '🗣️ Печатай съобщение',
    labelEn: '🗣️ Print message',
    color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    codeTemplate: 'print("{val}")',
    defaultValue: 'Здравей, свят!'
  },
  {
    id: 'vb-var',
    type: 'variable',
    labelBg: '📦 Създай променлива',
    labelEn: '📦 Create variable',
    color: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    codeTemplate: '{varName} = "{val}"',
    defaultValue: 'герой = "Супер Робот"'
  },
  {
    id: 'vb-turtle-fwd',
    type: 'turtle_move',
    labelBg: '🐢 Костенурка: Напред с стъпки',
    labelEn: '🐢 Turtle: Move Forward',
    color: 'bg-amber-600 hover:bg-amber-500 text-white',
    codeTemplate: 'turtle.forward({val})',
    defaultValue: '100'
  },
  {
    id: 'vb-turtle-turn',
    type: 'turtle_move',
    labelBg: '🔄 Костенурка: Завърти на градуси',
    labelEn: '🔄 Turtle: Turn degrees',
    color: 'bg-amber-700 hover:bg-amber-600 text-white',
    codeTemplate: 'turtle.right({val})',
    defaultValue: '90'
  },
  {
    id: 'vb-turtle-color',
    type: 'turtle_color',
    labelBg: '🎨 Костенурка: Промени цвят',
    labelEn: '🎨 Turtle: Change Color',
    color: 'bg-rose-600 hover:bg-rose-500 text-white',
    codeTemplate: 'turtle.pencolor("{val}")',
    defaultValue: '#f43f5e'
  },
  {
    id: 'vb-loop',
    type: 'loop',
    labelBg: '🔁 Повтори N пъти',
    labelEn: '🔁 Repeat N times',
    color: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    codeTemplate: 'for i in range({val}):\n    turtle.forward(60)\n    turtle.right(90)',
    defaultValue: '4'
  },
  {
    id: 'vb-cond',
    type: 'condition',
    labelBg: '❓ Ако условието е вярно',
    labelEn: '❓ If condition holds',
    color: 'bg-purple-600 hover:bg-purple-500 text-white',
    codeTemplate: 'if {val} > 5:\n    print("Супер резултат!")',
    defaultValue: 'точки'
  }
];
