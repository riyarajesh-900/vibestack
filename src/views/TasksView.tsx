import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, DifficultyLevel } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  Check 
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    toggleTaskComplete, 
    toggleSubtaskComplete,
    deleteTask, 
    setEditingTask, 
    setBreakdownTaskData,
    setOpenAddTaskModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'today' && !t.deadline.toLowerCase().includes('today')) return false;
    if (activeTab === 'upcoming' && (t.completed || t.deadline.toLowerCase().includes('today'))) return false;
    if (activeTab === 'completed' && !t.completed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSubject = t.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject) return false;
    }

    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (difficultyFilter !== 'all' && t.difficulty !== difficultyFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>My Academic Tasks</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {tasks.length} total
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Organize assignments, revisions, and problem sets. MindMate will automatically adapt them into your schedule.
          </p>
        </div>

        <button
          onClick={() => setOpenAddTaskModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-2 shrink-0 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-panel p-4 rounded-3xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: 'Due Today 🔴' },
              { id: 'upcoming', label: 'Upcoming 🟡' },
              { id: 'completed', label: 'Completed ✓' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks or subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Filter by:
          </span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (Warm-up)</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard (Deep Focus)</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-purple-600/15 flex items-center justify-center text-purple-400 border border-purple-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your first academic task and let MindMate organize your day adaptively.
            </p>
          </div>
          <button
            onClick={() => setOpenAddTaskModal(true)}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30"
          >
            + Add Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubtasks = task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;

            return (
              <div
                key={task.id}
                className={`glass-panel p-4 sm:p-5 rounded-3xl transition-all border ${
                  task.completed 
                    ? 'opacity-60 bg-slate-900/40 border-slate-800' 
                    : task.priority === 'high' 
                      ? 'border-rose-500/25 hover:border-rose-500/50' 
                      : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-purple-400 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-purple-400" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <h4 className={`text-sm sm:text-base font-bold text-slate-100 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 font-semibold border border-slate-700">
                          {task.subject}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          task.priority === 'high' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                          task.priority === 'medium' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}>
                          {task.priority} priority
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                          {task.difficulty.toUpperCase()} difficulty
                        </span>

                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {task.durationMinutes} min
                        </span>

                        <span className="font-semibold text-purple-300">
                          📅 {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setBreakdownTaskData(task)}
                      className="p-2 rounded-xl text-xs font-semibold bg-purple-600/15 text-purple-300 border border-purple-500/30 hover:bg-purple-600/25 transition-colors flex items-center space-x-1"
                      title="Decompose into micro-steps"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Break Down</span>
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {hasSubtasks && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 pl-8 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold">Subtasks ({completedSubtasks}/{task.subtasks!.length})</span>
                      <span className="text-[11px] text-purple-400 font-medium">Bite-sized micro-steps</span>
                    </div>

                    <div className="space-y-1.5">
                      {task.subtasks!.map(st => (
                        <div
                          key={st.id}
                          onClick={() => toggleSubtaskComplete(task.id, st.id)}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            st.completed 
                              ? 'bg-slate-900/60 border-slate-800 text-slate-500 line-through' 
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-200 hover:border-purple-500/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            {st.completed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate">{st.title}</span>
                          </div>
                          {st.durationMinutes && (
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">~{st.durationMinutes}m</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};