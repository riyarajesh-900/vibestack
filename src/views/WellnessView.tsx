import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Smile, 
  Wind, 
  CheckCircle2, 
  Clock, 
  Info,
  ShieldCheck,
  Play,
  Pause
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

export const WellnessView: React.FC = () => {
  const { moodEntries, addMoodEntry, showToast } = useApp();

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Box breathing timer loop
  useEffect(() => {
    let timer: any;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            setBreathingPhase(curr => {
              if (curr === 'Inhale') return 'Hold';
              if (curr === 'Hold') return 'Exhale';
              if (curr === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  const handleLogMood = (score: number, label: string) => {
    setSelectedMood(score);
    const stressScore = score <= 2 ? 4 : score === 3 ? 2 : 1;
    addMoodEntry(score, stressScore, `Logged mood: ${label}`);
    showToast(`Logged mood: ${label} ðŸ˜Š`, 'success');
  };

  const chartData = moodEntries.map(e => ({
    name: e.date,
    Tasks: e.tasksCompleted,
    MoodScore: e.moodScore,
    StressLevel: e.stressScore,
    FocusHours: Math.round(e.focusMinutes / 60 * 10) / 10
  }));

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          <span>Student Wellness & Balance</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Mental Clarity & Habit Reflections
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Tracking your stamina and stress trends allows MindMate to build balanced, sustainable study routines.
        </p>
      </div>

      {/* Mood Check-in Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">ðŸ˜Š</span>
            <h3 className="text-base font-bold text-white">How are you feeling right now?</h3>
          </div>
          <span className="text-xs text-slate-400">Daily Reflection</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { score: 5, label: 'Great', icon: 'ðŸ˜Š', desc: 'Energized & ready' },
            { score: 4, label: 'Good', icon: 'ðŸ™‚', desc: 'Positive & focused' },
            { score: 3, label: 'Okay', icon: 'ðŸ˜', desc: 'Normal baseline' },
            { score: 2, label: 'Low', icon: 'ðŸ˜”', desc: 'Need gentle pace' },
            { score: 1, label: 'Stressed', icon: 'ðŸ˜£', desc: 'High mental load' },
          ].map(m => (
            <button
              key={m.score}
              onClick={() => handleLogMood(m.score, m.label)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                selectedMood === m.score
                  ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-900/40 scale-105'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-3xl mb-1">{m.icon}</div>
              <div className="text-xs font-extrabold text-white">{m.label}</div>
              <div className="text-[10px] text-slate-400">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 1-Minute Box Breathing Circle & Weekly Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Overview (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Your Week at a Glance</h3>
              <p className="text-xs text-slate-400">Completed Tasks vs. Stress Trends</p>
            </div>
            <span className="text-xs font-bold text-purple-300">7-Day History</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="Tasks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#taskGrad)" name="Tasks Done" />
                <Area type="monotone" dataKey="StressLevel" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#stressGrad)" name="Stress Level (1-5)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Productivity Observation Insight */}
          <div className="p-4 rounded-2xl bg-purple-950/25 border border-purple-500/20 flex items-start space-x-3 text-xs">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Productivity Observation:</p>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                "You completed 40% more tasks on days when you took regular 5-minute movement breaks between study blocks."
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                (Productivity observation based on your completed sessions, not a medical conclusion.)
              </p>
            </div>
          </div>
        </div>

        {/* 1-Minute Box Breathing Circle (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl flex flex-col justify-between text-center space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center space-x-2 text-left">
              <span className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400">
                <Wind className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">1-Min Box Breathing</h4>
                <p className="text-[10px] text-slate-400">Calm the nervous system</p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-300">4-4-4-4</span>
          </div>

          {/* Animated Circle */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            <div className={`w-36 h-36 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${
              isBreathingActive 
                ? breathingPhase === 'Inhale' 
                  ? 'scale-125 bg-purple-600/30 border-purple-400 shadow-2xl shadow-purple-600/50' 
                  : breathingPhase === 'Hold' 
                    ? 'scale-125 bg-cyan-600/30 border-cyan-400 shadow-2xl shadow-cyan-600/50'
                    : breathingPhase === 'Exhale'
                      ? 'scale-90 bg-indigo-600/30 border-indigo-400'
                      : 'scale-90 bg-slate-800 border-slate-700'
                : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="text-center space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                  {isBreathingActive ? breathingPhase : 'Ready'}
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  {isBreathingActive ? breathCount : '4s'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-300">
              {isBreathingActive 
                ? `${breathingPhase} for ${breathCount} seconds...` 
                : 'Click below for a quick guided 4-second breathing reset.'}
            </p>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 flex items-center justify-center space-x-2"
            >
              {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isBreathingActive ? 'Stop Exercise' : 'Start 1-Min Reset'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};