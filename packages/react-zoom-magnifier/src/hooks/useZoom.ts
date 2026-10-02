"use client";

import { useContext } from "react";
import { ZoomContext } from "../context/ZoomProvider";
import type { ZoomContextValue } from "../types";

export function useZoom(): ZoomContextValue {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoom() must be used within a <ZoomProvider>");
  }
  return context;
}
