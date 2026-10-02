import type { Point } from "../types";

export interface LensRenderer {
  /** Mount the renderer's content node inside the given lens container. */
  mount(lensContainer: HTMLElement): void;
  /** Update the magnified view for the current pointer position and zoom level. */
  update(pointer: Point, zoom: number): void;
  /** Tear down observers/listeners and remove the content node. */
  destroy(): void;
}
