import { create } from "zustand";

export type BackendEngine = "JAVA" | "PYTHON";

interface BackendEngineState {
  engine: BackendEngine;
  setEngine: (engine: BackendEngine) => void;
}

export const useBackendEngineStore = create<BackendEngineState>((set) => ({
  engine: "JAVA", 
  setEngine: (engine) => set({ engine }),
}));
