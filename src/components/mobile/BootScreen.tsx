"use client";

import { useEffect, useState } from "react";

export function BootScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(100, ((now - start) / duration) * 100);
      setProgress(next);
      if (next < 100) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <p className="font-mono text-[17px] tracking-tight text-fg">
        iresharma
        <span className="boot-cursor ml-0.5 inline-block h-[17px] w-[7px] translate-y-[2px] bg-fg align-baseline" />
      </p>
      <p className="mt-3 text-[12px] text-dim">warming up the short version</p>
      <div className="mt-8 h-px w-36 overflow-hidden bg-line">
        <div
          className="h-full bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
