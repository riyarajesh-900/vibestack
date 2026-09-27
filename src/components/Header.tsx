import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Battery, 
  BatteryCharging, 
  Sparkles, 
  Plus, 
  Volume2, 
  VolumeX, 
  Activity, 
  Flame, 
  HeartHandshake
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    user, 
    updateUser, 
    studentBattery, 
    setOpenCheckInModal, 
    setOpenAddTaskModal, 
    setCurrentView,
    currentView 
  } = useApp();

  const getEnergyColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (pct >= 60) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (pct >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-purple-500/15 bg-navy-900/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Greeting & Tagline */}
      <div className="flex items-center space-x-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{getGreeting()}, {user.name.split(' ')[0]}</span>
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Student Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Let's make today manageable. Take it one step at a time.
          </p>
        </div>
      </div>

      {/* Right: Quick Checkin, Battery Pill, Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Focus Streak Counter */}
        <button 
          onClick={() => setCurrentView('goals-habits')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
          title="Focus Streak"
        >
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span>{user.focusStreak}d streak</span>
          <span className="text-[10px] text-amber-300/80 ml-1">({user.focusPoints} XP)</span>
        </button>

        {/* Student Battery Widget */}
        <button
          onClick={() => setOpenCheckInModal(true)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm ${getEnergyColor(studentBattery.percentage)}`}
          title="Click to update your Energy & Stress check-in"
        >
          <div className="relative flex items-center">
            {studentBattery.percentage >= 60 ? (
              <BatteryCharging className="w-4 h-4" />
            ) : (
              <Battery className="w-4 h-4" />
            )}
          </div>
          <span className="font-bold">{studentBattery.percentage}%</span>
          <span className="hidden md:inline-block font-medium border-l border-current/30 pl-2">
            {studentBattery.label}
          </span>
          <Activity className="w-3 h-3 opacity-60 ml-0.5" />
        </button>

        {/* Overwhelmed shortcut button if not currently in that view */}
        {currentView !== 'overwhelmed' && (
          <button
            onClick={() => setCurrentView('overwhelmed')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all shadow-sm"
          >
            <span className="text-xs">🆘</span>
            <span className="hidden lg:inline">Overwhelmed?</span>
          </button>
        )}

        {/* Sound toggle */}
        <button
          onClick={() => updateUser({ soundEnabled: !user.soundEnabled })}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-700/50"
          title={user.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {user.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Add Task Button */}
        <button
          onClick={() => setOpenAddTaskModal(true)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all hover:scale-105 active:scale-95 border border-purple-400/30"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};