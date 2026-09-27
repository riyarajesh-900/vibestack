import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  Flame, 
  Plus, 
  Check, 
  Sparkles, 
  Award, 
  Calendar, 
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const GoalsHabitsView: React.FC = () => {
  const { 
    goals, 
    updateGoalProgress, 
    addGoal, 
    habits, 
    toggleHabitToday, 
    addHabit, 
    user 
  } = useApp();

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'Academics' | 'Personal' | 'Projects' | 'Routine' | 'Habits'>('Academics');
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('✨');
  const [showAddHabit, setShowAddHabit] = useState(false);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    addGoal({
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      progress: 0,
      targetDate: 'End of Term',
    });
    setNewGoalTitle('');
    setShowAddGoal(false);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitIcon, 7);
    setNewHabitName('');
    setShowAddHabit(false);
  };

  // 7-day history helpers
  const pastDays = [6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysAgo === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    return { dateStr, dayName, isToday: daysAgo === 0 };
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Goals & Daily Habits</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{user.focusStreak} Day Focus Streak</span>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Build sustainable academic consistency without burning out. Track high-level targets and micro-habits.
          </p>
        </div>
      </div>

      {/* Streak Showcase Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-purple-950/30 border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 animate-float">
            <Flame className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-extrabold text-white">🔥 {user.focusStreak} Day Focus Streak</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Active</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              You've earned <span className="text-amber-400 font-bold">{user.focusPoints} Focus XP</span> so far. Complete today's focus quest to extend the streak.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 self-center sm:self-auto bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
          {pastDays.map(d => {
            const allHabitsDone = habits.every(h => h.history[d.dateStr]);
            return (
              <div key={d.dateStr} className="text-center px-1.5">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">{d.dayName}</span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  d.isToday
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-purple-400'
                    : allHabitsDone
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {d.isToday ? '★' : '✓'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Habit Tracker & Today's Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habits (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-base">🔄</span>
              <h3 className="text-base font-bold text-white">Daily Habit Tracker</h3>
            </div>
            <button
              onClick={() => setShowAddHabit(!showAddHabit)}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Habit</span>
            </button>
          </div>

          {/* Add Habit Form */}
          {showAddHabit && (
            <form onSubmit={handleCreateHabit} className="p-3.5 rounded-2xl bg-slate-800/80 border border-purple-500/30 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Icon emoji (e.g. 💧, 🧘, 📖)"
                  value={newHabitIcon}
                  onChange={e => setNewHabitIcon(e.target.value)}
                  className="w-16 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Habit name (e.g. 10-min post-lunch walk)"
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddHabit(false)}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>
          )}

          {/* Habits List */}
          <div className="space-y-3">
            {habits.map(habit => {
              const isTodayDone = !!habit.history[todayStr];
              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isTodayDone
                      ? 'bg-slate-900/60 border-emerald-500/30 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-2xl p-2 rounded-2xl bg-slate-800 border border-slate-700 shrink-0">
                      {habit.icon}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-bold truncate ${isTodayDone ? 'text-emerald-300' : 'text-slate-100'}`}>
                        {habit.name}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400 font-semibold">🔥 {habit.streakDays} day streak</span>
                        <span>• Target: {habit.targetPerWeek}x / week</span>
                      </p>
                    </div>
                  </div>

                  {/* Toggle Today Checkbox Button */}
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 shrink-0 ml-2 ${
                      isTodayDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/40'
                        : 'border-slate-700 text-slate-300 hover:border-purple-400 hover:text-white bg-slate-800'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isTodayDone ? 'Completed' : 'Mark Today'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-base">🎯</span>
              <h3 className="text-base font-bold text-white">Active Goals</h3>
            </div>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Add Goal Form */}
          {showAddGoal && (
            <form onSubmit={handleCreateGoal} className="p-3.5 rounded-2xl bg-slate-800/80 border border-purple-500/30 space-y-3">
              <input
                type="text"
                required
                placeholder="Goal title (e.g. Study Operating Systems)"
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <select
                value={newGoalCategory}
                onChange={e => setNewGoalCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="Academics">📚 Academics</option>
                <option value="Projects">💻 Projects</option>
                <option value="Personal">🎯 Personal</option>
                <option value="Routine">🏃 Routine</option>
                <option value="Habits">🔄 Habits</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Add Goal
                </button>
              </div>
            </form>
          )}

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    {goal.category}
                  </span>
                  <span className="text-xs font-black text-cyan-300">{goal.progress}%</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-100">{goal.title}</p>

                <div className="space-y-1">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Target: {goal.targetDate}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={goal.progress}
                      onChange={e => updateGoalProgress(goal.id, Number(e.target.value))}
                      className="w-24 accent-purple-500 cursor-pointer"
                      title="Adjust progress"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};