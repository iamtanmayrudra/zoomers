import type { Point } from "../types";

export interface Rect {
  left: number;
  top: number;
}

/** Clamped top-left position for the lens box so it always stays within the viewport. */
export function computeLensBoxPosition(
  pointer: Point,
  lensSize: number,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  const half = lensSize / 2;
  return {
    x: clamp(pointer.x - half, 0, Math.max(0, viewportWidth - lensSize)),
    y: clamp(pointer.y - half, 0, Math.max(0, viewportHeight - lensSize)),
  };
}

/**
 * Translation to apply (before CSS `scale(zoom)`, i.e. `translate(tx, ty) scale(zoom)`)
 * to a full-size clone of the source content so that the source pixel under `pointer`
 * lines up with `pointer` itself inside the (possibly clamped) lens box.
 */
export function computeContentTranslate(
  pointer: Point,
  zoom: number,
  lensRect: Rect,
  sourceRect: Rect,
): Point {
  return {
    x: pointer.x - lensRect.left - zoom * (pointer.x - sourceRect.left),
    y: pointer.y - lensRect.top - zoom * (pointer.y - sourceRect.top),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
