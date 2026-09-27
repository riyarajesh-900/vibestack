import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subtask } from '../types';
import { X, Sparkles, Check, ListChecks } from 'lucide-react';

export const SmartBreakdownModal: React.FC = () => {
  const { breakdownTaskData, setBreakdownTaskData, editTask, showToast } = useApp();
  const [generatedSteps, setGeneratedSteps] = useState<Subtask[]>([]);

  if (!breakdownTaskData) return null;

  const defaultTitle = breakdownTaskData.title;

  const handleGenerateBreakdown = () => {
    const t = defaultTitle.toLowerCase();
    let steps: string[] = [];

    if (t.includes('dbms') || t.includes('database') || t.includes('sql')) {
      steps = [
        'Understand requirements & table schema specifications',
        'Draft ER Diagram and identify entity relations',
        'Perform 3NF normalization on problem tables',
        'Write SQL queries for questions 1–3',
        'Review query execution plans and export final PDF'
      ];
    } else if (t.includes('math') || t.includes('linear') || t.includes('calculus')) {
      steps = [
        'Review core theorem definitions & cheat sheet',
        'Solve 2 warm-up fundamental problems',
        'Tackle primary matrix / eigenvalue equations',
        'Verify edge case proofs & boundary values',
        'Consolidate summary notes for quick exam recall'
      ];
    } else if (t.includes('data structure') || t.includes('tree') || t.includes('graph')) {
      steps = [
        'Review diagram of node traversals and pointer operations',
        'Implement fundamental traversal logic (BFS / In-Order)',
        'Handle null pointers & edge cases',
        'Test time & space complexity constraints',
        'Verify test cases on online judge / IDE'
      ];
    } else if (t.includes('paper') || t.includes('report') || t.includes('write')) {
      steps = [
        'Outline key sections (Abstract, Intro, Method, Discussion)',
        'Draft background context and reference list',
        'Write methodology & primary findings',
        'Perform grammar & formatting check',
        'Export and submit final draft'
      ];
    } else {
      steps = [
        'Understand and clarify the core requirements',
        'Complete Part 1 / Questions 1–2 (20 min)',
        'Complete Part 2 / Questions 3–4 (20 min)',
        'Review answers against rubric or test cases',
        'Final check and submit assignment'
      ];
    }

    const subtasks: Subtask[] = steps.map((s, idx) => ({
      id: `gen-st-${Date.now()}-${idx}`,
      title: s,
      completed: false,
      durationMinutes: 10 + (idx * 5)
    }));

    setGeneratedSteps(subtasks);
  };

  const handleApplyToTask = () => {
    if (generatedSteps.length === 0) return;
    editTask(breakdownTaskData.id, {
      subtasks: generatedSteps
    });
    setBreakdownTaskData(null);
    showToast(`Breakdown applied to "${breakdownTaskData.title}"! 🧩`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Smart Task Breakdown 🧩</h3>
              <p className="text-xs text-slate-400">Turn large intimidating tasks into manageable bite-sized steps</p>
            </div>
          </div>
          <button
            onClick={() => setBreakdownTaskData(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Task</p>
          <p className="text-sm font-bold text-purple-200 mt-0.5">{breakdownTaskData.title}</p>
        </div>

        {generatedSteps.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-300">
              <ListChecks className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Click below to let MindMate automatically decompose this task into 4–5 micro-steps.
            </p>
            <button
              onClick={handleGenerateBreakdown}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Break It Down</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-300">Generated Micro-Steps ({generatedSteps.length})</p>
              <button
                onClick={handleGenerateBreakdown}
                className="text-[11px] text-purple-400 hover:underline"
              >
                Regenerate steps
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {generatedSteps.map((st, i) => (
                <div 
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span>{st.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-900">
                    ~{st.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setBreakdownTaskData(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyToTask}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Add Subtasks to Task</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};