"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { theme } from "@/lib/theme";

type FullscreenCtx = {
  fullscreen: boolean;
  toggle: () => void;
  exit: () => void;
};

const Ctx = createContext<FullscreenCtx | null>(null);

export function useFullscreen(): FullscreenCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("PresentationShell is missing in the tree");
  return v;
}

/**
 * Wraps the whole app. Owns the fullscreen state so it survives route changes —
 * when the user hits fullscreen and then pages to the next part, the browser
 * stays in native fullscreen *and* the React state stays consistent, so the
 * header/tab chrome remains hidden.
 */
export function PresentationShell({
  header,
  tabs,
  children,
}: {
  header: ReactNode;
  tabs: ReactNode;
  children: ReactNode;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => setFullscreen(!!document.fullscreenElement);
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
  }, []);

  return (
    <Ctx.Provider value={{ fullscreen, toggle, exit }}>
      {!fullscreen && header}
      {!fullscreen && tabs}
      <main
        style={{
          flex: 1,
          background: theme.bg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>
    </Ctx.Provider>
  );
}
