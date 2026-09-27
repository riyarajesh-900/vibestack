const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\hp\\mindmate';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(relativePath, content) {
  const fullPath = path.join(targetDir, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Generated: ${relativePath}`);
}

// 1. src/index.css
writeFile('src/index.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: dark;
  }
  body {
    background-color: #0B0F19;
    color: #F1F5F9;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0B0F19;
}
::-webkit-scrollbar-thumb {
  background: #1E293B;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Glassmorphism Classes */
.glass-panel {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(139, 92, 246, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-panel-hover {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-panel-hover:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 12px 40px 0 rgba(124, 58, 237, 0.15);
  transform: translateY(-2px);
}

.glass-pill {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gradient-text {
  background: linear-gradient(135deg, #A78BFA 0%, #38BDF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text-purple {
  background: linear-gradient(135deg, #C084FC 0%, #818CF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-border {
  position: relative;
  background-clip: padding-box;
  border: 1px solid transparent;
}
.gradient-border::before {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: -1;
  margin: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(56, 189, 248, 0.2));
}

/* Animations */
@keyframes breathingPulse {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 24px rgba(139, 92, 246, 0.6)); }
  100% { transform: scale(1); opacity: 0.6; }
}

.animate-breathing {
  animation: breathingPulse 8s ease-in-out infinite;
}
`);

// 2. src/types/index.ts
writeFile('src/types/index.ts', `
export type EnergyLevel = 'low' | 'okay' | 'good' | 'high';
export type StressLevel = 'calm' | 'moderate' | 'stressed' | 'very_stressed';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AvailableTime = '1h' | '2h' | '3h' | '4h' | '6h';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  deadline: string; // e.g. 'Today', 'Tomorrow', 'In 2 days', '2026-09-30'
  completed: boolean;
  completedAt?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
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
  history: { [dateStr: string]: boolean }; // YYYY-MM-DD -> boolean
}

export interface Goal {
  id: string;
  title: string;
  category: 'Academics' | 'Personal' | 'Projects' | 'Routine' | 'Habits';
  progress: number; // 0 to 100
  targetDate: string;
  completed: boolean;
}

export interface MoodEntry {
  date: string; // e.g. 'Mon', 'Tue', 'Today'
  moodScore: number; // 1-5 (1: Stressed, 5: Great)
  stressScore: number; // 1-5 (1: Calm, 5: Very Stressed)
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

// 3. src/utils/soundEffects.ts
writeFile('src/utils/soundEffects.ts', `
// Synthesized browser audio using Web Audio API (Zero external mp3 files needed)
class SoundManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private isAmbientPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    
    // Melodic gentle chime C5 -> E5 -> G5
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0.12, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.4);
    });
  }

  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  playBell() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    
    gain.gain.setValueAtTime(0.15, now);
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

    // Pink / Brown soothing noise for relaxation & focus
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to soft rain-like frequency
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

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

console.log('Core types and sound effects created.');