"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SlideState = {
  partId: string;
  current: number; // 0-indexed
  total: number;
};

type Ctx = {
  state: SlideState;
  setState: (s: SlideState) => void;
};

const SlideStateCtx = createContext<Ctx | null>(null);

export function SlideStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SlideState>({
    partId: "",
    current: 0,
    total: 0,
  });
  return (
    <SlideStateCtx.Provider value={{ state, setState }}>
      {children}
    </SlideStateCtx.Provider>
  );
}

export function useSlideState() {
  const ctx = useContext(SlideStateCtx);
  if (!ctx) throw new Error("SlideStateProvider is missing in the tree");
  return ctx;
}
