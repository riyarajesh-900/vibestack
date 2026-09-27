import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/soundEffects';
import { 
  LifeBuoy, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Wind,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface StepItem {
  id: number;
  title: string;
  durationMinutes: number;
  desc: string;
  completed: boolean;
}

export const OverwhelmedView: React.FC = () => {
  const { setCurrentView, startFocusTimer, showToast, user } = useApp();

  const [selectedReason, setSelectedReason] = useState<string>('everything');
  const [ambientSound, setAmbientSound] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Dynamic step generator based on selected root cause
  const getStepsForReason = (reason: string): StepItem[] => {
    switch (reason) {
      case 'studying':
        return [
          { id: 1, title: 'Pick just 1 single topic and close all other tabs', durationMinutes: 2, desc: 'Reduce visual clutter on your screen', completed: false },
          { id: 2, title: 'Read the first 3 pages / solve Question 1 only', durationMinutes: 15, desc: 'Focus strictly on this micro-milestone', completed: false },
          { id: 3, title: 'Take a 5-minute mindful stretch & water break', durationMinutes: 5, desc: 'Consolidate and reset your nervous system', completed: false }
        ];
      case 'deadlines':
        return [
          { id: 1, title: 'Open your closest deadline assignment (e.g. DBMS)', durationMinutes: 2, desc: 'Just look at the file, nothing else', completed: false },
          { id: 2, title: 'Complete Question 1 only', durationMinutes: 15, desc: 'Momentum starts with single problems', completed: false },
          { id: 3, title: 'Take a 5-minute breather without looking at deadlines', durationMinutes: 5, desc: 'Lower cortisol and recharge', completed: false }
        ];
      case 'stressed':
        return [
          { id: 1, title: 'Take 4 deep slow box-breaths (Inhale 4s, Exhale 4s)', durationMinutes: 2, desc: 'Calm the amygdala stress response', completed: false },
          { id: 2, title: 'Review 1 simple lecture summary page', durationMinutes: 10, desc: 'Easy low-friction entry point', completed: false },
          { id: 3, title: 'Step away from screen and drink a glass of water', durationMinutes: 5, desc: 'Ground yourself in the physical space', completed: false }
        ];
      case 'energy':
        return [
          { id: 1, title: 'Complete a 5-minute quick win (e.g. submit attendance form)', durationMinutes: 5, desc: 'Build effortless dopamine with a tiny task', completed: false },
          { id: 2, title: 'Read through 1 set of flashcards / summary notes', durationMinutes: 15, desc: 'Low effort passive review', completed: false },
          { id: 3, title: 'Rest your eyes for 5 minutes with calming audio', durationMinutes: 5, desc: 'Recharge cognitive stamina', completed: false }
        ];
      default: // 'everything'
        return [
          { id: 1, title: 'Open your DBMS assignment file', durationMinutes: 2, desc: 'No pressure to solve yet—just open the document', completed: false },
          { id: 2, title: 'Complete Question 1', durationMinutes: 15, desc: 'One single problem at a time', completed: false },
          { id: 3, title: 'Take a 5-minute break', durationMinutes: 5, desc: 'Step back, celebrate the first step', completed: false }
        ];
    }
  };

  const [steps, setSteps] = useState<StepItem[]>(() => getStepsForReason('everything'));

  const handleSelectReason = (key: string) => {
    setSelectedReason(key);
    setSteps(getStepsForReason(key));
    setActiveStepIdx(0);
  };

  const toggleAmbient = () => {
    const next = !ambientSound;
    setAmbientSound(next);
    soundFx.toggleAmbient(next);
  };

  const markStepDone = (idx: number) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, completed: true } : s));
    if (user.soundEnabled) soundFx.playSuccess();
    showToast(`Step ${idx + 1} finished! That's real progress 👏`, 'success');
    if (idx < steps.length - 1) {
      setActiveStepIdx(idx + 1);
    }
  };

  const reasons = [
    { key: 'studying', icon: '📚', label: 'Too much studying', sub: 'Massive syllabus' },
    { key: 'deadlines', icon: '⏰', label: 'Too many deadlines', sub: 'Impending due dates' },
    { key: 'stressed', icon: '😰', label: 'Feeling stressed', sub: 'High tension / worry' },
    { key: 'energy', icon: '😴', label: 'Low energy', sub: 'Mental fatigue' },
    { key: 'everything', icon: '🤯', label: 'Everything feels overwhelming', sub: 'Need to reset' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Calm Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (ambientSound) {
              soundFx.toggleAmbient(false);
              setAmbientSound(false);
            }
            setCurrentView('dashboard');
          }}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 flex items-center space-x-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Ambient Calm Audio Button */}
        <button
          onClick={toggleAmbient}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
            ambientSound 
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-900/30' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {ambientSound ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span>{ambientSound ? 'Calming Rain: On' : 'Play Calming Rain Audio'}</span>
        </button>
      </div>

      {/* Hero Calming Card */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-b from-indigo-950/60 via-navy-950 to-slate-950 border border-indigo-500/25 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-xl shadow-indigo-950/50 animate-breathing">
          <Wind className="w-8 h-8" />
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            It's okay. Let's make this smaller.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            You don't have to finish everything right now. When everything feels heavy, we only focus on the very next tiny step.
          </p>
        </div>

        {/* Reason Selector */}
        <div className="pt-3 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
            What's making today feel difficult?
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {reasons.map(r => (
              <button
                key={r.key}
                onClick={() => handleSelectReason(r.key)}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                  selectedReason === r.key
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-900/40 scale-105'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Your Next 3 Steps Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Your Next 3 Steps</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gentle Pacing
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ignore everything else. Complete these in order.</p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isCurrent = idx === activeStepIdx;
            return (
              <div
                key={step.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  step.completed
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : isCurrent
                      ? 'bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border-purple-400/60 shadow-xl shadow-purple-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-start space-x-4 min-w-0">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                    step.completed
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.completed ? '✓' : step.id}
                  </div>

                  <div className="space-y-0.5">
                    <p className={`text-sm sm:text-base font-bold ${step.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end sm:self-center shrink-0">
                  <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-xl border border-cyan-800/40">
                    ⏱ {step.durationMinutes} min
                  </span>

                  {!step.completed && (
                    <>
                      <button
                        onClick={() => startFocusTimer(step.title, step.durationMinutes)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center space-x-1"
                        title="Start timer for this step"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Timer</span>
                      </button>

                      <button
                        onClick={() => markStepDone(idx)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational reassurance banner */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center space-y-1">
          <p className="text-xs font-bold text-indigo-200">
            "You don't have to finish everything right now. Just start with step 1."
          </p>
          <p className="text-[11px] text-slate-400">
            Progress is made in 15-minute increments, not 8-hour marathon panics.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              if (ambientSound) soundFx.toggleAmbient(false);
              setCurrentView('dashboard');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => {
              const currentStep = steps[activeStepIdx] || steps[0];
              startFocusTimer(currentStep.title, currentStep.durationMinutes);
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-900/40 flex items-center justify-center space-x-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Step {activeStepIdx + 1} ({steps[activeStepIdx]?.durationMinutes || 2} min)</span>
          </button>
        </div>
      </div>
    </div>
  );
};