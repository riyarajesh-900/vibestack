import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EnergyLevel, StressLevel, AvailableTime } from '../types';
import { Sparkles, ArrowRight, Check, Zap, Clock, Compass } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { user, updateUser, setEnergy, setStress, setAvailableTime, regeneratePlan, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('okay');
  const [selectedStress, setSelectedStress] = useState<StressLevel>('moderate');
  const [selectedTime, setSelectedTime] = useState<AvailableTime>('3h');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>(['Academics', 'Projects', 'Better habits']);

  if (user.onboardingCompleted) return null;

  const handleFinish = () => {
    setEnergy(selectedEnergy);
    setStress(selectedStress);
    setAvailableTime(selectedTime);
    updateUser({
      onboardingCompleted: true,
      onboardingSelections: {
        energy: selectedEnergy,
        stress: selectedStress,
        time: selectedTime,
        focusAreas: selectedFocusAreas,
      }
    });
    regeneratePlan(selectedEnergy, selectedStress, selectedTime);
    showToast('Welcome to MindMate! Your adaptive plan is ready 🚀', 'success');
  };

  const toggleFocusArea = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-purple-500' : s < step ? 'w-4 bg-purple-700' : 'w-4 bg-slate-800'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">Step {step} of 4</span>
        </div>

        {step === 1 && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to MindMate 👋
              </h2>
              <p className="text-sm sm:text-base text-purple-300 font-medium">
                "Plan smarter. Feel better. Take it one step at a time."
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your day doesn't have to feel overwhelming. MindMate dynamically adapts your daily plan to your workload, available time, energy, and stress level.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 flex items-center justify-center space-x-2 mx-auto transition-transform hover:scale-105 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 py-2">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                How are you feeling today?
              </h3>
              <p className="text-xs text-slate-400">
                MindMate uses this to calibrate session lengths, difficulty pacing, and breaks.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Energy Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'low', label: 'Low', icon: '😴', desc: 'Need gentle pacing' },
                  { key: 'okay', label: 'Okay', icon: '😐', desc: 'Moderate stamina' },
                  { key: 'good', label: 'Good', icon: '🙂', desc: 'Steady focus' },
                  { key: 'high', label: 'High', icon: '⚡', desc: 'Ready for deep work' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedEnergy(item.key as EnergyLevel)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedEnergy === item.key
                        ? 'bg-purple-600/25 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Stress Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'calm', label: 'Calm', icon: '😌', desc: 'Relaxed & centered' },
                  { key: 'moderate', label: 'Moderate', icon: '😐', desc: 'Normal workload' },
                  { key: 'stressed', label: 'Stressed', icon: '😰', desc: 'Feeling pressed' },
                  { key: 'very_stressed', label: 'Overwhelmed', icon: '🤯', desc: 'Need micro-steps' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedStress(item.key as StressLevel)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedStress === item.key
                        ? 'bg-purple-600/25 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 py-2">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                How much time do you have today?
              </h3>
              <p className="text-xs text-slate-400">
                We will schedule only what realistically fits into your time window.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
              {[
                { key: '1h', label: '1 hour', desc: 'Quick sprint' },
                { key: '2h', label: '2 hours', desc: 'Balanced focus' },
                { key: '3h', label: '3 hours', desc: 'Standard study' },
                { key: '4h', label: '4+ hours', desc: 'Extended work' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setSelectedTime(item.key as AvailableTime)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    selectedTime === item.key
                      ? 'bg-gradient-to-b from-purple-600/30 to-indigo-600/30 border-purple-400 text-white shadow-xl shadow-purple-900/30 scale-105'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg font-extrabold text-white mb-1">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 py-2">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                What are you working toward?
              </h3>
              <p className="text-xs text-slate-400">
                Select your focus goals to tailor your daily quests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-2">
              {[
                { name: 'Academics', icon: '📚', label: 'Academics & Exam Revision' },
                { name: 'Personal', icon: '🎯', label: 'Personal Goals & Mastery' },
                { name: 'Projects', icon: '💻', label: 'Projects & Coding Practice' },
                { name: 'Routine', icon: '🏃', label: 'Healthy Routine & Breaks' },
                { name: 'Habits', icon: '🔄', label: 'Better Daily Study Habits' },
              ].map(area => {
                const isSelected = selectedFocusAreas.includes(area.name);
                return (
                  <button
                    key={area.name}
                    onClick={() => toggleFocusArea(area.name)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-purple-600/25 border-purple-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{area.icon}</span>
                      <span className="text-xs font-semibold">{area.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                onClick={() => setStep(3)}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center space-x-2 shadow-xl shadow-purple-900/40 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create My Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};