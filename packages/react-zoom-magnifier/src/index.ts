export { ZoomProvider } from "./context/ZoomProvider";
export type { ZoomProviderProps } from "./context/ZoomProvider";

export { useZoom } from "./hooks/useZoom";

export { ZoomButton } from "./components/ZoomButton/ZoomButton";
export type { ZoomButtonProps, ZoomButtonPosition } from "./components/ZoomButton/ZoomButton";

export { ZoomLens } from "./components/ZoomLens/ZoomLens";
export type { ZoomLensProps } from "./components/ZoomLens/ZoomLens";

export { ZoomControls } from "./components/ZoomControls/ZoomControls";
export type { ZoomControlsProps } from "./components/ZoomControls/ZoomControls";

export { ZoomScreenshotButton } from "./components/ZoomScreenshotButton/ZoomScreenshotButton";
export type { ZoomScreenshotButtonProps } from "./components/ZoomScreenshotButton/ZoomScreenshotButton";

export { DEFAULT_ZOOM_CONFIG } from "./core/zoom-engine";

export type {
  ZoomConfig,
  ZoomConfigInput,
  ZoomContextValue,
  ZoomState,
  LensShape,
  Point,
} from "./types";

// Consumers opt in explicitly: import "react-zoom-magnifier/styles.css";
