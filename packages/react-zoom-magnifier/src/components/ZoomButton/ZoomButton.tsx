"use client";

import type { ButtonHTMLAttributes } from "react";
import { useZoom } from "../../hooks/useZoom";

export type ZoomButtonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface ZoomButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  position?: ZoomButtonPosition;
  activeLabel?: string;
  inactiveLabel?: string;
}

const POSITION_STYLE: Record<ZoomButtonPosition, React.CSSProperties> = {
  "top-left": { top: 16, left: 16 },
  "top-right": { top: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
};

export function ZoomButton({
  position,
  activeLabel = "Deactivate zoom",
  inactiveLabel = "Activate zoom",
  className,
  style,
  ...rest
}: ZoomButtonProps) {
  const { isActive, toggle } = useZoom();

  return (
    <button
      type="button"
      aria-label={isActive ? activeLabel : inactiveLabel}
      aria-pressed={isActive}
      onClick={toggle}
      className={["zoom-magnifier-button", className].filter(Boolean).join(" ")}
      style={{
        position: position ? "fixed" : undefined,
        zIndex: 2147483000,
        ...(position ? POSITION_STYLE[position] : null),
        ...style,
      }}
      {...rest}
    >
      {isActive ? "🔎" : "🔍"}
    </button>
  );
}
