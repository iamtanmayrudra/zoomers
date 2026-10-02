import { computeContentTranslate } from "../core/lens-position";
import type { Point } from "../types";
import type { LensRenderer } from "./renderer";

const RESYNC_DEBOUNCE_MS = 120;

/**
 * Magnifies `source` by cloning it once and re-scaling the clone with a CSS transform
 * on every pointer update, instead of re-cloning per frame. Re-clones (debounced) when
 * the source subtree mutates, so the lens doesn't go stale for moderately dynamic UIs.
 *
 * Known limitations (documented, not solved here): content inside <iframe>, <canvas>,
 * and <video> does not clone meaningfully; cross-origin images may fail to repaint in
 * the clone due to browser security restrictions.
 */
export class DomCloneRenderer implements LensRenderer {
  private readonly source: HTMLElement;
  private clone: HTMLElement | null = null;
  private lensContainer: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  private resyncTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(source: HTMLElement) {
    this.source = source;
  }

  mount(lensContainer: HTMLElement): void {
    this.lensContainer = lensContainer;
    this.createClone();

    this.observer = new MutationObserver((mutations) => {
      // Ignore mutations caused by the lens itself (e.g. its position tracking the
      // pointer every frame) so moving the mouse doesn't trigger constant re-cloning.
      const relevant = mutations.some((mutation) => !isWithinIgnoredSubtree(mutation.target));
      if (!relevant) return;

      if (this.resyncTimer) clearTimeout(this.resyncTimer);
      this.resyncTimer = setTimeout(() => this.createClone(), RESYNC_DEBOUNCE_MS);
    });
    this.observer.observe(this.source, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }

  update(pointer: Point, zoom: number): void {
    if (!this.clone || !this.lensContainer) return;

    const sourceRect = this.source.getBoundingClientRect();
    const lensRect = this.lensContainer.getBoundingClientRect();

    const { x, y } = computeContentTranslate(pointer, zoom, lensRect, sourceRect);
    this.clone.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
  }

  destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    if (this.resyncTimer) clearTimeout(this.resyncTimer);
    this.clone?.remove();
    this.clone = null;
    this.lensContainer = null;
  }

  private createClone(): void {
    if (!this.lensContainer) return;

    const rect = this.source.getBoundingClientRect();
    const next = this.source.cloneNode(true) as HTMLElement;

    stripIgnoredSubtrees(next);
    stripIds(next);
    disableInteractiveElements(next);

    next.style.position = "absolute";
    next.style.left = "0";
    next.style.top = "0";
    next.style.width = `${rect.width}px`;
    next.style.height = `${rect.height}px`;
    next.style.transformOrigin = "0 0";
    next.style.pointerEvents = "none";
    next.style.margin = "0";

    this.clone?.remove();
    this.clone = next;
    this.lensContainer.appendChild(next);
  }
}

/**
 * Removes the magnifier's own lens element (and anything else opted out via
 * `data-zoom-magnifier-ignore`) from the clone. Without this, cloning a source that
 * contains the lens itself (e.g. the default `document.body` source) would capture the
 * lens's *previous* clone too, compounding into an unbounded, ever-growing DOM on every
 * MutationObserver resync.
 */
function isWithinIgnoredSubtree(node: Node): boolean {
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return element?.closest("[data-zoom-magnifier-ignore]") != null;
}

function stripIgnoredSubtrees(root: HTMLElement): void {
  if (root.hasAttribute("data-zoom-magnifier-ignore")) {
    root.remove();
    return;
  }
  root.querySelectorAll("[data-zoom-magnifier-ignore]").forEach((el) => el.remove());
}

function stripIds(root: HTMLElement): void {
  if (root.hasAttribute("id")) root.removeAttribute("id");
  root.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
}

function disableInteractiveElements(root: HTMLElement): void {
  root
    .querySelectorAll("input, textarea, select, button, a, [tabindex]")
    .forEach((el) => {
      el.setAttribute("tabindex", "-1");
      if ("disabled" in el) (el as HTMLInputElement).disabled = true;
      el.removeAttribute("href");
    });
}
