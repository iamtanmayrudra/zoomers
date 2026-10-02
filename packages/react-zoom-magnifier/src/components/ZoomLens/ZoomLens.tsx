"use client";

import { useContext, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { computeLensBoxPosition } from "../../core/lens-position";
import { LensElementContext } from "../../context/LensElementContext";
import { DomCloneRenderer } from "../../renderers/dom-clone-renderer";
import type { LensRenderer } from "../../renderers/renderer";
import { usePointerPosition } from "../../hooks/usePointerPosition";
import { useZoom } from "../../hooks/useZoom";
import type { LensShape } from "../../types";

export interface ZoomLensProps {
  /** Element (or ref to one) to magnify. Defaults to `document.body`. */
  source?: HTMLElement | RefObject<HTMLElement>;
  size?: number;
  shape?: LensShape;
  borderWidth?: number;
  shadow?: boolean;
  className?: string;
}

const SHAPE_BORDER_RADIUS: Record<LensShape, string> = {
  circle: "50%",
  square: "0",
  rounded: "16px",
};

export function ZoomLens({
  source,
  size,
  shape,
  borderWidth = 3,
  shadow = true,
  className,
}: ZoomLensProps) {
  const { isActive, zoom, config } = useZoom();
  const lensSize = size ?? config.lensSize;
  const lensShape = shape ?? config.lensShape;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<LensRenderer | null>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const lensElementRef = useContext(LensElementContext);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    const sourceEl = resolveSourceElement(source);
    if (!container || !sourceEl) return;

    const renderer = new DomCloneRenderer(sourceEl);
    renderer.mount(container);
    rendererRef.current = renderer;

    if (lensElementRef) lensElementRef.current = container;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
      if (lensElementRef) lensElementRef.current = null;
    };
  }, [isActive, source, lensElementRef]);

  usePointerPosition(isActive, (pointer) => {
    const container = containerRef.current;
    if (!container) return;

    const { x, y } = computeLensBoxPosition(
      pointer,
      lensSize,
      window.innerWidth,
      window.innerHeight,
    );
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    rendererRef.current?.update(pointer, zoomRef.current);
  });

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className={["zoom-magnifier-lens", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      data-zoom-magnifier-ignore="true"
      style={{
        position: "fixed",
        width: lensSize,
        height: lensSize,
        borderRadius: SHAPE_BORDER_RADIUS[lensShape],
        overflow: "hidden",
        border: `${borderWidth}px solid rgba(255, 255, 255, 0.9)`,
        boxShadow: shadow ? "0 4px 24px rgba(0, 0, 0, 0.35)" : undefined,
        pointerEvents: "none",
        zIndex: 2147483000,
        background: "#fff",
      }}
    />
  );
}

function resolveSourceElement(
  source: ZoomLensProps["source"],
): HTMLElement | null {
  if (source && "current" in source) return source.current;
  if (source instanceof HTMLElement) return source;
  if (typeof document !== "undefined") return document.body;
  return null;
}
