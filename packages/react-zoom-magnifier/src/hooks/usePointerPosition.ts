import { useEffect, useRef } from "react";
import type { Point } from "../types";

type PointerListener = (point: Point) => void;

/**
 * Tracks pointer/touch position imperatively via Pointer Events and batches delivery
 * through requestAnimationFrame, so callers can mutate the DOM directly without
 * triggering a React re-render on every move (see master plan section 13).
 */
export function usePointerPosition(
  active: boolean,
  onMove: PointerListener,
): void {
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  useEffect(() => {
    if (!active) return;

    let rafId = 0;
    let latest: Point | null = null;

    const flush = () => {
      rafId = 0;
      if (latest) onMoveRef.current(latest);
    };

    const schedule = (point: Point) => {
      latest = point;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    const handlePointerMove = (event: PointerEvent) => {
      schedule({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active]);
}
