import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadDataUrl } from "../capture";

describe("downloadDataUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a temporary anchor, clicks it, and removes it", () => {
    const clickSpy = vi.fn();
    const appendSpy = vi.spyOn(document.body, "appendChild");

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "a") el.click = clickSpy;
      return el;
    });

    downloadDataUrl("data:image/png;base64,abc", "shot.png");

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    const anchor = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(anchor.href).toBe("data:image/png;base64,abc");
    expect(anchor.download).toBe("shot.png");
    expect(document.body.contains(anchor)).toBe(false);
  });
});
