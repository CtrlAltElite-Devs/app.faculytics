"use client";

import { useEffect, useState } from "react";

/**
 * Smoothly animates a numeric value from its current display toward `target`
 * using requestAnimationFrame. Honors `prefers-reduced-motion` by snapping
 * to the target instead of animating.
 *
 * Animating from the *current display* (not the previous target) handles
 * rapid successive changes gracefully — if the target flips mid-animation
 * the number continues from wherever it is, instead of snapping back to 0.
 */
export type EasingFn = (t: number) => number;

export const easings = {
  // Punchy arrival — quick start, soft landing. Best for counters.
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  linear: (t: number) => t,
} as const;

export type UseCountUpOptions = {
  /** ms, default 1000 */
  duration?: number;
  /** starting value on first mount; default 0 */
  from?: number;
  /** default easings.outExpo */
  easing?: EasingFn;
  /** default true — snaps to target instead of animating */
  respectReducedMotion?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useCountUp(target: number, options: UseCountUpOptions = {}): number {
  const {
    duration = 1000,
    from = 0,
    easing = easings.outExpo,
    respectReducedMotion = true,
  } = options;

  const [display, setDisplay] = useState<number>(() => {
    if (respectReducedMotion && prefersReducedMotion()) return target;
    return Number.isFinite(from) ? from : 0;
  });

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    if (respectReducedMotion && prefersReducedMotion()) {
      // Prop-driven snap-to-target when motion is disabled.
      setDisplay(target);
      return;
    }

    const start = performance.now();
    // `display` in the closure is captured at effect-run time — React
    // commits pending setDisplay updates before running effects, so this
    // is the latest animated value. Mid-flight target changes resume
    // smoothly from wherever the animation happened to be. `display` is
    // intentionally NOT in the dep array: including it would re-run the
    // effect on every RAF tick and loop forever.
    const startValue = display;
    const delta = target - startValue;

    // No-op: already there. Avoids a wasted RAF cycle.
    if (Math.abs(delta) < 1e-9) {
      return;
    }

    let rafId = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easing(progress);
      const next = startValue + delta * eased;
      setDisplay(next);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, easing, respectReducedMotion]);

  return display;
}
