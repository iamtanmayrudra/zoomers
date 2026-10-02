import { describe, expect, it } from "vitest";
import { computeContentTranslate, computeLensBoxPosition } from "../lens-position";

describe("computeLensBoxPosition", () => {
  it("centers the lens on the pointer away from edges", () => {
    expect(computeLensBoxPosition({ x: 500, y: 500 }, 200, 1920, 1080)).toEqual({
      x: 400,
      y: 400,
    });
  });

  it("clamps at the top-left corner", () => {
    expect(computeLensBoxPosition({ x: 0, y: 0 }, 200, 1920, 1080)).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("clamps at the bottom-right corner", () => {
    expect(computeLensBoxPosition({ x: 1920, y: 1080 }, 200, 1920, 1080)).toEqual({
      x: 1720,
      y: 880,
    });
  });
});

describe("computeContentTranslate", () => {
  it("keeps the source pixel under the pointer when source and lens share an origin", () => {
    const pointer = { x: 500, y: 500 };
    const lensRect = { left: 400, top: 400 };
    const sourceRect = { left: 0, top: 0 };

    const { x, y } = computeContentTranslate(pointer, 2, lensRect, sourceRect);

    // The transformed point (clone-local = pointer - sourceRect) scaled by zoom
    // plus translate must land back at (pointer - lensRect) inside the lens box.
    const resultX = x + 2 * (pointer.x - sourceRect.left);
    const resultY = y + 2 * (pointer.y - sourceRect.top);
    expect(resultX).toBeCloseTo(pointer.x - lensRect.left);
    expect(resultY).toBeCloseTo(pointer.y - lensRect.top);
  });

  it("accounts for a source element offset from the viewport origin", () => {
    const pointer = { x: 300, y: 250 };
    const lensRect = { left: 200, top: 150 };
    const sourceRect = { left: 50, top: 40 };
    const zoom = 3;

    const { x, y } = computeContentTranslate(pointer, zoom, lensRect, sourceRect);

    const resultX = x + zoom * (pointer.x - sourceRect.left);
    const resultY = y + zoom * (pointer.y - sourceRect.top);
    expect(resultX).toBeCloseTo(pointer.x - lensRect.left);
    expect(resultY).toBeCloseTo(pointer.y - lensRect.top);
  });
});
