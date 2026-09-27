import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { OnboardingModal } from './components/OnboardingModal';
import { QuickCheckInModal } from './components/QuickCheckInModal';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { SmartBreakdownModal } from './components/SmartBreakdownModal';
import { FocusTimerModal } from './components/FocusTimerModal';

import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { SmartPlanView } from './views/SmartPlanView';
import { OverwhelmedView } from './views/OverwhelmedView';
import { DeadlineRescueView } from './views/DeadlineRescueView';
import { GoalsHabitsView } from './views/GoalsHabitsView';
import { WellnessView } from './views/WellnessView';
import { ProfileSettingsView } from './views/ProfileSettingsView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'smart-plan':
        return <SmartPlanView />;
      case 'overwhelmed':
        return <OverwhelmedView />;
      case 'deadline-rescue':
        return <DeadlineRescueView />;
      case 'goals-habits':
        return <GoalsHabitsView />;
      case 'wellness':
        return <WellnessView />;
      case 'settings':
        return <ProfileSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] text-slate-100 font-sans">
      {/* Sidebar for Desktop & Tablet */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-24 md:pb-12">
          {renderCurrentView()}
        </main>

        {/* Mobile Navigation bar */}
        <MobileNav />
      </div>

      {/* Modals & Overlays */}
      <OnboardingModal />
      <QuickCheckInModal />
      <AddTaskModal />
      <EditTaskModal />
      <SmartBreakdownModal />
      <FocusTimerModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;