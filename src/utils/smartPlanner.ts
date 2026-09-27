import { EnergyLevel, StressLevel, AvailableTime, Task, SmartPlanSlot, SmartPlanMeta } from '../types';

export function calculateStudentBattery(
  energy: EnergyLevel,
  stress: StressLevel,
  pendingHighPriorityCount: number
): { percentage: number; label: string; tone: string; description: string } {
  let base = 50;
  if (energy === 'low') base = 35;
  if (energy === 'okay') base = 62;
  if (energy === 'good') base = 78;
  if (energy === 'high') base = 92;

  if (stress === 'calm') base += 5;
  if (stress === 'moderate') base -= 2;
  if (stress === 'stressed') base -= 12;
  if (stress === 'very_stressed') base -= 20;

  if (pendingHighPriorityCount > 3) base -= 8;
  else if (pendingHighPriorityCount === 0) base += 5;

  const percentage = Math.max(15, Math.min(100, base));

  let label = 'Moderate energy';
  let tone = 'text-amber-400';
  let description = "Based on your current check-in and today's workload.";

  if (percentage >= 80) {
    label = 'Peak Vitality & Focus';
    tone = 'text-emerald-400';
    description = "High stamina available for tackling complex and deep problem solving.";
  } else if (percentage >= 60) {
    label = 'Steady & Balanced';
    tone = 'text-cyan-400';
    description = "Good rhythm for mixed problem sets and priority assignments.";
  } else if (percentage >= 40) {
    label = 'Moderate energy';
    tone = 'text-amber-400';
    description = "Plan adapts with shorter focus sprints and restorative pauses.";
  } else {
    label = 'Low Reserve / Recovery Needed';
    tone = 'text-rose-400';
    description = "Pacing is scaled down to essential micro-steps to prevent burnout.";
  }

  return { percentage, label, tone, description };
}

