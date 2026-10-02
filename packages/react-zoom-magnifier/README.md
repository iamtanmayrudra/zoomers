# react-zoom-magnifier

An application-level magnifier / zoom lens for React and Next.js. Click a Zoom
button, move your pointer anywhere in the app, and a lens follows the cursor
magnifying whatever is underneath it — text, images, forms, charts, tables.

> **Status:** early (Milestone 1). The core magnifier and React API are
> implemented and manually verified in the bundled demo apps. See
> [Limitations](#limitations) before relying on this in production.

## Features

- One-click Zoom Mode activation (`ZoomButton`)
- Lens follows the pointer and magnifies the content directly underneath it
- Configurable zoom levels, min/max/step, and reset (`useZoom`, `ZoomControls`)
- Circle / square / rounded lens shapes, configurable size/border/shadow
- Boundary-aware: the lens clamps at viewport edges/corners without blank space
- Touch/pointer support via the Pointer Events API
- Save the current magnified view as a PNG (`ZoomScreenshotButton`)
- No continuous application-wide re-renders while the pointer moves (pointer
  tracking is batched through `requestAnimationFrame` and writes to the DOM
  directly)

## Installation

```bash
npm install react-zoom-magnifier
```

To use the screenshot feature, also install the optional peer dependency:

```bash
npm install html2canvas
```

(`html2canvas` is lazy-loaded only when `captureScreenshot()` is actually
called, so apps that don't use screenshots don't pay for it in their bundle.)

## Quick Start

```tsx
import {
  ZoomProvider,
  ZoomButton,
  ZoomControls,
  ZoomLens,
} from "react-zoom-magnifier";
import "react-zoom-magnifier/styles.css";

export default function App() {
  return (
    <ZoomProvider minZoom={1.5} maxZoom={4} step={0.5} defaultZoom={2}>
      <YourApp />

      <ZoomButton />
      <ZoomControls />
      <ZoomLens />
    </ZoomProvider>
  );
}
```

`ZoomLens` magnifies `document.body` by default — see [`ZoomLens`](#zoomlens)
to scope it to a specific container instead.

## React Setup

Wrap the part of your tree you want zoom controls available in with
`ZoomProvider`. It only needs to wrap once, typically near the app root.
`ZoomLens` should be mounted once as well (it renders `null` while Zoom Mode is
inactive, so it's cheap to always include).

## Next.js Setup

Every component in this package is already marked `"use client"`, so you can
import them directly into a Server Component tree without converting the whole
app to client-side rendering — only the magnifier's own subtree becomes a
client boundary:

```tsx
// app/layout.tsx (Server Component)
import { ZoomProvider, ZoomButton, ZoomLens } from "react-zoom-magnifier";
import "react-zoom-magnifier/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ZoomProvider>
          {children}
          <ZoomButton />
          <ZoomLens />
        </ZoomProvider>
      </body>
    </html>
  );
}
```

> **Verified:** this exact pattern is exercised end-to-end in
> [`examples/nextjs`](../../examples/nextjs) — a Server Component root layout
> renders the client `ZoomProvider`/`ZoomLens` boundary around a plain
> (non-"use client") Server Component page, using `next/image`. Confirmed
> working in both `next dev` and a production `next build` + `next start`
> (static prerendering, no hydration warnings, no console errors). Pages
> Router has not been tested yet.
>
> Each component ships marked `"use client"`; because `tsup`/esbuild bundles
> the whole package into a single file, that directive has to be re-added as a
> build **banner** (see `tsup.config.ts`) rather than relying on the per-file
> source markers, which get dropped during bundling. If you fork this package,
> keep that banner — without it, Next.js will fail client/server boundary
> checks on anything using `useState`/`useEffect` (i.e. everything here).

## API Reference

### `ZoomProvider`

```tsx
<ZoomProvider
  minZoom={1.5}
  maxZoom={4}
  step={0.5}
  defaultZoom={2}
  lensSize={200}
  lensShape="circle"
  persist={false}
  storageKey="react-zoom-magnifier:zoom"
>
  {children}
</ZoomProvider>
```

See [Configuration](#configuration) for all options.

### `useZoom()`

```tsx
const {
  zoom,
  setZoom,
  increaseZoom,
  decreaseZoom,
  resetZoom,
  isActive,
  activate,
  deactivate,
  toggle,
  captureScreenshot,
} = useZoom();
```

| Property | Type | Description |
| --- | --- | --- |
| `zoom` | `number` | Current magnification level. |
| `setZoom(value)` | `(number) => void` | Sets zoom, clamped to `minZoom`/`maxZoom`. |
| `increaseZoom()` / `decreaseZoom()` | `() => void` | Steps zoom by `step`. |
| `resetZoom()` | `() => void` | Resets to `defaultZoom`. |
| `isActive` | `boolean` | Whether Zoom Mode is on. |
| `activate()` / `deactivate()` / `toggle()` | `() => void` | Controls Zoom Mode. |
| `captureScreenshot(filename?)` | `(string?) => Promise<boolean>` | Downloads the current lens view as a PNG. Resolves `false` if no lens is mounted (Zoom Mode inactive). Requires `html2canvas`. |

### `ZoomButton`

```tsx
<ZoomButton
  position="bottom-right" // "top-left" | "top-right" | "bottom-left" | "bottom-right"
  activeLabel="Deactivate zoom"
  inactiveLabel="Activate zoom"
/>
```

Toggles Zoom Mode. `aria-label` and `aria-pressed` update automatically. Omit
`position` to render it inline wherever you place it in your layout (it only
becomes `position: fixed` when you pass one).

### `ZoomLens`

```tsx
<ZoomLens
  source={containerRef} // HTMLElement | RefObject<HTMLElement>, defaults to document.body
  size={200}
  shape="circle" // "circle" | "square" | "rounded"
  borderWidth={3}
  shadow
  className="my-lens"
/>
```

Renders nothing while Zoom Mode is inactive. While active, it mounts a lens
that follows the pointer and magnifies `source` (or a sub-element you point it
at via `source`) using a cloned-and-scaled copy of the DOM — see
[How it works](#how-it-works).

### `ZoomControls`

```tsx
<ZoomControls />
```

Renders decrease/increase/reset buttons and a live "Zoom level: 2x" label
(`aria-live="polite"`).

### `ZoomScreenshotButton`

```tsx
<ZoomScreenshotButton filename="my-capture.png" label="Save zoomed screenshot" />
```

Downloads the current magnified lens view as a PNG. Disabled while Zoom Mode
is inactive or a capture is in progress.

## Configuration

```ts
type ZoomConfig = {
  minZoom: number;       // default 1.5
  maxZoom: number;       // default 4
  step: number;          // default 0.5
  defaultZoom: number;   // default 2

  lensSize: number;        // default 200 (px)
  lensShape: "circle" | "square" | "rounded"; // default "circle"

  persist: boolean;      // default false — remember zoom level in localStorage
  storageKey: string;    // default "react-zoom-magnifier:zoom"

  touchEnabled: boolean;  // default true (reserved; Pointer Events cover touch already)
  showControls: boolean;  // default true (reserved for a future built-in controls toggle)
};
```

All fields are optional props on `ZoomProvider`; unset fields fall back to the
defaults above.

## Zoom Levels

Recommended defaults:

```
1.5x  2x  2.5x  3x  4x
```

```tsx
<ZoomProvider minZoom={1.5} maxZoom={4} step={0.5} />
```

Values outside `[minZoom, maxZoom]` are always clamped, including after
repeated `increaseZoom()`/`decreaseZoom()` calls.

## Touch Support

Pointer tracking is implemented with the Pointer Events API, which unifies
mouse, pen, and touch input, so the lens follows a finger/stylus the same way
it follows a mouse once Zoom Mode is active. Touch-specific QA (scroll
interference, touch target sizing on `ZoomButton`) is still on the backlog —
see Limitations.

## Keyboard Support

`ZoomButton` and `ZoomControls` are standard `<button>` elements, so they're
reachable via Tab and activate with Enter/Space with no extra wiring.
Dedicated keyboard *shortcuts* (e.g. a global hotkey to toggle Zoom Mode) are
not implemented yet.

## Accessibility

- `ZoomButton` exposes `aria-label` ("Activate zoom" / "Deactivate zoom") and
  `aria-pressed`, both updating with state.
- `ZoomControls` announces the current zoom level via `aria-live="polite"`.
- The lens itself is `aria-hidden` and `pointer-events: none` — it's a visual
  overlay, not a focusable/interactive element, so it never traps focus or
  interferes with keyboard navigation of the underlying app.
- A full accessibility test pass (screen readers, focus-order audits) is still
  on the backlog.

## Performance

Pointer movement does not trigger React re-renders: `usePointerPosition`
stores the latest coordinates in a ref and flushes at most once per
`requestAnimationFrame`, writing directly to the lens's DOM node and to the
renderer. The lens content itself is a single cloned DOM subtree that's
re-scaled with a CSS `transform` on each frame, rather than re-cloned — it's
only re-cloned (debounced) when the source subtree actually mutates.

## How it works

The lens uses a **DOM-clone renderer**: when Zoom Mode activates, the source
element (`document.body` by default) is cloned once with `cloneNode(true)`
and placed inside the lens, which is a small `overflow: hidden` box that
follows the pointer. On every pointer move, the clone's `transform:
translate(...) scale(zoom)` is recalculated so that the exact source pixel
under the cursor stays centered in the lens. A `MutationObserver` on the
source triggers a debounced re-clone when the underlying DOM changes, so the
lens doesn't go stale for moderately dynamic content.

This was chosen over a canvas/screenshot-based renderer because it preserves
real text rendering, form elements, and accessibility semantics inside the
lens.

## Browser Support

Targets modern evergreen browsers (Chrome, Edge, Firefox, Safari, and their
mobile equivalents). Relies on `MutationObserver`, Pointer Events, and CSS
transforms — all broadly supported. No IE11 support.

## Limitations

- **Not yet built:** Pages Router verification, a full
  unit/integration/E2E/visual-regression/accessibility test suite, CI/CD, and
  keyboard shortcuts / advanced persistence are all still on the roadmap. App
  Router (dev + production build) is verified — see [Next.js Setup](#nextjs-setup).
- Content inside `<iframe>`, `<canvas>`, and `<video>` does not clone
  meaningfully — the lens will show it blank or frozen.
- Cross-origin images may fail to repaint inside the cloned lens content due
  to browser same-origin restrictions on reading image data.
- The DOM-clone renderer re-clones (debounced, ~120ms) on DOM mutations;
  extremely fast-changing content (e.g. a live video feed, a canvas-based
  chart redrawing every frame) can appear briefly stale in the lens.
- `captureScreenshot()` requires the optional `html2canvas` peer dependency to
  be installed; without it, it throws with a clear error message pointing you
  to install it.

## Examples

- [`examples/react`](../../examples/react) — a Vite + React demo (dashboard
  content: header, sidebar, cards, a form, a table, an image, an SVG chart).
- [`examples/nextjs`](../../examples/nextjs) — the same idea on Next.js App
  Router, with a Server Component root layout and a plain Server Component
  page nested inside the client `ZoomProvider`/`ZoomLens` boundary.

```bash
npm install
npm run dev:react-example
npm run dev:nextjs-example
```

## Troubleshooting

**The lens shows the wrong content / looks offset.** Make sure you aren't
applying a CSS `transform` to an ancestor of your `source` element outside of
what the magnifier itself controls — nested transforms can throw off the
lens's coordinate math, which assumes `getBoundingClientRect()` reflects the
element's real screen position.

**`captureScreenshot()` rejects or throws.** Install the optional peer
dependency: `npm install html2canvas`.

**Duplicate-looking content in the lens.** If you pass a custom `source` that
contains the `ZoomLens` component itself (e.g. `document.body` when `ZoomLens`
is also a child of `<body>`, which is the default), the renderer automatically
excludes the lens's own DOM subtree from the clone to avoid this — no action
needed. If you see stale/duplicated content elsewhere, check for other
elements marked `data-zoom-magnifier-ignore` that may be unintentionally
nested.
