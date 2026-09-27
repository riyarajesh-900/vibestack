import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, 
  Habit, 
  Goal, 
  MoodEntry, 
  UserProfile, 
  EnergyLevel, 
  StressLevel, 
  AvailableTime, 
  SmartPlanSlot, 
  SmartPlanMeta, 
  Toast, 
  ViewType 
} from '../types';
import { 
  initialTasks, 
  initialHabits, 
  initialGoals, 
  initialMoodEntries, 
  initialProfile 
} from '../utils/mockData';
import { generateSmartPlan, calculateStudentBattery } from '../utils/smartPlanner';
import { soundFx } from '../utils/soundEffects';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  
  energy: EnergyLevel;
  setEnergy: (e: EnergyLevel) => void;
  stress: StressLevel;
  setStress: (s: StressLevel) => void;
  availableTime: AvailableTime;
  setAvailableTime: (t: AvailableTime) => void;
  
  smartPlanSlots: SmartPlanSlot[];
  smartPlanMeta: SmartPlanMeta;
  regeneratePlan: (overrideEnergy?: EnergyLevel, overrideStress?: StressLevel, overrideTime?: AvailableTime) => void;
  togglePlanSlotComplete: (slotId: string) => void;
  
  studentBattery: { percentage: number; label: string; tone: string; description: string };
  
  habits: Habit[];
  toggleHabitToday: (habitId: string) => void;
  addHabit: (name: string, icon: string, targetPerWeek: number) => void;
  
  goals: Goal[];
  updateGoalProgress: (goalId: string, newProgress: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  
  moodEntries: MoodEntry[];
  addMoodEntry: (score: number, stress: number, note?: string) => void;
  
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  focusQuestCompleted: boolean;
  claimFocusQuestReward: () => void;
  
  activeFocusTimer: { isOpen: boolean; title: string; initialMinutes: number } | null;
  startFocusTimer: (title: string, durationMinutes: number) => void;
  closeFocusTimer: () => void;
  
  openCheckInModal: boolean;
  setOpenCheckInModal: (open: boolean) => void;
  
  openAddTaskModal: boolean;
  setOpenAddTaskModal: (open: boolean) => void;
  
  editingTask: Task | null;
  setEditingTask: (t: Task | null) => void;
  
  breakdownTaskData: Task | null;
  setBreakdownTaskData: (t: Task | null) => void;
  
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mindmate_user');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('mindmate_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [energy, setEnergyState] = useState<EnergyLevel>('okay');
  const [stress, setStressState] = useState<StressLevel>('moderate');
  const [availableTime, setAvailableTimeState] = useState<AvailableTime>('3h');

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('mindmate_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('mindmate_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('mindmate_moods');
    return saved ? JSON.parse(saved) : initialMoodEntries;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [focusQuestRewardClaimed, setFocusQuestRewardClaimed] = useState(false);
  
  // Modals state
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [breakdownTaskData, setBreakdownTaskData] = useState<Task | null>(null);
  const [activeFocusTimer, setActiveFocusTimer] = useState<{ isOpen: boolean; title: string; initialMinutes: number } | null>(null);

  // Initialize Smart Plan
  const [smartPlanData, setSmartPlanData] = useState(() => {
    return generateSmartPlan(initialTasks, 'okay', 'moderate', '3h');
  });

  // Calculate Student Battery
  const pendingHighCount = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const studentBattery = calculateStudentBattery(energy, stress, pendingHighCount);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    if (user.soundEnabled) {
      if (type === 'success') soundFx.playSuccess();
      else soundFx.playClick();
    }
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mindmate_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mindmate_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('mindmate_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('mindmate_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('mindmate_moods', JSON.stringify(moodEntries));
  }, [moodEntries]);

  // Tasks actions
  const addTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: 't-' + Date.now(),
      completed: false,
    };
    setTasks(prev => [task, ...prev]);
    showToast(`Task added: "${task.title}"`, 'success');
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Task updated successfully', 'info');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed', 'info');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          showToast(`Completed "${t.title}" 🎉`, 'success');
        }
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          subtasks: t.subtasks?.map(st => ({ ...st, completed: nextState }))
        };
      }
      return t;
    }));
  };

  const toggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.subtasks) {
        const updatedSubtasks = t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
        const allDone = updatedSubtasks.every(st => st.completed);
        if (allDone && !t.completed) {
          showToast(`All subtasks done for "${t.title}"! 🎉`, 'success');
        }
        return {
          ...t,
          subtasks: updatedSubtasks,
          completed: allDone ? true : t.completed
        };
      }
      return t;
    }));
  };

  // Plan actions
  const regeneratePlan = (
    overrideEnergy?: EnergyLevel,
    overrideStress?: StressLevel,
    overrideTime?: AvailableTime
  ) => {
    const e = overrideEnergy ?? energy;
    const s = overrideStress ?? stress;
    const t = overrideTime ?? availableTime;
    const newPlan = generateSmartPlan(tasks, e, s, t);
    setSmartPlanData(newPlan);
    showToast('Smart Plan adapted to your energy and workload 🧠', 'info');
  };

  const setEnergy = (e: EnergyLevel) => {
    setEnergyState(e);
    regeneratePlan(e, stress, availableTime);
  };

  const setStress = (s: StressLevel) => {
    setStressState(s);
    regeneratePlan(energy, s, availableTime);
  };

  const setAvailableTime = (t: AvailableTime) => {
    setAvailableTimeState(t);
    regeneratePlan(energy, stress, t);
  };

  const togglePlanSlotComplete = (slotId: string) => {
    setSmartPlanData(prev => ({
      ...prev,
      slots: prev.slots.map(s => {
        if (s.id === slotId) {
          const next = !s.completed;
          if (next) {
            showToast(`Session finished: ${s.title} 🎉`, 'success');
            if (s.taskId) {
              // mark task complete as well
              toggleTaskComplete(s.taskId);
            }
          }
          return { ...s, completed: next };
        }
        return s;
      })
    }));
  };

  // Habits actions
  const toggleHabitToday = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isDone = !h.history[todayStr];
        const newHistory = { ...h.history, [todayStr]: isDone };
        const newStreak = isDone ? h.streakDays + 1 : Math.max(0, h.streakDays - 1);
        if (isDone) {
          showToast(`Habit completed: ${h.name} 🔥`, 'success');
        }
        return {
          ...h,
          streakDays: newStreak,
          history: newHistory
        };
      }
      return h;
    }));
  };

  const addHabit = (name: string, icon: string, targetPerWeek: number) => {
    const newHabit: Habit = {
      id: 'h-' + Date.now(),
      name,
      icon: icon || '✨',
      targetPerWeek,
      streakDays: 0,
      history: {}
    };
    setHabits(prev => [...prev, newHabit]);
    showToast(`New habit tracked: ${name}`, 'success');
  };

  // Goals actions
  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const clamped = Math.max(0, Math.min(100, newProgress));
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const completed = clamped >= 100;
        if (completed && !g.completed) {
          showToast(`Goal Achieved: "${g.title}" 🏆`, 'success');
        }
        return { ...g, progress: clamped, completed };
      }
      return g;
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = {
      ...goal,
      id: 'g-' + Date.now(),
      completed: goal.progress >= 100
    };
    setGoals(prev => [...prev, newGoal]);
    showToast(`New goal added: "${goal.title}"`, 'success');
  };

  // Wellness actions
  const addMoodEntry = (score: number, stressScore: number, note?: string) => {
    const newEntry: MoodEntry = {
      date: 'Today',
      moodScore: score,
      stressScore,
      tasksCompleted: tasks.filter(t => t.completed).length,
      focusMinutes: 85,
      note
    };
    setMoodEntries(prev => [...prev.slice(0, 6), newEntry]);
    showToast('Daily check-in logged 🌱', 'success');
  };

  // Focus Quest Check
  const focusQuestTasks = tasks.filter(t => t.isFocusQuestItem);
  const questCompletedCount = focusQuestTasks.filter(t => t.completed).length;
  const focusQuestCompleted = focusQuestTasks.length > 0 && questCompletedCount >= 3;

  const claimFocusQuestReward = () => {
    if (focusQuestRewardClaimed) return;
    setUser(prev => ({
      ...prev,
      focusPoints: prev.focusPoints + 30,
      focusStreak: prev.focusStreak + 1
    }));
    setFocusQuestRewardClaimed(true);
    showToast('🎉 +30 Focus Points Awarded! Focus streak increased!', 'success');
  };

  // Focus timer
  const startFocusTimer = (title: string, durationMinutes: number) => {
    setActiveFocusTimer({
      isOpen: true,
      title,
      initialMinutes: durationMinutes
    });
  };

  const closeFocusTimer = () => {
    setActiveFocusTimer(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Profile updated', 'info');
  };

  const resetAllData = () => {
    setUser(initialProfile);
    setTasks(initialTasks);
    setHabits(initialHabits);
    setGoals(initialGoals);
    setMoodEntries(initialMoodEntries);
    setEnergyState('okay');
    setStressState('moderate');
    setAvailableTimeState('3h');
    setFocusQuestRewardClaimed(false);
    setSmartPlanData(generateSmartPlan(initialTasks, 'okay', 'moderate', '3h'));
    localStorage.clear();
    showToast('Reset to demo student data ✨', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        updateUser,
        tasks,
        addTask,
        editTask,
        deleteTask,
        toggleTaskComplete,
        toggleSubtaskComplete,
        energy,
        setEnergy,
        stress,
        setStress,
        availableTime,
        setAvailableTime,
        smartPlanSlots: smartPlanData.slots,
        smartPlanMeta: smartPlanData.meta,
        regeneratePlan,
        togglePlanSlotComplete,
        studentBattery,
        habits,
        toggleHabitToday,
        addHabit,
        goals,
        updateGoalProgress,
        addGoal,
        moodEntries,
        addMoodEntry,
        toasts,
        showToast,
        removeToast,
        focusQuestCompleted,
        claimFocusQuestReward,
        activeFocusTimer,
        startFocusTimer,
        closeFocusTimer,
        openCheckInModal,
        setOpenCheckInModal,
        openAddTaskModal,
        setOpenAddTaskModal,
        editingTask,
        setEditingTask,
        breakdownTaskData,
        setBreakdownTaskData,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};