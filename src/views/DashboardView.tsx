import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  BrainCircuit, 
  LifeBuoy, 
  AlarmClock, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Zap, 
  Sparkles, 
  Play, 
  Check, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    tasks, 
    toggleTaskComplete, 
    smartPlanSlots, 
    togglePlanSlotComplete, 
    studentBattery, 
    setCurrentView, 
    setOpenAddTaskModal, 
    setOpenCheckInModal,
    startFocusTimer,
    focusQuestCompleted,
    claimFocusQuestReward
  } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentTasks = tasks.filter(t => !t.completed && (t.priority === 'high' || t.deadline.toLowerCase().includes('today')));
  const upcomingTasks = tasks.filter(t => !t.completed && t.priority === 'medium' && !t.deadline.toLowerCase().includes('today'));
  const quickWinTasks = tasks.filter(t => !t.completed && (t.priority === 'low' || t.durationMinutes <= 15));

  const questTasks = tasks.filter(t => t.isFocusQuestItem);
  const completedQuestCount = questTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner / Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-purple-950/70 via-navy-850 to-slate-900/90 border border-purple-500/25 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Student AI Planner</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Plan smarter. Feel better. Take it one step at a time.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Your workload changes every day. Your plan should too. MindMate balances focus sessions, short breaks, and priority tasks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <button
              onClick={() => setOpenAddTaskModal(true)}
              className="p-3 rounded-2xl bg-gradient-to-b from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 active:scale-95 border border-purple-400/30"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add Task</span>
            </button>

            <button
              onClick={() => setCurrentView('smart-plan')}
              className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-purple-300 font-bold text-xs border border-purple-500/30 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              <span>🧠 Smart Plan</span>
            </button>

            <button
              onClick={() => setCurrentView('overwhelmed')}
              className="p-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-bold text-xs border border-rose-500/40 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-950/40"
            >
              <LifeBuoy className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>🆘 Overwhelmed</span>
            </button>

            <button
              onClick={() => setCurrentView('deadline-rescue')}
              className="p-3 rounded-2xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 font-bold text-xs border border-amber-500/40 flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-950/40"
            >
              <AlarmClock className="w-5 h-5 text-amber-400" />
              <span>🚨 Rescue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: Battery + Today's Progress + Daily Goal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Student Battery */}
        <div 
          onClick={() => setOpenCheckInModal(true)}
          className="glass-panel glass-panel-hover p-5 rounded-3xl cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Student Battery</span>
            </div>
            <span className="text-xs text-purple-400 group-hover:underline font-medium">Recalibrate ⚡</span>
          </div>

          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              🔋 {studentBattery.percentage}%
            </span>
            <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 ${studentBattery.tone}`}>
              {studentBattery.label}
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden mb-2.5">
            <div 
              className={`h-full transition-all duration-700 rounded-full ${
                studentBattery.percentage >= 70 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' :
                studentBattery.percentage >= 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                'bg-gradient-to-r from-rose-500 to-pink-500'
              }`}
              style={{ width: `${studentBattery.percentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {studentBattery.description} <span className="text-[10px] text-slate-400 block mt-0.5">(Wellness indicator, not a medical measurement)</span>
          </p>
        </div>

        {/* Today's Progress */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Today's Progress</span>
            </div>
            <span className="text-xs font-extrabold text-cyan-300">{completionPercentage}%</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {completedTasks} <span className="text-lg text-slate-400 font-normal">/ {totalTasks} tasks</span>
              </span>
              <span className="text-xs text-slate-400">
                {totalTasks - completedTasks} remaining
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            {completedTasks >= 3 ? '🌟 Great rhythm! Keep taking mindful breaks.' : '🎯 Target completing 3 priority tasks for today.'}
          </p>
        </div>

        {/* Daily Goal Card */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Today's Goal</span>
            </div>
            <span className="text-xs font-bold text-amber-400">🎯 Daily Target</span>
          </div>

          <div className="my-2 space-y-1">
            <p className="text-sm font-bold text-slate-100">Complete 3 priority tasks</p>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map(idx => (
                  <div 
                    key={idx}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      completedTasks >= idx 
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {completedTasks >= idx ? '✓' : idx}
                  </div>
                ))}
              </div>
              <span className="text-xs font-extrabold text-amber-300 ml-2">
                {Math.min(3, completedTasks)} / 3
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Focus Streak:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {user.focusStreak} days active
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Smart Plan (Timeline) + Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Plan Timeline */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Today's Smart Plan</h3>
                <p className="text-xs text-slate-400">Dynamic timeline adapted to your energy</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('smart-plan')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>Customize Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {smartPlanSlots.map(slot => {
              const isBreak = slot.type === 'break';
              const isQuickWin = slot.type === 'quick_win';
              return (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    slot.completed
                      ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
                      : isBreak
                        ? 'bg-slate-900/60 border-slate-800/90 text-slate-300'
                        : isQuickWin
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                          : 'bg-purple-950/20 border-purple-500/25 text-white hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20 shrink-0">
                      {slot.time}
                    </span>

                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold truncate flex items-center gap-1.5 ${slot.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        <span>{slot.icon || (isBreak ? '☕' : '📚')}</span>
                        <span>{slot.title}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {slot.durationMinutes} min • {slot.description || (isBreak ? 'Consolidate memory' : 'Focused study sprint')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    {!isBreak && !slot.completed && (
                      <button
                        onClick={() => startFocusTimer(slot.title, slot.durationMinutes)}
                        className="p-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all text-xs flex items-center space-x-1"
                        title="Start Pomodoro focus timer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline text-[10px] font-bold">Focus</span>
                      </button>
                    )}

                    <button
                      onClick={() => togglePlanSlotComplete(slot.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        slot.completed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-slate-700 text-slate-400 hover:border-purple-400 hover:text-purple-300'
                      }`}
                      title={slot.completed ? 'Mark incomplete' : 'Mark done'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quest + Priorities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Focus Quest */}
          <div className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-navy-900 to-purple-950/40 border border-purple-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎮</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Today's Focus Quest</h4>
                  <p className="text-[11px] text-purple-300">Complete 3 priority tasks</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                +30 XP
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {questTasks.slice(0, 3).map(qt => (
                <div
                  key={qt.id}
                  onClick={() => toggleTaskComplete(qt.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs ${
                    qt.completed 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through' 
                      : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {qt.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{qt.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{qt.durationMinutes}m</span>
                </div>
              ))}
            </div>

            {focusQuestCompleted ? (
              <button
                onClick={claimFocusQuestReward}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-1.5 transition-all hover:scale-102"
              >
                <span>🎉 Quest Complete! Claim +30 Points</span>
              </button>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Progress: {completedQuestCount} / 3 finished</span>
                <span className="text-purple-300 font-semibold">Streak: {user.focusStreak} days</span>
              </div>
            )}
          </div>

          {/* Priority Tasks */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-base">📋</span>
                <h4 className="text-sm font-bold text-white">Priority Tasks</h4>
              </div>
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs text-purple-400 hover:underline font-semibold"
              >
                View All ({tasks.length})
              </button>
            </div>

            {urgentTasks.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <span>🔴 Urgent</span>
                  <span className="text-slate-400">({urgentTasks.length})</span>
                </span>
                {urgentTasks.slice(0, 2).map(t => (
                  <div 
                    key={t.id}
                    className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <button 
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-slate-400 hover:text-emerald-400"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-slate-100 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] text-rose-300 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 shrink-0 ml-1">
                      {t.deadline}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {upcomingTasks.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span>🟡 Upcoming</span>
                  <span className="text-slate-400">({upcomingTasks.length})</span>
                </span>
                {upcomingTasks.slice(0, 2).map(t => (
                  <div 
                    key={t.id}
                    className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <button 
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-slate-400 hover:text-emerald-400"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-slate-100 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">{t.deadline}</span>
                  </div>
                ))}
              </div>
            )}

            {quickWinTasks.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span>🟢 Quick Wins</span>
                  <span className="text-slate-400">({quickWinTasks.length})</span>
                </span>
                {quickWinTasks.slice(0, 2).map(t => (
                  <div 
                    key={t.id}
                    className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <button 
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-slate-400 hover:text-emerald-400"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-slate-100 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold shrink-0 ml-1">{t.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};