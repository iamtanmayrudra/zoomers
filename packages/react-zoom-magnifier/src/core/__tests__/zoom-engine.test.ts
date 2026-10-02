import { describe, expect, it } from "vitest";
import { DEFAULT_ZOOM_CONFIG, clampZoom, resolveConfig, stepZoom } from "../zoom-engine";

describe("clampZoom", () => {
  it("keeps values within range unchanged", () => {
    expect(clampZoom(2, 1.5, 4)).toBe(2);
  });

  it("clamps below the minimum", () => {
    expect(clampZoom(0.5, 1.5, 4)).toBe(1.5);
  });

  it("clamps above the maximum", () => {
    expect(clampZoom(10, 1.5, 4)).toBe(4);
  });

  it("falls back to minZoom for NaN", () => {
    expect(clampZoom(Number.NaN, 1.5, 4)).toBe(1.5);
  });
});

describe("stepZoom", () => {
  it("increases by one step", () => {
    expect(stepZoom(2, 1, 0.5, 1.5, 4)).toBe(2.5);
  });

  it("decreases by one step", () => {
    expect(stepZoom(2.5, -1, 0.5, 1.5, 4)).toBe(2);
  });

  it("does not exceed maxZoom", () => {
    expect(stepZoom(4, 1, 0.5, 1.5, 4)).toBe(4);
  });

  it("does not go below minZoom", () => {
    expect(stepZoom(1.5, -1, 0.5, 1.5, 4)).toBe(1.5);
  });

  it("avoids floating point drift across repeated steps", () => {
    let zoom = 1.5;
    for (let i = 0; i < 5; i += 1) {
      zoom = stepZoom(zoom, 1, 0.5, 1.5, 4);
    }
    expect(zoom).toBe(4);
  });
});

describe("resolveConfig", () => {
  it("fills in defaults for an empty input", () => {
    expect(resolveConfig()).toEqual(DEFAULT_ZOOM_CONFIG);
  });

  it("overrides only the provided keys", () => {
    expect(resolveConfig({ defaultZoom: 3 })).toEqual({
      ...DEFAULT_ZOOM_CONFIG,
      defaultZoom: 3,
    });
  });
});
