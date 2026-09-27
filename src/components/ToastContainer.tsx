import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-xl transform transition-all duration-300 animate-slide-up"
        >
          <div className="flex items-center space-x-2.5">
            {toast.type === 'info' ? (
              <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium text-slate-100">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};