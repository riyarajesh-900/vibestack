import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, DifficultyLevel } from '../types';
import { X, Plus } from 'lucide-react';

export const AddTaskModal: React.FC = () => {
  const { openAddTaskModal, setOpenAddTaskModal, addTask } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [deadline, setDeadline] = useState('Tomorrow');

  if (!openAddTaskModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      subject: subject.trim() || 'General Academic',
      priority,
      difficulty,
      durationMinutes: Number(durationMinutes),
      deadline: deadline.trim() || 'Upcoming',
      subtasks: []
    });

    setTitle('');
    setOpenAddTaskModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Academic Task</h3>
              <p className="text-xs text-slate-400">MindMate will adapt it into your smart timeline</p>
            </div>
          </div>
          <button
            onClick={() => setOpenAddTaskModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems Lab Assignment"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Tag</label>
              <input
                type="text"
                placeholder="e.g. Database Systems, Math"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline</label>
              <select
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Due Today">Due Today 🔴</option>
                <option value="Tomorrow">Tomorrow 🟡</option>
                <option value="In 2 days">In 2 days</option>
                <option value="In 3 days">In 3 days</option>
                <option value="Next Week">Next Week 🟢</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="high">🔴 High (Urgent)</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low (Quick/Flexible)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="easy">Easy (Warm-up)</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard (Deep Focus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (min)</label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value={15}>15 min (Quick win)</option>
                <option value={25}>25 min (Standard block)</option>
                <option value={35}>35 min (Medium)</option>
                <option value={45}>45 min (Deep work)</option>
                <option value={60}>60 min (Full lecture/set)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setOpenAddTaskModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};