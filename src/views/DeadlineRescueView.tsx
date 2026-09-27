import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlarmClock, 
  Sparkles, 
  Check, 
  Plus, 
  Clock, 
  Calendar, 
  Play, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface RescueChunk {
  id: string;
  dayLabel: 'Today' | 'Tomorrow' | 'Day Before Due';
  title: string;
  durationMinutes: number;
  type: 'work' | 'break' | 'review';
  completed: boolean;
}

export const DeadlineRescueView: React.FC = () => {
  const { addTask, startFocusTimer, showToast } = useApp();

  const [taskName, setTaskName] = useState('Data Structures Assignment');
  const [deadline, setDeadline] = useState('Tomorrow');
  const [numQuestions, setNumQuestions] = useState(8);
  const [estimatedHours, setEstimatedHours] = useState(3);

  // Initial generated plan based on prompt example
  const [planGenerated, setPlanGenerated] = useState(true);
  const [chunks, setChunks] = useState<RescueChunk[]>([
    { id: 'c-1', dayLabel: 'Today', title: 'Questions 1–2 (Foundation & Setup)', durationMinutes: 30, type: 'work', completed: true },
    { id: 'c-2', dayLabel: 'Today', title: 'Hydration & Mindful Break', durationMinutes: 5, type: 'break', completed: true },
    { id: 'c-3', dayLabel: 'Today', title: 'Questions 3–4 (Core Algorithms)', durationMinutes: 30, type: 'work', completed: false },
    { id: 'c-4', dayLabel: 'Tomorrow', title: 'Questions 5–6 (Edge Cases & Coding)', durationMinutes: 30, type: 'work', completed: false },
    { id: 'c-5', dayLabel: 'Tomorrow', title: 'Questions 7–8 (Complex Problems)', durationMinutes: 30, type: 'work', completed: false },
    { id: 'c-6', dayLabel: 'Tomorrow', title: 'Final Review & PDF Compilation', durationMinutes: 15, type: 'review', completed: false },
  ]);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const totalMins = estimatedHours * 60;
    const workChunkMins = 30;
    const countWorkBlocks = Math.max(2, Math.floor(totalMins / workChunkMins));
    const questionsPerBlock = Math.max(1, Math.ceil(numQuestions / countWorkBlocks));

    const generated: RescueChunk[] = [];
    let currentQ = 1;

    for (let i = 0; i < countWorkBlocks; i++) {
      const endQ = Math.min(numQuestions, currentQ + questionsPerBlock - 1);
      const isToday = i < Math.ceil(countWorkBlocks / 2);
      const dayLabel = isToday ? 'Today' : 'Tomorrow';

      generated.push({
        id: `chunk-${i}`,
        dayLabel,
        title: `Questions ${currentQ}–${endQ} (${taskName})`,
        durationMinutes: workChunkMins,
        type: 'work',
        completed: false
      });

      currentQ = endQ + 1;

      // Add break after work chunk
      if (i === 0 && isToday) {
        generated.push({
          id: `chunk-break-${i}`,
          dayLabel: 'Today',
          title: 'Short 5 min break',
          durationMinutes: 5,
          type: 'break',
          completed: false
        });
      }
    }

    // Final review chunk
    generated.push({
      id: `chunk-final-review`,
      dayLabel: 'Tomorrow',
      title: 'Final Review & Verification',
      durationMinutes: 15,
      type: 'review',
      completed: false
    });

    setChunks(generated);
    setPlanGenerated(true);
    showToast('🚨 Deadline Rescue Plan created! Workload distributed across days.', 'success');
  };

  const toggleChunkComplete = (id: string) => {
    setChunks(prev => prev.map(c => {
      if (c.id === id) {
        const next = !c.completed;
        if (next) showToast(`Completed session: ${c.title} 🎉`, 'success');
        return { ...c, completed: next };
      }
      return c;
    }));
  };

  const handleSaveToTasks = () => {
    addTask({
      title: `${taskName} [Rescue Plan]`,
      subject: 'Academic Rescue',
      priority: 'high',
      difficulty: 'hard',
      durationMinutes: estimatedHours * 60,
      deadline: deadline,
      subtasks: chunks.filter(c => c.type === 'work' || c.type === 'review').map(c => ({
        id: 'st-' + c.id,
        title: `${c.dayLabel}: ${c.title}`,
        completed: c.completed,
        durationMinutes: c.durationMinutes
      }))
    });
    showToast('Rescue plan added to your Tasks list! 📋', 'success');
  };

  const todayChunks = chunks.filter(c => c.dayLabel === 'Today');
  const tomorrowChunks = chunks.filter(c => c.dayLabel === 'Tomorrow');
  const completedCount = chunks.filter(c => c.completed).length;
  const progressPct = chunks.length > 0 ? Math.round((completedCount / chunks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <AlarmClock className="w-3.5 h-3.5" />
          <span>Crunch Time Deconstruction</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          🚨 Deadline Rescue
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Got a looming deadline? Input your assignment details below. MindMate will slice it into realistic 30-minute focus sprints across days so you don't have to pull an all-nighter.
        </p>
      </div>

      {/* Input Generator Form */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Task / Assignment
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="e.g. Data Structures Assignment"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deadline
              </label>
              <select
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Tomorrow">Tomorrow 🟡</option>
                <option value="Tonight 11:59 PM">Tonight 11:59 PM 🔴</option>
                <option value="In 2 days">In 2 days</option>
                <option value="In 3 days">In 3 days</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Number of Tasks / Questions
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Total Study Hours
              </label>
              <input
                type="number"
                min={1}
                max={20}
                step={0.5}
                value={estimatedHours}
                onChange={e => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-900/30 flex items-center space-x-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Rescue Plan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Rescue Plan Display */}
      {planGenerated && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/15 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🚨 Deadline Rescue Plan:</span>
                <span className="text-amber-300">{taskName}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {numQuestions} questions split into 30-minute structured intervals
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200">Rescue Progress: {progressPct}%</span>
                <div className="w-32 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveToTasks}
                className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Tasks</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>📅 Today</span>
                  <span className="text-slate-400">({todayChunks.length} blocks)</span>
                </span>
                <span className="text-[11px] text-slate-400">Day 1</span>
              </div>

              <div className="space-y-2.5">
                {todayChunks.map(chunk => (
                  <div
                    key={chunk.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      chunk.completed
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : chunk.type === 'break'
                          ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                          : 'bg-amber-950/20 border-amber-500/30 text-white hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shrink-0">
                        {chunk.durationMinutes}m
                      </span>
                      <div className="min-w-0">
                        <p className={`text-xs sm:text-sm font-bold truncate ${chunk.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {chunk.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {chunk.type === 'break' ? 'Rest eyes and stretch' : 'Targeted focus chunk'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      {!chunk.completed && chunk.type !== 'break' && (
                        <button
                          onClick={() => startFocusTimer(chunk.title, chunk.durationMinutes)}
                          className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Start timer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}

                      <button
                        onClick={() => toggleChunkComplete(chunk.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                          chunk.completed
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'border-slate-700 text-slate-300 hover:border-amber-400 hover:text-white'
                        }`}
                      >
                        {chunk.completed ? 'Done' : 'Mark'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tomorrow Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <span>📅 Tomorrow</span>
                  <span className="text-slate-400">({tomorrowChunks.length} blocks)</span>
                </span>
                <span className="text-[11px] text-slate-400">Day 2</span>
              </div>

              <div className="space-y-2.5">
                {tomorrowChunks.map(chunk => (
                  <div
                    key={chunk.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      chunk.completed
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : chunk.type === 'review'
                          ? 'bg-cyan-950/20 border-cyan-500/30 text-white'
                          : 'bg-purple-950/20 border-purple-500/30 text-white hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20 shrink-0">
                        {chunk.durationMinutes}m
                      </span>
                      <div className="min-w-0">
                        <p className={`text-xs sm:text-sm font-bold truncate ${chunk.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {chunk.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {chunk.type === 'review' ? 'Sanity check before submission' : 'Remaining problem set'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      {!chunk.completed && (
                        <button
                          onClick={() => startFocusTimer(chunk.title, chunk.durationMinutes)}
                          className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white transition-colors"
                          title="Start timer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}

                      <button
                        onClick={() => toggleChunkComplete(chunk.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                          chunk.completed
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'border-slate-700 text-slate-300 hover:border-purple-400 hover:text-white'
                        }`}
                      >
                        {chunk.completed ? 'Done' : 'Mark'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};