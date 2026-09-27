import React from 'react';
import { useApp } from '../context/AppContext';
import { EnergyLevel, StressLevel, AvailableTime } from '../types';
import { 
  BrainCircuit, 
  Zap, 
  Heart, 
  Clock, 
  RotateCcw, 
  Play, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Coffee, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const SmartPlanView: React.FC = () => {
  const { 
    energy, 
    setEnergy, 
    stress, 
    setStress, 
    availableTime, 
    setAvailableTime, 
    smartPlanSlots, 
    smartPlanMeta, 
    regeneratePlan, 
    togglePlanSlotComplete,
    startFocusTimer,
    setCurrentView
  } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Core Adaptive Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Energy-Adaptive Smart Plan
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Your plan adapts to how you feel today. When energy is low, sessions are shorter with quick wins. When stamina is high, deep focus blocks are prioritized.
        </p>
      </div>

      {/* Interactive Controls Bar: Energy + Stress + Time */}
      <div className="glass-panel p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Live Schedule Calibration
          </span>
          <button
            onClick={() => regeneratePlan()}
            className="px-4 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Energy selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Current Energy</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: 'low', label: 'Low', icon: '😴' },
                { key: 'okay', label: 'Okay', icon: '😐' },
                { key: 'good', label: 'Good', icon: '🙂' },
                { key: 'high', label: 'High', icon: '⚡' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setEnergy(item.key as EnergyLevel)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    energy === item.key
                      ? 'bg-purple-600/30 border-purple-400 text-white font-bold shadow-md shadow-purple-900/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-[10px] mt-0.5">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stress selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Stress / Workload Pressure</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: 'calm', label: 'Calm', icon: '😌' },
                { key: 'moderate', label: 'Mod', icon: '😐' },
                { key: 'stressed', label: 'Stress', icon: '😰' },
                { key: 'very_stressed', label: 'High', icon: '🤯' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setStress(item.key as StressLevel)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    stress === item.key
                      ? 'bg-purple-600/30 border-purple-400 text-white font-bold shadow-md shadow-purple-900/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-[10px] mt-0.5">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Available time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Available Time Today</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['1h', '2h', '3h', '4h'].map(t => (
                <button
                  key={t}
                  onClick={() => setAvailableTime(t as AvailableTime)}
                  className={`py-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    availableTime === t
                      ? 'bg-gradient-to-b from-purple-600/30 to-indigo-600/30 border-purple-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-extrabold">{t}</div>
                  <div className="text-[9px] text-slate-400">{t === '1h' ? 'Sprint' : t === '2h' ? 'Balanced' : t === '3h' ? 'Deep' : 'Extended'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy explanation banner */}
        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-2">
                <span>Active Strategy:</span>
                <span className="text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 font-extrabold text-[11px]">
                  {smartPlanMeta.strategyName}
                </span>
              </p>
              <p className="text-slate-300 mt-0.5">{smartPlanMeta.strategyDescription}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 text-slate-300">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-semibold text-slate-200">
              📚 {smartPlanMeta.totalStudyMinutes}m Focus
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-semibold text-purple-300">
              ☕ {smartPlanMeta.totalBreakMinutes}m Rest
            </span>
          </div>
        </div>
      </div>

      {/* Generated Schedule Timeline */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Your MindMate Plan</h3>
            <p className="text-xs text-slate-400">Step-by-step paced roadmap for today</p>
          </div>
          <span className="text-xs text-slate-400">
            Generated at {smartPlanMeta.generatedAt}
          </span>
        </div>

        <div className="space-y-3">
          {smartPlanSlots.map((slot, index) => {
            const isBreak = slot.type === 'break';
            const isQuickWin = slot.type === 'quick_win';
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  slot.completed
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : isBreak
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                      : isQuickWin
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-white shadow-sm'
                        : 'bg-purple-950/20 border-purple-500/25 text-white hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20">
                      {slot.time}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">Step {index + 1}</span>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <p className={`text-sm font-bold truncate flex items-center gap-2 ${slot.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      <span className="text-base">{slot.icon || (isBreak ? '☕' : '📚')}</span>
                      <span>{slot.title}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {slot.durationMinutes} min session • {slot.description || (isBreak ? 'Step away from screen' : 'Focused study sprint')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  {!isBreak && !slot.completed && (
                    <button
                      onClick={() => startFocusTimer(slot.title, slot.durationMinutes)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Focus Sprint</span>
                    </button>
                  )}

                  <button
                    onClick={() => togglePlanSlotComplete(slot.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1 ${
                      slot.completed
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'border-slate-700 text-slate-300 hover:border-purple-400 hover:text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{slot.completed ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 flex justify-between items-center border-t border-slate-800">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => regeneratePlan()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Regenerate Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};