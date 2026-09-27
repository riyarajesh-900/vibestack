import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EnergyLevel, StressLevel, AvailableTime } from '../types';
import { X, Zap } from 'lucide-react';

export const QuickCheckInModal: React.FC = () => {
  const { 
    openCheckInModal, 
    setOpenCheckInModal, 
    energy, 
    setEnergy, 
    stress, 
    setStress, 
    availableTime, 
    setAvailableTime, 
    studentBattery,
    addMoodEntry,
    showToast 
  } = useApp();

  const [localEnergy, setLocalEnergy] = useState<EnergyLevel>(energy);
  const [localStress, setLocalStress] = useState<StressLevel>(stress);
  const [localTime, setLocalTime] = useState<AvailableTime>(availableTime);

  if (!openCheckInModal) return null;

  const handleSave = () => {
    setEnergy(localEnergy);
    setStress(localStress);
    setAvailableTime(localTime);
    
    const energyVal = localEnergy === 'high' ? 5 : localEnergy === 'good' ? 4 : localEnergy === 'okay' ? 3 : 2;
    const stressVal = localStress === 'calm' ? 1 : localStress === 'moderate' ? 2 : localStress === 'stressed' ? 4 : 5;
    addMoodEntry(energyVal, stressVal, 'Updated mid-day check-in');
    
    setOpenCheckInModal(false);
    showToast('Check-in saved! Student Battery & Smart Plan recalibrated 🔋', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daily Wellness Check-In</h3>
              <p className="text-xs text-slate-400">Recalibrate your schedule & battery</p>
            </div>
          </div>
          <button
            onClick={() => setOpenCheckInModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Energy Level</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'low', label: 'Low', icon: '😴' },
              { key: 'okay', label: 'Okay', icon: '😐' },
              { key: 'good', label: 'Good', icon: '🙂' },
              { key: 'high', label: 'High', icon: '⚡' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setLocalEnergy(item.key as EnergyLevel)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  localEnergy === item.key
                    ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                <div className="text-[11px] mt-0.5">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Stress Level</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'calm', label: 'Calm', icon: '😌' },
              { key: 'moderate', label: 'Moderate', icon: '😐' },
              { key: 'stressed', label: 'Stressed', icon: '😰' },
              { key: 'very_stressed', label: 'High', icon: '🤯' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setLocalStress(item.key as StressLevel)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  localStress === item.key
                    ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                <div className="text-[11px] mt-0.5">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Available Study Time</label>
          <div className="grid grid-cols-4 gap-2">
            {['1h', '2h', '3h', '4h'].map(t => (
              <button
                key={t}
                onClick={() => setLocalTime(t as AvailableTime)}
                className={`py-2 rounded-xl border text-center text-xs font-bold transition-all ${
                  localTime === t
                    ? 'bg-purple-600/30 border-purple-400 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {t === '4h' ? '4+ hrs' : `${t.replace('h', '')} hr${t === '1h' ? '' : 's'}`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-slate-300 flex items-center justify-between">
          <span>Student Battery Indicator:</span>
          <span className="font-extrabold text-purple-300">🔋 {studentBattery.percentage}% ({studentBattery.label})</span>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={() => setOpenCheckInModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30"
          >
            Apply & Recalibrate
          </button>
        </div>
      </div>
    </div>
  );
};