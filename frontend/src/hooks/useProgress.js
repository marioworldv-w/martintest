// useProgress — local progress tracking hook

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ai_academy_progress';

export function useProgress() {
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // ignore storage errors
    }
  }, [completed]);

  const markComplete = useCallback((moduleId) => {
    setCompleted((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
  }, []);

  const markIncomplete = useCallback((moduleId) => {
    setCompleted((prev) => prev.filter((id) => id !== moduleId));
  }, []);

  const isComplete = useCallback(
    (moduleId) => completed.includes(moduleId),
    [completed]
  );

  const resetProgress = useCallback(() => {
    setCompleted([]);
  }, []);

  const getProgressPercent = useCallback(
    (total) => (total === 0 ? 0 : Math.round((completed.length / total) * 100)),
    [completed]
  );

  return { completed, markComplete, markIncomplete, isComplete, resetProgress, getProgressPercent };
}
