import { createContext } from "react";
import type { MutableRefObject } from "react";

/**
 * Internal (not exported from the package root) channel for `ZoomLens` to register
 * its current DOM node with `ZoomProvider`, so `captureScreenshot()` has something to
 * rasterize without `ZoomLens` needing to know about screenshots at all.
 */
export const LensElementContext = createContext<MutableRefObject<HTMLElement | null> | null>(null);
