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