import type { ZoomConfig, ZoomConfigInput } from "../types";

export const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
  minZoom: 1.5,
  maxZoom: 4,
  step: 0.5,
  defaultZoom: 2,
  lensSize: 200,
  lensShape: "circle",
  persist: false,
  storageKey: "react-zoom-magnifier:zoom",
  touchEnabled: true,
  showControls: true,
};

export function resolveConfig(input?: ZoomConfigInput): ZoomConfig {
  return { ...DEFAULT_ZOOM_CONFIG, ...input };
}

export function clampZoom(value: number, minZoom: number, maxZoom: number): number {
  if (Number.isNaN(value)) return minZoom;
  return Math.min(maxZoom, Math.max(minZoom, value));
}

export function stepZoom(
  current: number,
  delta: number,
  step: number,
  minZoom: number,
  maxZoom: number,
): number {
  return clampZoom(roundToStep(current + delta * step, step), minZoom, maxZoom);
}

function roundToStep(value: number, step: number): number {
  const precision = step.toString().split(".")[1]?.length ?? 0;
  return Number(value.toFixed(precision));
}
