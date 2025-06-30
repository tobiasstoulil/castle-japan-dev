import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
// import { useShallow } from "zustand/shallow";

export default create(
  subscribeWithSelector((set, get) => {
    return {
      //
      scopeAnim: false,
      handleScopeAnim: () => set({ scopeAnim: true }),

      charPosition: { x: 0, y: 0, z: 0 },
      setCharPosition: (ref) => set({ charPosition: ref }),

      hintCount: 0,
      increaseHintCount: () => set({ hintCount: get().hintCount + 1 }),
    };
  })
);
