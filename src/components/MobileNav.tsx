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
  Heart 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const navs: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'smart-plan', label: 'Plan', icon: <BrainCircuit className="w-5 h-5" /> },
    { id: 'overwhelmed', label: 'Help', icon: <LifeBuoy className="w-5 h-5 text-rose-400" /> },
    { id: 'deadline-rescue', label: 'Rescue', icon: <AlarmClock className="w-5 h-5" /> },
    { id: 'wellness', label: 'Wellness', icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 border-t border-purple-500/20 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
      {navs.map(item => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive 
                ? 'text-purple-400 font-bold scale-105' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-purple-600/20 border border-purple-500/40' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};