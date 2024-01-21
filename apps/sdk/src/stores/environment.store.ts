import { create } from "zustand";

interface SimulationEnvironment {
  simulation_time: number;
  warm_up_time: number;
  interarrival: number;
}

interface SimulationEnvironmentStore {
  environment: SimulationEnvironment;
  updateEnvironment(update: Partial<SimulationEnvironment>): void;
}

export const useSimulationEnvironment = create<SimulationEnvironmentStore>()(
  (set) => ({
    environment: {
      interarrival: 0,
      simulation_time: 0,
      warm_up_time: 0,
    },
    updateEnvironment: (update: SimulationEnvironment) => {
      console.log(update);
      set((state) => ({ environment: { ...state, ...update } }));
    },
  })
);
