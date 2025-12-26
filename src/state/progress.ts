export type House = "gryffindor" | "ravenclaw" | "hufflepuff" | "slytherin";

export interface Progress {
  house?: House;
  unlockedScenes: string[];
  collectedArtifacts: string[];
  visitedRooms: string[];
  visitedMemories: string[];
  finalUnlocked: boolean;
  letterRevealed: boolean;
}

const STORAGE_KEY = "devanshi-museum-progress";

export const defaultProgress: Progress = {
  house: undefined,
  unlockedScenes: ["intro"],
  collectedArtifacts: [],
  visitedRooms: [],
  visitedMemories: [],
  finalUnlocked: false,
  letterRevealed: false,
};

export function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultProgress, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  return { ...defaultProgress };
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export const houseColors: Record<House, { primary: string; secondary: string; accent: string }> = {
  gryffindor: { primary: "#740001", secondary: "#D3A625", accent: "#EEBA30" },
  ravenclaw: { primary: "#0E1A40", secondary: "#946B2D", accent: "#5D5D5D" },
  hufflepuff: { primary: "#ECB939", secondary: "#372E29", accent: "#F0C75E" },
  slytherin: { primary: "#1A472A", secondary: "#5D5D5D", accent: "#AAAAAA" },
};
