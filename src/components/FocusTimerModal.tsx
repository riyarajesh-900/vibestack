import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/soundEffects';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export const FocusTimerModal: React.FC = () => {
  const { activeFocusTimer, closeFocusTimer, showToast, user } = useApp();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);

  useEffect(() => {
    if (activeFocusTimer) {
      setSecondsLeft(activeFocusTimer.initialMinutes * 60);
      setIsActive(true);
      if (user.soundEnabled) soundFx.playClick();
    }
  }, [activeFocusTimer, user.soundEnabled]);

  useEffect(() => {
    let interval: any;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (user.soundEnabled) soundFx.playBell();
      showToast('ðŸŽ‰ Focus session completed! Great job taking it step-by-step.', 'success');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, user.soundEnabled]);

  const toggleAmbient = () => {
    const next = !ambientAudio;
    setAmbientAudio(next);
    soundFx.toggleAmbient(next);
  };

  const handleClose = () => {
    if (ambientAudio) {
      soundFx.toggleAmbient(false);
      setAmbientAudio(false);
    }
    closeFocusTimer();
  };

  if (!activeFocusTimer) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const totalSeconds = activeFocusTimer.initialMinutes * 60;
  const progressPct = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl text-center space-y-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
            Focus Sprint Mode
          </span>
          <h3 className="text-base font-bold text-white mt-2 truncate px-4">
            {activeFocusTimer.title}
          </h3>
        </div>

        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              className="text-slate-800 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              className="text-purple-500 stroke-current transition-all duration-500 ease-linear"
              strokeWidth="10"
              strokeDasharray={477}
              strokeDashoffset={477 - (477 * progressPct) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-[11px] text-purple-300 font-medium mt-1">
              {isActive ? 'In the flow...' : 'Paused'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setSecondsLeft(activeFocusTimer.initialMinutes * 60)}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center space-x-2"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={toggleAmbient}
            className={`p-3 rounded-2xl border transition-colors ${
              ambientAudio
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle calming rain sound"
          >
            {ambientAudio ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={() => {
            if (user.soundEnabled) soundFx.playSuccess();
            showToast(`Session "${activeFocusTimer.title}" marked complete! ðŸŽ‰`, 'success');
            handleClose();
          }}
          className="text-xs text-purple-300 hover:text-purple-200 underline font-medium"
        >
          Finish early and log session
        </button>
      </div>
    </div>
  );
};