import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BrainCircuit, 
  LifeBuoy, 
  AlarmClock, 
  Target, 
  Heart, 
  Settings, 
  Zap, 
  Sparkles,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, studentBattery, user } = useApp();

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'tasks', label: 'My Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'smart-plan', label: 'Smart Plan', icon: <BrainCircuit className="w-5 h-5 text-purple-400" />, badge: 'Adaptive' },
    { id: 'overwhelmed', label: "I'm Overwhelmed", icon: <LifeBuoy className="w-5 h-5 text-rose-400" />, isSpecial: true },
    { id: 'deadline-rescue', label: 'Deadline Rescue', icon: <AlarmClock className="w-5 h-5 text-amber-400" /> },
    { id: 'goals-habits', label: 'Goals & Habits', icon: <Target className="w-5 h-5 text-cyan-400" /> },
    { id: 'wellness', label: 'Wellness', icon: <Heart className="w-5 h-5 text-emerald-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-navy-950/90 border-r border-purple-500/15 backdrop-blur-2xl p-4 shrink-0 select-none min-h-screen">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center space-x-3 px-3 py-3 rounded-2xl cursor-pointer hover:bg-purple-900/15 transition-all group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xl font-black tracking-tight text-white">Mind<span className="text-purple-400">Mate</span></span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block leading-none">Smart Student Companion</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="mt-6 flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>

        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm shadow-purple-900/20' 
                  : item.isSpecial
                    ? 'text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span className={isActive ? 'font-semibold text-white' : ''}>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
              {item.isSpecial && (
                <span className="text-xs animate-pulse">🆘</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Battery Card */}
      <div className="mt-auto pt-4">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/40 border border-purple-500/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-200">Student Battery</span>
            </div>
            <span className="text-xs font-extrabold text-purple-300">{studentBattery.percentage}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
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
            {studentBattery.description}
          </p>
        </div>

        {/* User Card */}
        <div className="mt-3 flex items-center justify-between px-2 py-1.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-7 h-7 rounded-full bg-purple-700/50 border border-purple-400/40 flex items-center justify-center text-white font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-slate-200 font-semibold text-xs leading-none truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-1 truncate">{user.major}</p>
            </div>
          </div>
          <Award className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
        </div>
      </div>
    </aside>
  );
};