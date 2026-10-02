"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { captureElementAsPngDataUrl, downloadDataUrl } from "../core/capture";
import { clampZoom, resolveConfig, stepZoom } from "../core/zoom-engine";
import { LensElementContext } from "./LensElementContext";
import type { ZoomConfigInput, ZoomContextValue } from "../types";

export const ZoomContext = createContext<ZoomContextValue | null>(null);

export interface ZoomProviderProps extends ZoomConfigInput {
  children: ReactNode;
}

export function ZoomProvider({ children, ...configInput }: ZoomProviderProps) {
  const config = useMemo(() => resolveConfig(configInput), [
    configInput.minZoom,
    configInput.maxZoom,
    configInput.step,
    configInput.defaultZoom,
    configInput.lensSize,
    configInput.lensShape,
    configInput.persist,
    configInput.storageKey,
    configInput.touchEnabled,
    configInput.showControls,
  ]);

  const [zoom, setZoomState] = useState(() => readPersistedZoom(config) ?? config.defaultZoom);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!config.persist || typeof window === "undefined") return;
    window.localStorage.setItem(config.storageKey, String(zoom));
  }, [zoom, config.persist, config.storageKey]);

  const setZoom = useCallback(
    (value: number) => setZoomState(clampZoom(value, config.minZoom, config.maxZoom)),
    [config.minZoom, config.maxZoom],
  );

  const increaseZoom = useCallback(
    () =>
      setZoomState((current) => stepZoom(current, 1, config.step, config.minZoom, config.maxZoom)),
    [config.step, config.minZoom, config.maxZoom],
  );

  const decreaseZoom = useCallback(
    () =>
      setZoomState((current) => stepZoom(current, -1, config.step, config.minZoom, config.maxZoom)),
    [config.step, config.minZoom, config.maxZoom],
  );

  const resetZoom = useCallback(() => setZoomState(config.defaultZoom), [config.defaultZoom]);

  const activate = useCallback(() => setIsActive(true), []);
  const deactivate = useCallback(() => setIsActive(false), []);
  const toggle = useCallback(() => setIsActive((current) => !current), []);

  const lensElementRef = useRef<HTMLElement | null>(null);

  const captureScreenshot = useCallback(async (filename = "zoom-magnifier-capture.png") => {
    const lensElement = lensElementRef.current;
    if (!lensElement) return false;

    const dataUrl = await captureElementAsPngDataUrl(lensElement);
    downloadDataUrl(dataUrl, filename);
    return true;
  }, []);

  const value = useMemo<ZoomContextValue>(
    () => ({
      zoom,
      isActive,
      config,
      setZoom,
      increaseZoom,
      decreaseZoom,
      resetZoom,
      activate,
      deactivate,
      toggle,
      captureScreenshot,
    }),
    [
      zoom,
      isActive,
      config,
      setZoom,
      increaseZoom,
      decreaseZoom,
      resetZoom,
      activate,
      deactivate,
      toggle,
      captureScreenshot,
    ],
  );

  return (
    <LensElementContext.Provider value={lensElementRef}>
      <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>
    </LensElementContext.Provider>
  );
}

function readPersistedZoom(config: ZoomContextValue["config"]): number | null {
  if (!config.persist || typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(config.storageKey);
  if (raw === null) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? clampZoom(parsed, config.minZoom, config.maxZoom) : null;
}
