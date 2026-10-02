export type LensShape = "circle" | "square" | "rounded";

export interface ZoomConfig {
  minZoom: number;
  maxZoom: number;
  step: number;
  defaultZoom: number;

  lensSize: number;
  lensShape: LensShape;

  persist: boolean;
  storageKey: string;

  touchEnabled: boolean;
  showControls: boolean;
}

export type ZoomConfigInput = Partial<ZoomConfig>;

export interface ZoomState {
  zoom: number;
  isActive: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface ZoomContextValue {
  zoom: number;
  isActive: boolean;
  config: ZoomConfig;
  setZoom: (value: number) => void;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
  activate: () => void;
  deactivate: () => void;
  toggle: () => void;
  /**
   * Captures the current magnified lens view as a PNG and downloads it. Resolves to
   * `false` (without downloading) if Zoom Mode isn't active / no lens is mounted yet.
   * Requires the optional peer dependency `html2canvas` to be installed.
   */
  captureScreenshot: (filename?: string) => Promise<boolean>;
}
