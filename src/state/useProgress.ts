import { useState, useEffect, useCallback } from "react";
import type { Progress, House } from "./progress";
import { loadProgress, saveProgress, defaultProgress } from "./progress";

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const updateProgress = useCallback((updates: Partial<Progress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...updates };
      saveProgress(next);
      return next;
    });
  }, []);

  const setHouse = useCallback((house: House) => {
    updateProgress({ house, unlockedScenes: [...progress.unlockedScenes, "lumos"] });
  }, [progress.unlockedScenes, updateProgress]);

  const unlockScene = useCallback((scene: string) => {
    if (!progress.unlockedScenes.includes(scene)) {
      updateProgress({ unlockedScenes: [...progress.unlockedScenes, scene] });
    }
  }, [progress.unlockedScenes, updateProgress]);

  const collectArtifact = useCallback((artifact: string) => {
    if (!progress.collectedArtifacts.includes(artifact)) {
      const newArtifacts = [...progress.collectedArtifacts, artifact];
      const finalUnlocked = newArtifacts.length >= 3;
      updateProgress({ 
        collectedArtifacts: newArtifacts,
        finalUnlocked: finalUnlocked || progress.finalUnlocked
      });
    }
  }, [progress.collectedArtifacts, progress.finalUnlocked, updateProgress]);

  const visitRoom = useCallback((roomId: string) => {
    setProgress((prev) => {
      if (prev.visitedRooms.includes(roomId)) {
        return prev;
      }
      const next = { ...prev, visitedRooms: [...prev.visitedRooms, roomId] };
      saveProgress(next);
      return next;
    });
  }, []);

  const visitMemory = useCallback((memoryId: string) => {
    if (!progress.visitedMemories.includes(memoryId)) {
      updateProgress({ visitedMemories: [...progress.visitedMemories, memoryId] });
    }
  }, [progress.visitedMemories, updateProgress]);

  const revealLetter = useCallback(() => {
    updateProgress({ letterRevealed: true });
  }, [updateProgress]);

  const isSceneUnlocked = useCallback((scene: string) => {
    return progress.unlockedScenes.includes(scene);
  }, [progress.unlockedScenes]);

  const clearVisitedRooms = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, visitedRooms: [] };
      saveProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setProgress(defaultProgress);
    saveProgress(defaultProgress);
  }, []);

  return {
    progress,
    setHouse,
    unlockScene,
    collectArtifact,
    visitRoom,
    visitMemory,
    revealLetter,
    isSceneUnlocked,
    clearVisitedRooms,
    reset,
  };
}
