const fs = require('fs');
const path = require('path');
const target = 'C:\\Users\\hp\\mindmate';

function ensure(p) {
  const full = path.join(target, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  return full;
}

// 1. types
fs.writeFileSync(ensure('src/types/index.ts'), `
export type EnergyLevel = 'low' | 'okay' | 'good' | 'high';
export type StressLevel = 'calm' | 'moderate' | 'stressed' | 'very_stressed';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AvailableTime = '1h' | '2h' | '3h' | '4h' | '6h';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  durationMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  deadline: string;
  completed: boolean;
  completedAt?: string;
  subtasks?: Subtask[];
  isFocusQuestItem?: boolean;
}

export interface SmartPlanSlot {
  id: string;
  time: string;
  title: string;
  type: 'task' | 'break' | 'quick_win' | 'wind_down';
  durationMinutes: number;
  taskId?: string;
  completed: boolean;
  icon?: string;
  description?: string;
}

export interface SmartPlanMeta {
  energy: EnergyLevel;
  stress: StressLevel;
  availableTime: AvailableTime;
  strategyName: string;
  strategyDescription: string;
  totalStudyMinutes: number;
  totalBreakMinutes: number;
  generatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  targetPerWeek: number;
  streakDays: number;
  history: { [dateStr: string]: boolean };
}

export interface Goal {
  id: string;
  title: string;
  category: 'Academics' | 'Personal' | 'Projects' | 'Routine' | 'Habits';
  progress: number;
  targetDate: string;
  completed: boolean;
}

export interface MoodEntry {
  date: string;
  moodScore: number;
  stressScore: number;
  tasksCompleted: number;
  focusMinutes: number;
  note?: string;
}

export interface UserProfile {
  name: string;
  major: string;
  dailyStudyGoalHours: number;
  soundEnabled: boolean;
  focusStreak: number;
  focusPoints: number;
  onboardingCompleted: boolean;
  onboardingSelections?: {
    energy: EnergyLevel;
    stress: StressLevel;
    time: AvailableTime;
    focusAreas: string[];
  };
}

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export type ViewType = 
  | 'dashboard'
  | 'tasks'
  | 'smart-plan'
  | 'overwhelmed'
  | 'deadline-rescue'
  | 'goals-habits'
  | 'wellness'
  | 'settings';
`);

// 2. soundEffects
fs.writeFileSync(ensure('src/utils/soundEffects.ts'), `
class SoundManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  public isAmbientPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);
      gain.gain.setValueAtTime(0.1, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.35);
    });
  }

  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  playBell() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 1.3);
  }

  toggleAmbient(enable: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;
    if (!enable) {
      if (this.noiseNode) {
        try { (this.noiseNode as AudioBufferSourceNode).stop(); } catch(e){}
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      this.isAmbientPlaying = false;
      return;
    }
    if (this.isAmbientPlaying) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.0;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    this.noiseNode = noise;
    this.isAmbientPlaying = true;
  }
}

export const soundFx = new SoundManager();
`);

// 3. mockData
fs.writeFileSync(ensure('src/utils/mockData.ts'), `
import { Task, Habit, Goal, MoodEntry, UserProfile } from '../types';

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'DBMS Assignment — Normalization & ERD',
    subject: 'Database Systems',
    priority: 'high',
    difficulty: 'hard',
    durationMinutes: 30,
    deadline: 'Due Today',
    completed: false,
    isFocusQuestItem: true,
    subtasks: [
      { id: 'st-1', title: 'Review 3NF decomposition rules', completed: true, durationMinutes: 10 },
      { id: 'st-2', title: 'Solve ERD to relational schema mapping', completed: false, durationMinutes: 15 },
      { id: 'st-3', title: 'Format and submit PDF', completed: false, durationMinutes: 5 }
    ]
  },
  {
    id: 't-2',
    title: 'Mathematics Test Revision (Linear Algebra)',
    subject: 'Calculus & Algebra',
    priority: 'medium',
    difficulty: 'medium',
    durationMinutes: 25,
    deadline: 'Tomorrow',
    completed: false,
    isFocusQuestItem: true,
    subtasks: [
      { id: 'st-4', title: 'Eigenvalues & eigenvectors practice', completed: false, durationMinutes: 15 },
      { id: 'st-5', title: 'Review matrix diagonalisation proofs', completed: false, durationMinutes: 10 }
    ]
  },
  {
    id: 't-3',
    title: 'Review Data Structures notes (Binary Trees)',
    subject: 'Data Structures',
    priority: 'low',
    difficulty: 'easy',
    durationMinutes: 15,
    deadline: 'In 3 days',
    completed: false,
    isFocusQuestItem: true,
    subtasks: [
      { id: 'st-6', title: 'Glance over AVL Tree balance factors', completed: false, durationMinutes: 15 }
    ]
  },
  {
    id: 't-4',
    title: 'Programming Practice — Graph BFS / DFS',
    subject: 'Algorithms',
    priority: 'medium',
    difficulty: 'medium',
    durationMinutes: 25,
    deadline: 'In 2 days',
    completed: false,
    subtasks: [
      { id: 'st-7', title: 'Implement BFS queue traversal', completed: false, durationMinutes: 15 },
      { id: 'st-8', title: 'Solve 1 LeetCode medium question', completed: false, durationMinutes: 10 }
    ]
  },
  {
    id: 't-5',
    title: 'Read Operating Systems Lecture 4 Summary',
    subject: 'Operating Systems',
    priority: 'low',
    difficulty: 'easy',
    durationMinutes: 15,
    deadline: 'In 4 days',
    completed: true,
    completedAt: 'Today 08:30'
  },
  {
    id: 't-6',
    title: 'Submit Lab Safety Attendance Form',
    subject: 'General Academic',
    priority: 'high',
    difficulty: 'easy',
    durationMinutes: 5,
    deadline: 'Due Today',
    completed: true,
    completedAt: 'Today 08:45'
  }
];

const getPastDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const initialHabits: Habit[] = [
  {
    id: 'h-1',
    name: 'Drink 2L Water throughout study sessions',
    icon: '💧',
    targetPerWeek: 7,
    streakDays: 5,
    history: {
      [getPastDateStr(4)]: true,
      [getPastDateStr(3)]: true,
      [getPastDateStr(2)]: true,
      [getPastDateStr(1)]: true,
      [getPastDateStr(0)]: true,
    }
  },
  {
    id: 'h-2',
    name: 'Take regular 5-minute movement breaks',
    icon: '🧘',
    targetPerWeek: 7,
    streakDays: 4,
    history: {
      [getPastDateStr(3)]: true,
      [getPastDateStr(2)]: true,
      [getPastDateStr(1)]: true,
      [getPastDateStr(0)]: true,
    }
  },
  {
    id: 'h-3',
    name: 'Review today notes for 15 mins',
    icon: '📖',
    targetPerWeek: 5,
    streakDays: 3,
    history: {
      [getPastDateStr(2)]: true,
      [getPastDateStr(1)]: true,
      [getPastDateStr(0)]: false,
    }
  },
  {
    id: 'h-4',
    name: 'Sleep before 11:30 PM for mental clarity',
    icon: '🌙',
    targetPerWeek: 7,
    streakDays: 4,
    history: {
      [getPastDateStr(3)]: true,
      [getPastDateStr(2)]: true,
      [getPastDateStr(1)]: true,
      [getPastDateStr(0)]: true,
    }
  }
];

export const initialGoals: Goal[] = [
  {
    id: 'g-1',
    title: 'Master Data Structures & Algorithm Foundations',
    category: 'Academics',
    progress: 68,
    targetDate: 'Oct 20, 2026',
    completed: false
  },
  {
    id: 'g-2',
    title: 'Complete All Midterm Problem Sets Early',
    category: 'Projects',
    progress: 45,
    targetDate: 'Oct 15, 2026',
    completed: false
  },
  {
    id: 'g-3',
    title: 'Maintain 4+ Days Weekly Focus Streak',
    category: 'Habits',
    progress: 80,
    targetDate: 'Continuous',
    completed: false
  }
];

export const initialMoodEntries: MoodEntry[] = [
  { date: 'Mon', moodScore: 4, stressScore: 2, tasksCompleted: 4, focusMinutes: 110, note: 'Good energy, started with math' },
  { date: 'Tue', moodScore: 3, stressScore: 3, tasksCompleted: 5, focusMinutes: 135, note: 'A bit busy before DBMS lab' },
  { date: 'Wed', moodScore: 2, stressScore: 4, tasksCompleted: 3, focusMinutes: 80, note: 'Felt tired, used Overwhelmed mode' },
  { date: 'Thu', moodScore: 4, stressScore: 2, tasksCompleted: 6, focusMinutes: 150, note: 'Felt clear headed after breaks' },
  { date: 'Fri', moodScore: 4, stressScore: 2, tasksCompleted: 5, focusMinutes: 125, note: 'Finished weekly problem sets' },
  { date: 'Sat', moodScore: 5, stressScore: 1, tasksCompleted: 4, focusMinutes: 90, note: 'Relaxed coding session' },
  { date: 'Today', moodScore: 3, stressScore: 2, tasksCompleted: 3, focusMinutes: 75, note: 'Managing pace nicely' }
];

export const initialProfile: UserProfile = {
  name: 'Alex Rivera',
  major: 'Computer Science & Engineering',
  dailyStudyGoalHours: 3,
  soundEnabled: true,
  focusStreak: 4,
  focusPoints: 120,
  onboardingCompleted: true,
  onboardingSelections: {
    energy: 'okay',
    stress: 'moderate',
    time: '3h',
    focusAreas: ['Academics', 'Projects', 'Better habits']
  }
};
`);

// 4. smartPlanner
fs.writeFileSync(ensure('src/utils/smartPlanner.ts'), `
import { EnergyLevel, StressLevel, AvailableTime, Task, SmartPlanSlot, SmartPlanMeta } from '../types';

export function calculateStudentBattery(
  energy: EnergyLevel,
  stress: StressLevel,
  pendingHighPriorityCount: number
): { percentage: number; label: string; tone: string; description: string } {
  let base = 50;
  if (energy === 'low') base = 35;
  if (energy === 'okay') base = 62;
  if (energy === 'good') base = 78;
  if (energy === 'high') base = 92;

  if (stress === 'calm') base += 5;
  if (stress === 'moderate') base -= 2;
  if (stress === 'stressed') base -= 12;
  if (stress === 'very_stressed') base -= 20;

  if (pendingHighPriorityCount > 3) base -= 8;
  else if (pendingHighPriorityCount === 0) base += 5;

  const percentage = Math.max(15, Math.min(100, base));

  let label = 'Moderate energy';
  let tone = 'text-amber-400';
  let description = 'Based on your current check-in and today workload.';

  if (percentage >= 80) {
    label = 'High energy & ready';
    tone = 'text-emerald-400';
    description = 'High stamina available for tackling complex and deep problem solving.';
  } else if (percentage >= 60) {
    label = 'Steady & balanced';
    tone = 'text-cyan-400';
    description = 'Good rhythm for mixed problem sets and priority assignments.';
  } else if (percentage >= 40) {
    label = 'Moderate energy';
    tone = 'text-amber-400';
    description = 'Plan adapts with shorter focus sprints and restorative pauses.';
  } else {
    label = 'Low reserve / Recovery needed';
    tone = 'text-rose-400';
    description = 'Pacing is scaled down to essential micro-steps to prevent burnout.';
  }

  return { percentage, label, tone, description };
}

export function generateSmartPlan(
  tasks: Task[],
  energy: EnergyLevel,
  stress: StressLevel,
  availableTime: AvailableTime
): { slots: SmartPlanSlot[]; meta: SmartPlanMeta } {
  const timeMinutesMap: Record<AvailableTime, number> = {
    '1h': 60,
    '2h': 120,
    '3h': 180,
    '4h': 240,
    '6h': 360,
  };

  const totalCapMinutes = timeMinutesMap[availableTime] || 180;
  let remainingBudget = totalCapMinutes;

  const pendingTasks = tasks.filter(t => !t.completed);

  const sortedTasks = [...pendingTasks].sort((a, b) => {
    if (stress === 'very_stressed' || stress === 'stressed') {
      const pScore = (p: string) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
      if (pScore(a.priority) !== pScore(b.priority)) {
        return pScore(b.priority) - pScore(a.priority);
      }
      return a.durationMinutes - b.durationMinutes;
    }

    if (energy === 'low') {
      const diffScore = (d: string) => (d === 'easy' ? 1 : d === 'medium' ? 2 : 3);
      if (diffScore(a.difficulty) !== diffScore(b.difficulty)) {
        return diffScore(a.difficulty) - diffScore(b.difficulty);
      }
      return a.durationMinutes - b.durationMinutes;
    }

    if (energy === 'high') {
      const diffScore = (d: string) => (d === 'hard' ? 3 : d === 'medium' ? 2 : 1);
      if (diffScore(a.difficulty) !== diffScore(b.difficulty)) {
        return diffScore(b.difficulty) - diffScore(a.difficulty);
      }
      return b.durationMinutes - a.durationMinutes;
    }

    const pScore = (p: string) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
    return pScore(b.priority) - pScore(a.priority);
  });

  let focusChunk = 25;
  let breakChunk = 5;
  let strategyName = 'Balanced Flow';
  let strategyDescription = 'Interleaving 25-minute focus blocks with rejuvenating 5-minute pauses.';

  if (energy === 'low' && (stress === 'stressed' || stress === 'very_stressed')) {
    focusChunk = 20;
    breakChunk = 10;
    strategyName = 'Gentle Decompression';
    strategyDescription = 'Pacing with micro-sprints and frequent restorative pauses to keep anxiety low.';
  } else if (energy === 'low') {
    focusChunk = 20;
    breakChunk = 8;
    strategyName = 'Low-Energy Momentum';
    strategyDescription = 'Starting with quick wins and shorter 20-min sessions to build effortless progress.';
  } else if (energy === 'high' && stress === 'calm') {
    focusChunk = 45;
    breakChunk = 10;
    strategyName = 'Deep Work Power Sprint';
    strategyDescription = 'Optimized for high stamina: tackles complex topics early in sustained 45-min blocks.';
  } else if (stress === 'very_stressed') {
    focusChunk = 20;
    breakChunk = 10;
    strategyName = 'Stress Relief Focus';
    strategyDescription = 'Isolating urgent tasks only and clearing mental clutter with buffer intervals.';
  }

  const slots: SmartPlanSlot[] = [];
  let currentHour = 9;
  let currentMinute = 0;

  const formatTime = (h: number, m: number) => {
    const hh = String(h % 24).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const advanceTime = (mins: number) => {
    currentMinute += mins;
    while (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }
  };

  if ((energy === 'low' || stress === 'stressed' || stress === 'very_stressed') && remainingBudget >= 20) {
    const quickWinTask = sortedTasks.find(t => t.durationMinutes <= 15 && t.difficulty === 'easy');
    if (quickWinTask) {
      slots.push({
        id: 'slot-warmup',
        time: formatTime(currentHour, currentMinute),
        title: `Quick Win: ${quickWinTask.title}`,
        type: 'quick_win',
        durationMinutes: quickWinTask.durationMinutes,
        taskId: quickWinTask.id,
        completed: false,
        icon: '⚡',
        description: 'Start with an easy task to build dopamine and effortless momentum.'
      });
      advanceTime(quickWinTask.durationMinutes);
      remainingBudget -= quickWinTask.durationMinutes;

      slots.push({
        id: 'slot-break-w',
        time: formatTime(currentHour, currentMinute),
        title: 'Short break',
        type: 'break',
        durationMinutes: 5,
        completed: false,
        icon: '☕',
        description: 'Drink water and reset before diving into core tasks.'
      });
      advanceTime(5);
      remainingBudget -= 5;
    }
  }

  let taskCount = 0;
  const maxTasks = (stress === 'very_stressed' || stress === 'stressed') ? 3 : 6;

  for (const t of sortedTasks) {
    if (remainingBudget < 20 || taskCount >= maxTasks) break;
    if (slots.some(s => s.taskId === t.id)) continue;

    const taskTime = Math.min(t.durationMinutes, focusChunk, remainingBudget);

    slots.push({
      id: `slot-task-${t.id}-${taskCount}`,
      time: formatTime(currentHour, currentMinute),
      title: t.title,
      type: 'task',
      durationMinutes: taskTime,
      taskId: t.id,
      completed: false,
      icon: t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢',
      description: `${t.subject} (${t.difficulty.toUpperCase()} difficulty)`
    });

    advanceTime(taskTime);
    remainingBudget -= taskTime;
    taskCount++;

    if (remainingBudget >= breakChunk) {
      slots.push({
        id: `slot-break-${taskCount}`,
        time: formatTime(currentHour, currentMinute),
        title: breakChunk >= 10 ? 'Mindful break & stretch' : 'Short break',
        type: 'break',
        durationMinutes: breakChunk,
        completed: false,
        icon: '☕',
        description: 'Step away from screen. Let your memory consolidate.'
      });
      advanceTime(breakChunk);
      remainingBudget -= breakChunk;
    }
  }

  if (slots.length === 0) {
    slots.push({
      id: 'slot-default-1',
      time: '09:00',
      title: 'Mathematics revision',
      type: 'task',
      durationMinutes: 25,
      completed: false,
      icon: '📚',
      description: 'Review core concepts and formulas'
    });
    slots.push({
      id: 'slot-default-2',
      time: '09:25',
      title: 'Short break',
      type: 'break',
      durationMinutes: 5,
      completed: false,
      icon: '☕',
      description: 'Hydrate and stretch'
    });
    slots.push({
      id: 'slot-default-3',
      time: '09:30',
      title: 'Assignment — Questions 1–2',
      type: 'task',
      durationMinutes: 30,
      completed: false,
      icon: '📝',
      description: 'Solve first two problem sets'
    });
    slots.push({
      id: 'slot-default-4',
      time: '10:00',
      title: 'Break',
      type: 'break',
      durationMinutes: 5,
      completed: false,
      icon: '☕',
      description: 'Rest eyes'
    });
    slots.push({
      id: 'slot-default-5',
      time: '10:05',
      title: 'Programming practice',
      type: 'task',
      durationMinutes: 25,
      completed: false,
      icon: '💻',
      description: 'Graph BFS traversal algorithms'
    });
  }

  const totalStudyMinutes = slots.filter(s => s.type === 'task' || s.type === 'quick_win').reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalBreakMinutes = slots.filter(s => s.type === 'break').reduce((acc, s) => acc + s.durationMinutes, 0);

  return {
    slots,
    meta: {
      energy,
      stress,
      availableTime,
      strategyName,
      strategyDescription,
      totalStudyMinutes,
      totalBreakMinutes,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  };
}
`);

console.log('Part 1 generated successfully.');