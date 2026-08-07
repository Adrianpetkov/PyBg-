export type Language = 'bg' | 'en';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'kids';

export type TabType = 
  | 'exercises'
  | 'kids'
  | 'quiz'
  | 'path'
  | 'mentors'
  | 'forum'
  | 'tracker';

export interface ExerciseTestCase {
  input?: string;
  expectedOutput: string;
  description: string;
}

export interface Exercise {
  id: string;
  titleBg: string;
  titleEn: string;
  descBg: string;
  descEn: string;
  level: SkillLevel;
  xp: number;
  category: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hintsBg: string[];
  hintsEn: string[];
  testCases?: ExerciseTestCase[];
}

export interface QuizQuestion {
  id: string;
  titleBg: string;
  titleEn: string;
  codeSnippet?: string;
  optionsBg: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBg: string;
  explanationEn: string;
  xp: number;
  level: SkillLevel;
}

export interface VisualBlock {
  id: string;
  type: 'output' | 'variable' | 'loop' | 'condition' | 'turtle_move' | 'turtle_color' | 'turtle_shape' | 'math' | 'list';
  labelBg: string;
  labelEn: string;
  color: string;
  codeTemplate: string; // e.g. "print('{val}')"
  defaultValue: string;
}

export interface ForumReply {
  id: string;
  author: string;
  authorAvatar: string;
  authorRole: 'Student' | 'Mentor' | 'Admin' | 'Kid Coder' | 'AI Mentor';
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  authorRole: 'Student' | 'Mentor' | 'Admin' | 'Kid Coder' | 'AI Mentor';
  category: 'Help' | 'Projects' | 'KidsCoding' | 'PythonTip' | 'General';
  tags: string[];
  content: string;
  upvotes: number;
  createdAt: string;
  isSolved: boolean;
  replies: ForumReply[];
}

export interface Mentor {
  id: string;
  name: string;
  titleBg: string;
  titleEn: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  bioBg: string;
  bioEn: string;
  specialties: string[];
  hourlyRateBg: string;
  available: boolean;
}

export interface MentorReviewResult {
  mentorName: string;
  overallFeedback: string;
  readabilityScore: number;
  efficiencyScore: number;
  pythonicScore: number;
  lineComments: { line: number; comment: string }[];
  refactoredCode: string;
}

export interface MentorRequest {
  id: string;
  mentorId: string;
  studentName: string;
  projectTitle: string;
  code: string;
  status: 'pending' | 'reviewed';
  createdAt: string;
  review?: MentorReviewResult;
}

export interface PathModule {
  id: string;
  titleBg: string;
  titleEn: string;
  topics: string[];
  estimatedHours: number;
  completed: boolean;
  descBg: string;
  descEn: string;
}

export interface StudyPath {
  goal: string;
  skillLevel: SkillLevel;
  hoursPerWeek: number;
  estimatedWeeks: number;
  modules: PathModule[];
}

export interface Badge {
  id: string;
  titleBg: string;
  titleEn: string;
  icon: string;
  descBg: string;
  descEn: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  skillLevel: SkillLevel;
  language: Language;
  darkTheme: boolean;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedExerciseIds: string[];
  badges: Badge[];
  syncCode: string;
  dailyGoalXp: number;
  todayXp: number;
  dailyActivityMap: Record<string, number>; // date "YYYY-MM-DD" -> XP
}
