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