export function generateSmartPlan(
  tasks: Task[],
  energy: EnergyLevel,
  stress: StressLevel,
  availableTime: AvailableTime
): { slots: SmartPlanSlot[]; meta: SmartPlanMeta } {
  const timeMinutesMap: Record<AvailableTime, number> = {
    '1h': 60,
    '2h': 120,
    '3h': 180,
    '4h': 240,
    '6h': 360,
  };

  const totalCapMinutes = timeMinutesMap[availableTime] || 180;
  let remainingBudget = totalCapMinutes;

  const pendingTasks = tasks.filter(t => !t.completed);

  const sortedTasks = [...pendingTasks].sort((a, b) => {
    if (stress === 'very_stressed' || stress === 'stressed') {
      const pScore = (p: string) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
      if (pScore(a.priority) !== pScore(b.priority)) {
        return pScore(b.priority) - pScore(a.priority);
      }
      return a.durationMinutes - b.durationMinutes;
    }

    if (energy === 'low') {
      const diffScore = (d: string) => (d === 'easy' ? 1 : d === 'medium' ? 2 : 3);
      if (diffScore(a.difficulty) !== diffScore(b.difficulty)) {
        return diffScore(a.difficulty) - diffScore(b.difficulty);
      }
      return a.durationMinutes - b.durationMinutes;
    }

    if (energy === 'high') {
      const diffScore = (d: string) => (d === 'hard' ? 3 : d === 'medium' ? 2 : 1);
      if (diffScore(a.difficulty) !== diffScore(b.difficulty)) {
        return diffScore(b.difficulty) - diffScore(a.difficulty);
      }
      return b.durationMinutes - a.durationMinutes;
    }

    const pScore = (p: string) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
    return pScore(b.priority) - pScore(a.priority);
  });

  let focusChunk = 25;
  let breakChunk = 5;
  let strategyName = 'Balanced Flow';
  let strategyDescription = 'Interleaving 25-minute focus blocks with rejuvenating 5-minute pauses.';

  if (energy === 'low' && (stress === 'stressed' || stress === 'very_stressed')) {
    focusChunk = 20;
    breakChunk = 10;
    strategyName = 'Gentle Decompression';
    strategyDescription = 'Pacing with micro-sprints and frequent restorative pauses to keep anxiety low.';
  } else if (energy === 'low') {
    focusChunk = 20;
    breakChunk = 8;
    strategyName = 'Low-Energy Momentum';
    strategyDescription = 'Starting with quick wins and shorter 20-min sessions to build effortless progress.';
  } else if (energy === 'high' && stress === 'calm') {
    focusChunk = 45;
    breakChunk = 10;
    strategyName = 'Deep Work Power Sprint';
    strategyDescription = 'Optimized for high stamina: tackles complex topics early in sustained 45-min blocks.';
  } else if (stress === 'very_stressed') {
    focusChunk = 20;
    breakChunk = 10;
    strategyName = 'Stress Relief Focus';
    strategyDescription = 'Isolating urgent tasks only and clearing mental clutter with buffer intervals.';
  }

  const slots: SmartPlanSlot[] = [];
  let currentHour = 9;
  let currentMinute = 0;

  const formatTime = (h: number, m: number) => {
    const hh = String(h % 24).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const advanceTime = (mins: number) => {
    currentMinute += mins;
    while (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }
  };

  if ((energy === 'low' || stress === 'stressed' || stress === 'very_stressed') && remainingBudget >= 20) {
    const quickWinTask = sortedTasks.find(t => t.durationMinutes <= 15 && t.difficulty === 'easy');
    if (quickWinTask) {
      slots.push({
        id: 'slot-warmup',
        time: formatTime(currentHour, currentMinute),
        title: `Quick Win: ${quickWinTask.title}`,
        type: 'quick_win',
        durationMinutes: quickWinTask.durationMinutes,
        taskId: quickWinTask.id,
        completed: false,
        icon: '⚡',
        description: 'Start with an easy task to build dopamine and effortless momentum.'
      });
      advanceTime(quickWinTask.durationMinutes);
      remainingBudget -= quickWinTask.durationMinutes;

      slots.push({
        id: 'slot-break-w',
        time: formatTime(currentHour, currentMinute),
        title: 'Short break',
        type: 'break',
        durationMinutes: 5,
        completed: false,
        icon: '☕',
        description: 'Drink water and reset before diving into core tasks.'
      });
      advanceTime(5);
      remainingBudget -= 5;
    }
  }

  let taskCount = 0;
  const maxTasks = (stress === 'very_stressed' || stress === 'stressed') ? 3 : 6;

  for (const t of sortedTasks) {
    if (remainingBudget < 20 || taskCount >= maxTasks) break;
    if (slots.some(s => s.taskId === t.id)) continue;

    const taskTime = Math.min(t.durationMinutes, focusChunk, remainingBudget);

    slots.push({
      id: `slot-task-${t.id}-${taskCount}`,
      time: formatTime(currentHour, currentMinute),
      title: t.title,
      type: 'task',
      durationMinutes: taskTime,
      taskId: t.id,
      completed: false,
      icon: t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢',
      description: `${t.subject} (${t.difficulty.toUpperCase()} difficulty)`
    });

    advanceTime(taskTime);
    remainingBudget -= taskTime;
    taskCount++;

    if (remainingBudget >= breakChunk) {
      slots.push({
        id: `slot-break-${taskCount}`,
        time: formatTime(currentHour, currentMinute),
        title: breakChunk >= 10 ? 'Mindful break & stretch' : 'Short break',
        type: 'break',
        durationMinutes: breakChunk,
        completed: false,
        icon: '☕',
        description: 'Step away from screen. Let your memory consolidate.'
      });
      advanceTime(breakChunk);
      remainingBudget -= breakChunk;
    }
  }

  if (slots.length === 0) {
    slots.push({
      id: 'slot-default-1',
      time: '09:00',
      title: 'Mathematics revision',
      type: 'task',
      durationMinutes: 25,
      completed: false,
      icon: '📚',
      description: 'Review core concepts and formulas'
    });
    slots.push({
      id: 'slot-default-2',
      time: '09:25',
      title: 'Short break',
      type: 'break',
      durationMinutes: 5,
      completed: false,
      icon: '☕',
      description: 'Hydrate and stretch'
    });
    slots.push({
      id: 'slot-default-3',
      time: '09:30',
      title: 'Assignment — Questions 1–2',
      type: 'task',
      durationMinutes: 30,
      completed: false,
      icon: '📝',
      description: 'Solve first two problem sets'
    });
    slots.push({
      id: 'slot-default-4',
      time: '10:00',
      title: 'Break',
      type: 'break',
      durationMinutes: 5,
      completed: false,
      icon: '☕',
      description: 'Rest eyes'
    });
    slots.push({
      id: 'slot-default-5',
      time: '10:05',
      title: 'Programming practice',
      type: 'task',
      durationMinutes: 25,
      completed: false,
      icon: '💻',
      description: 'Graph BFS traversal algorithms'
    });
  }

  const totalStudyMinutes = slots.filter(s => s.type === 'task' || s.type === 'quick_win').reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalBreakMinutes = slots.filter(s => s.type === 'break').reduce((acc, s) => acc + s.durationMinutes, 0);

  return {
    slots,
    meta: {
      energy,
      stress,
      availableTime,
      strategyName,
      strategyDescription,
      totalStudyMinutes,
      totalBreakMinutes,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  };
}