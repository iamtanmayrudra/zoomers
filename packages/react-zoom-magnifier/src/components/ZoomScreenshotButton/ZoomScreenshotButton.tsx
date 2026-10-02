"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { useZoom } from "../../hooks/useZoom";

export interface ZoomScreenshotButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Filename for the downloaded PNG. Defaults to "zoom-magnifier-capture.png". */
  filename?: string;
  label?: string;
}

/**
 * Downloads the current magnified lens view as a PNG. Disabled while Zoom Mode is
 * inactive, since there's no lens content to capture. Requires the optional peer
 * dependency `html2canvas`.
 */
export function ZoomScreenshotButton({
  filename,
  label = "Save zoomed screenshot",
  className,
  disabled,
  ...rest
}: ZoomScreenshotButtonProps) {
  const { isActive, captureScreenshot } = useZoom();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleClick = async () => {
    setIsCapturing(true);
    try {
      await captureScreenshot(filename);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      disabled={disabled || !isActive || isCapturing}
      className={["zoom-magnifier-screenshot-button", className].filter(Boolean).join(" ")}
      {...rest}
    >
      📷
    </button>
  );
}
