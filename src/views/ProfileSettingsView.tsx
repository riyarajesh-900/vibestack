import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  User, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Award,
  Flame,
  Check
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { user, updateUser, resetAllData, showToast, tasks, habits, goals } = useApp();

  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [studyHours, setStudyHours] = useState(user.dailyStudyGoalHours);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || 'Alex Rivera',
      major: major.trim() || 'Computer Science',
      dailyStudyGoalHours: Number(studyHours),
    });
    showToast('Profile preferences saved!', 'success');
  };

  const handleExportData = () => {
    const data = {
      user,
      tasks,
      habits,
      goals,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmate-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Data exported successfully! 📁', 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>Student Settings</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Profile & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Customize your academic details, daily study targets, audio cues, and prototype demo data.
        </p>
      </div>

      {/* Student Profile Form */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Student Information</h3>
          </div>
          <span className="text-xs font-semibold text-purple-300">Active Profile</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Degree</label>
              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Daily Target Study Hours: <span className="text-purple-300 font-bold">{studyHours} hrs</span>
            </label>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={studyHours}
              onChange={e => setStudyHours(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 hr (Sprint)</span>
              <span>3 hrs (Recommended)</span>
              <span>8 hrs (Max)</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audio & Feedback */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white border-b border-purple-500/15 pb-3">
          Audio & Haptic Feedback
        </h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-white">Synthesized Audio Cues</p>
            <p className="text-xs text-slate-400">Gentle chimes upon task completion & focus sprints</p>
          </div>

          <button
            onClick={() => updateUser({ soundEnabled: !user.soundEnabled })}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-all ${
              user.soundEnabled 
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/40' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{user.soundEnabled ? 'Enabled' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Demo Controls & Data Management */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Demo & Data Management</h3>
            <p className="text-xs text-slate-400">Quickly reset data for live presentation testing</p>
          </div>
          <span className="text-xs font-bold text-amber-400">Hackathon Prototype</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetAllData}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>Reset to Prepopulated Demo Data</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-5 py-3 rounded-2xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};