import { create } from 'zustand';

export type BackendEngine = "JAVA" | "PYTHON";

interface BackendEngineState {
  engine: BackendEngine;
  setEngine: (engine: BackendEngine) => void;
}

export const useBackendEngineStore = create<BackendEngineState>((set) => ({
  engine: "JAVA", // Default to Java
  setEngine: (engine) => set({ engine }),
}));
