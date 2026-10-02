# React / Next.js Zoom Magnifier Package — Master Development Plan

## 1. Product Overview

### Product concept

Build a reusable React/Next.js package that provides an **application-level magnifier / zoom lens**.

The user clicks a Zoom icon and enters Zoom Mode. Once enabled:

1. The user moves the mouse across the application.
2. A magnifier lens follows the pointer.
3. The content visually underneath the pointer is magnified.
4. The user can change the magnification level.
5. The user can disable Zoom Mode at any time.
6. On touch devices, the lens follows a finger/stylus interaction.

### Core product statement

> A React/Next.js magnification toolkit that lets users activate a zoom lens and inspect any area of an application by moving the pointer or finger over the UI.

---

# 2. Goals

## Primary goals

- Provide a simple Zoom activation control.
- Allow users to move the magnifier anywhere in the application.
- Magnify the visual area underneath the lens.
- Support configurable zoom levels.
- Support mouse, pointer, and touch interaction.
- Work with React and Next.js.
- Avoid unnecessary React re-renders during pointer movement.
- Handle viewport boundaries correctly.
- Provide accessible controls.
- Provide a reusable and configurable npm package.

## Secondary goals

- Provide multiple lens shapes.
- Provide customizable controls.
- Support React applications and Next.js App Router.
- Support Next.js Pages Router where practical.
- Provide a demo application.
- Provide automated QA.
- Provide documentation and examples.
- Provide CI/CD and npm publishing.

## Non-goals for the first version

- Replacing browser-native zoom.
- Automatically zooming the entire application.
- Automatically changing every design token.
- Providing a full accessibility suite beyond magnification.
- Guaranteeing identical behavior for every browser-specific rendering technology.

---

# 3. User Experience

## Default user flow

```text
Application
    |
    v
User sees Zoom icon
    |
    v
Click Zoom icon
    |
    v
Zoom Mode enabled
    |
    v
Move pointer around application
    |
    v
Magnifier follows pointer
    |
    v
Content underneath lens is magnified
    |
    v
User changes zoom level if required
    |
    v
Click Zoom icon again
    |
    v
Zoom Mode disabled
```

## Desktop interaction

```text
          Pointer
             |
             v
     +---------------+
     |   ZOOM 2X     |
     |               |
     |  Content      |
     |  under cursor |
     +---------------+
```

## Touch interaction

```text
Tap Zoom
    |
    v
Zoom Mode enabled
    |
    v
Touch / drag finger
    |
    v
Magnifier follows touch position
```

The touch interaction must not interfere with normal scrolling unless the user intentionally enters a magnification interaction.

---

# 4. UI Requirements

## 4.1 Zoom Button

Default appearance:

```text
+-------+
|   🔍  |
+-------+
```

Active state:

```text
+-------+
|   🔎  |
+-------+
```

The control must have an accessible label such as:

```text
Activate zoom
Deactivate zoom
```

## 4.2 Zoom Control Placement

Support:

- top-left
- top-right
- bottom-left
- bottom-right
- custom positioning

Example:

```tsx
<ZoomButton position="bottom-right" />
```

## 4.3 Zoom Controls

Optional controls:

```text
+----------------+
|  -   2x   +    |
+----------------+
```

Actions:

- Increase magnification
- Decrease magnification
- Show current zoom
- Reset zoom

## 4.4 Lens Shapes

Support:

- circle
- square
- rounded rectangle

Example:

```tsx
<ZoomLens shape="circle" />
```

## 4.5 Lens Size

Allow configuration:

```tsx
<ZoomLens size={200} />
```

Possible configuration:

```ts
minSize?: number;
maxSize?: number;
size?: number;
```

## 4.6 Lens Border

Allow:

- border width
- border style
- shadow
- radius
- custom className

Example:

```tsx
<ZoomLens
  size={200}
  borderWidth={2}
  shadow
/>
```

---

# 5. Zoom Levels

Recommended defaults:

```text
1.5x
2x
2.5x
3x
4x
```

Example:

```tsx
<ZoomMagnifier
  minZoom={1.5}
  maxZoom={4}
  step={0.5}
/>
```

The package must prevent zoom values outside configured boundaries.

---

# 6. Functional Requirements

## FR-001 — Activate Zoom

The user must be able to activate Zoom Mode through a visible control.

## FR-002 — Deactivate Zoom

The user must be able to deactivate Zoom Mode through the same control or configured close action.

## FR-003 — Pointer Tracking

The magnifier must follow pointer movement while Zoom Mode is active.

## FR-004 — Magnification

The area underneath the lens must be rendered at the configured magnification.

## FR-005 — Zoom Level

The user must be able to increase and decrease magnification.

## FR-006 — Reset

The package must provide a reset mechanism.

## FR-007 — Boundary Handling

The lens must remain usable when the pointer reaches:

- top edge
- bottom edge
- left edge
- right edge
- corners

## FR-008 — Touch Support

Touch/pointer interaction must be supported on compatible devices.

## FR-009 — Configuration

Developers must be able to configure the package without modifying the package source.

## FR-010 — Persistence

Optional persistence should allow the selected zoom level to survive navigation or refresh.

---

# 7. Technical Architecture

```text
                    Application
                         |
                         v
                  ZoomProvider
                         |
                +--------+--------+
                |                 |
                v                 v
           Zoom State       Configuration
                |
                v
          Zoom Controller
                |
        +-------+--------+
        |                |
        v                v
 Pointer Tracker    Zoom Renderer
        |                |
        v                v
   x / y position     Lens Output
        |                |
        +-------+--------+
                |
                v
          Magnifier Lens
```

---

# 8. Recommended Package Architecture

```text
react-zoom-magnifier/
|
├── src/
│   ├── components/
│   │   ├── ZoomButton/
│   │   ├── ZoomLens/
│   │   └── ZoomControls/
│   │
│   ├── context/
│   │   └── ZoomProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useZoom.ts
│   │   └── usePointerPosition.ts
│   │
│   ├── core/
│   │   ├── zoom-engine.ts
│   │   ├── zoom-calculator.ts
│   │   ├── lens-position.ts
│   │   └── zoom-storage.ts
│   │
│   ├── renderers/
│   │   ├── renderer.ts
│   │   ├── dom-renderer.ts
│   │   └── canvas-renderer.ts
│   │
│   ├── styles/
│   │   └── zoom.css
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── index.ts
│
├── examples/
│   ├── react/
│   └── nextjs/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── accessibility/
│   └── visual/
│
├── docs/
│
├── README.md
├── CHANGELOG.md
├── LICENSE
└── package.json
```

---

# 9. React API Design

## 9.1 Provider

```tsx
<ZoomProvider
  minZoom={1.5}
  maxZoom={4}
  step={0.5}
  defaultZoom={2}
  persist
>
  <App />
</ZoomProvider>
```

## 9.2 Hook

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
  toggle
} = useZoom();
```

## 9.3 Components

Potential API:

```tsx
<ZoomButton />

<ZoomControls />

<ZoomLens />

<ZoomMagnifier />
```

Combined usage:

```tsx
<ZoomProvider>
  <ZoomButton />
  <ZoomControls />
  <ZoomLens />
  <Application />
</ZoomProvider>
```

---

# 10. Configuration API

Example:

```ts
type ZoomConfig = {
  minZoom: number;
  maxZoom: number;
  step: number;
  defaultZoom: number;

  lensSize?: number;
  lensShape?: "circle" | "square" | "rounded";

  persist?: boolean;
  storageKey?: string;

  keyboardShortcuts?: boolean;
  touchEnabled?: boolean;

  showControls?: boolean;
};
```

The API should remain backwards compatible after release.

---

# 11. Rendering Strategy

The main technical challenge is rendering arbitrary application content inside the magnifier.

Possible strategies:

## Strategy A — DOM clone

```text
Original DOM
     |
     +-----------> Normal Application
     |
     +-----------> Zoom Clone
                         |
                         v
                       Scale
                         |
                         v
                       Lens
```

Advantages:

- Can work with HTML/CSS content.
- Can preserve text rendering.
- Can potentially handle dynamic UI.

Challenges:

- Cloning arbitrary DOM is complex.
- Event behavior must be prevented in the clone.
- Fixed/sticky elements require special handling.
- Portals and external layers can be difficult.

## Strategy B — Canvas/screenshot rendering

```text
DOM
 |
 v
Capture
 |
 v
Canvas
 |
 v
Crop source area
 |
 v
Scale
 |
 v
Lens
```

Advantages:

- Natural magnification effect.
- Easy cropping/scaling model.

Challenges:

- Dynamic content.
- Cross-origin content.
- Canvas limitations.
- Capture performance.
- Accessibility implications.

## Strategy C — Rendering adapter

Prefer designing the architecture so the core API is independent of the renderer.

```text
                  Zoom API
                     |
                     v
              Zoom Controller
                     |
                     v
            Rendering Adapter
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
      DOM         Canvas        Future
    Renderer      Renderer      Renderer
```

The first production implementation should be selected after a technical proof of concept.

---

# 12. Next.js Requirements

The package must be compatible with Next.js.

Important browser APIs include:

```text
window
document
Pointer Events
requestAnimationFrame
DOM measurements
```

Therefore, browser-dependent logic must remain client-side.

Do not require the entire application to become a client component.

Preferred architecture:

```text
Next.js Server Components
          |
          v
Client ZoomProvider boundary
          |
          v
Zoom UI / interaction layer
```

The package should be tested with:

- Next.js App Router
- Next.js Pages Router where practical
- React client rendering
- SSR/hydration scenarios

---

# 13. Performance Architecture

Pointer movement can generate a very high number of events.

Avoid:

```text
pointermove
   |
   v
setState()
   |
   v
React render
   |
   v
pointermove
   |
   v
setState()
```

Preferred model:

```text
Pointer Event
     |
     v
Store latest coordinates
     |
     v
requestAnimationFrame
     |
     v
Update lens
```

Performance requirements:

- Do not trigger unnecessary application-wide React renders.
- Avoid expensive DOM queries on every pointer event.
- Cache stable measurements where possible.
- Use `requestAnimationFrame` for visual updates.
- Clean up all event listeners.
- Avoid memory leaks.
- Keep the magnifier responsive on large pages.

---

# 14. Responsive Requirements

The package must work across:

```text
Desktop
Tablet
Mobile
```

Test zoom functionality at:

```text
1.5x
2x
2.5x
3x
4x
```

Test at:

```text
Top-left
Top-center
Top-right
Center-left
Center
Center-right
Bottom-left
Bottom-center
Bottom-right
```

The lens must not produce:

- blank areas
- incorrect source offsets
- clipping
- unexpected page scroll
- incorrect scaling

---

# 15. Mobile / Touch UX

Desktop:

```text
Click Zoom
   |
Move pointer
   |
Lens follows pointer
```

Touch:

```text
Tap Zoom
   |
Touch / drag
   |
Lens follows touch
```

Requirements:

- Touch target must be large enough.
- Zoom control must be easy to deactivate.
- Magnifier must not accidentally block normal interaction.
- Scrolling behavior must be considered.
- Pointer Events should be preferred where appropriate.

---

# 16. Accessibility Requirements

## Zoom control

Every interactive control must have an accessible name.

Examples:

```html
<button aria-label="Activate zoom">
```

and:

```html
<button aria-label="Deactivate zoom">
```

## Zoom level

The current level should be communicated meaningfully.

Example:

```text
Zoom level: 2x
```

## Keyboard

Potential controls:

```text
Tab
Enter
Space
Escape
Arrow keys
```

Keyboard shortcut support should be configurable.

## Focus

- Focus must remain visible.
- Zoom controls must be keyboard reachable.
- Deactivating zoom must not unexpectedly lose focus.

---

# 17. Browser Compatibility

The package should define supported browsers explicitly.

Initial target:

- Modern Chrome
- Modern Edge
- Modern Firefox
- Modern Safari
- Modern mobile Safari
- Modern Android browsers

Browser-specific limitations should be documented.

---

# 18. Demo Application

Create a dedicated demo application.

The demo should contain:

```text
Dashboard
|
├── Header
├── Sidebar
├── Cards
├── Buttons
├── Forms
├── Table
├── Modal
├── Dropdown
├── Tooltip
├── Images
├── SVG icons
├── Chart
├── Video
└── Long text
```

This demo is both:

1. Product demonstration.
2. QA reference application.

---

# 19. QA Strategy

QA must cover five major layers.

## 19.1 Unit Testing

Test:

- Zoom calculations
- Min/max boundaries
- Step calculation
- Default zoom
- Reset
- Zoom state
- Lens position calculation
- Boundary calculation
- Configuration validation

Example:

```text
setZoom(2)
Expected: 2

increaseZoom()
Expected: 2.5

decreaseZoom()
Expected: 2

resetZoom()
Expected: defaultZoom
```

## 19.2 Component Testing

Test:

- ZoomButton
- ZoomControls
- ZoomLens
- ZoomProvider

Example:

```text
Click Zoom
Expected: Zoom Mode ON

Click again
Expected: Zoom Mode OFF
```

## 19.3 Integration Testing

Test:

```text
ZoomProvider
+
Zoom Controller
+
Pointer Tracker
+
Renderer
+
Demo UI
```

Verify that the correct content appears in the lens.

## 19.4 E2E Testing

Example:

```text
Open application
    |
Click Zoom
    |
Move pointer
    |
Verify lens appears
    |
Move pointer to another area
    |
Verify lens follows
    |
Change zoom
    |
Verify magnification changes
    |
Click Zoom again
    |
Verify lens disappears
```

## 19.5 Visual Regression

Take screenshots for:

```text
1.5x
2x
2.5x
3x
4x
```

and:

```text
Desktop
Tablet
Mobile
```

Compare against approved reference screenshots.

---

# 20. QA Test Matrix

| Area | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Zoom activation | ✓ | ✓ | ✓ |
| Zoom deactivation | ✓ | ✓ | ✓ |
| Pointer movement | ✓ | ✓ | — |
| Touch movement | — | ✓ | ✓ |
| 1.5x | ✓ | ✓ | ✓ |
| 2x | ✓ | ✓ | ✓ |
| 2.5x | ✓ | ✓ | ✓ |
| 3x | ✓ | ✓ | ✓ |
| 4x | ✓ | ✓ | ✓ |
| Boundary handling | ✓ | ✓ | ✓ |
| Keyboard | ✓ | ✓ | Optional |
| Accessibility | ✓ | ✓ | ✓ |
| Performance | ✓ | ✓ | ✓ |

---

# 21. Content Compatibility Testing

The magnifier must be tested against:

```text
Text
Images
Buttons
Forms
Cards
Tables
Dropdowns
Modal
Tooltip
Toast
SVG
Canvas
Video
Charts
Sticky header
Fixed sidebar
Scrollable containers
Long content
```

Special attention should be given to:

- CSS transforms
- overflow containers
- fixed positioning
- sticky positioning
- z-index
- portals
- iframes
- canvas
- video
- cross-origin images

Unsupported cases must be documented rather than silently producing incorrect results.

---

# 22. Security Considerations

The package should not:

- Send application content to external servers.
- Capture or upload screenshots remotely.
- Store sensitive page content.
- Collect user data.

The default implementation should operate entirely in the browser.

If a future implementation uses a rendering/capture dependency, its security and privacy implications must be reviewed.

---

# 23. Development Phases

## Phase 1 — Product & UX Definition

Deliverables:

- Product requirements
- User flow
- UI states
- Desktop interaction
- Mobile interaction
- Accessibility requirements

## Phase 2 — Technical Proof of Concept

Build a small prototype to answer:

> Can arbitrary application content be magnified accurately and smoothly?

Test at least two rendering approaches.

Deliverable:

```text
Working magnifier prototype
```

## Phase 3 — Core Zoom Engine

Implement:

- Zoom state
- Zoom levels
- Min/max
- Step
- Reset
- Configuration

## Phase 4 — Pointer Engine

Implement:

- Pointer tracking
- Touch tracking
- Boundary calculation
- requestAnimationFrame updates

## Phase 5 — Magnifier Renderer

Implement selected rendering architecture.

## Phase 6 — React API

Implement:

- ZoomProvider
- useZoom
- ZoomButton
- ZoomControls
- ZoomLens

## Phase 7 — Next.js Integration

Test:

- App Router
- Pages Router
- SSR
- hydration
- client boundaries

## Phase 8 — Accessibility

Implement and test:

- ARIA
- keyboard navigation
- focus management
- screen reader announcements

## Phase 9 — Performance

Optimize:

- pointer tracking
- rendering
- DOM measurements
- React re-rendering
- memory usage

## Phase 10 — QA

Implement:

- unit tests
- component tests
- integration tests
- E2E tests
- visual regression
- accessibility testing
- browser testing

## Phase 11 — Documentation

Create:

- README
- API documentation
- installation guide
- React example
- Next.js example
- configuration guide
- troubleshooting
- browser support

## Phase 12 — Release

Prepare:

- package metadata
- semantic version
- changelog
- CI/CD
- npm publish
- release notes

---

# 24. Recommended Git Branch Strategy

```text
main
 |
 +-- develop
      |
      +-- feature/zoom-engine
      +-- feature/zoom-button
      +-- feature/pointer-tracking
      +-- feature/zoom-lens
      +-- feature/touch-support
      +-- feature/accessibility
      +-- test/e2e
      +-- docs/readme
```

Pull requests should run automated checks.

---

# 25. CI/CD Pipeline

```text
Developer
    |
    v
Git Push
    |
    v
Pull Request
    |
    +---- Lint
    |
    +---- Type Check
    |
    +---- Unit Tests
    |
    +---- Build
    |
    +---- Integration Tests
    |
    +---- E2E Tests
    |
    +---- Accessibility Tests
    |
    +---- Visual Regression
    |
    v
Review
    |
    v
Merge
    |
    v
Release Pipeline
    |
    v
npm Publish
```

---

# 26. Documentation Structure

README should contain:

```text
React Zoom Magnifier
|
├── Overview
├── Features
├── Installation
├── Quick Start
├── React Setup
├── Next.js Setup
├── ZoomProvider
├── useZoom
├── ZoomButton
├── ZoomLens
├── ZoomControls
├── Configuration
├── Zoom Levels
├── Touch Support
├── Keyboard Support
├── Accessibility
├── Performance
├── Browser Support
├── Limitations
├── Examples
├── Troubleshooting
└── API Reference
```

---

# 27. Acceptance Criteria

The MVP is ready when all of the following are true:

## Core

- [ ] User can activate Zoom Mode.
- [ ] User can deactivate Zoom Mode.
- [ ] Magnifier follows pointer.
- [ ] Magnifier displays the correct source area.
- [ ] Magnification level can be changed.
- [ ] Reset works.
- [ ] Minimum and maximum zoom are enforced.

## UI

- [ ] Zoom button is customizable.
- [ ] Lens shape is configurable.
- [ ] Lens size is configurable.
- [ ] Controls are responsive.
- [ ] Lens works at viewport boundaries.

## Mobile

- [ ] Touch interaction works.
- [ ] Lens follows touch position.
- [ ] Normal scrolling remains usable.

## Next.js

- [ ] Works with App Router.
- [ ] Does not require the entire app to become client-rendered.
- [ ] No hydration errors.
- [ ] Browser APIs are accessed only on the client.

## Accessibility

- [ ] Zoom button has accessible name.
- [ ] Controls are keyboard accessible.
- [ ] Focus remains visible.
- [ ] Zoom state is communicated appropriately.

## Performance

- [ ] Pointer movement does not cause unnecessary application-wide renders.
- [ ] requestAnimationFrame is used for visual updates where appropriate.
- [ ] Event listeners are cleaned up.
- [ ] No obvious memory leaks.

## QA

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] Accessibility tests pass.
- [ ] Visual regression tests pass.
- [ ] Supported browsers pass.

---

# 28. MVP Scope

The first release should stay focused.

### MVP must include

```text
✓ Zoom Button
✓ Zoom ON/OFF
✓ Pointer tracking
✓ Magnifier lens
✓ 1.5x–4x zoom
✓ Zoom controls
✓ Boundary handling
✓ React API
✓ Next.js support
✓ Touch support
✓ Basic accessibility
✓ Unit tests
✓ E2E tests
✓ Demo application
✓ Documentation
```

### Post-MVP

```text
Future:

- Multiple lens modes
- Advanced keyboard shortcuts
- Custom rendering adapters
- Advanced persistence
- Magnifier presets
- Advanced accessibility tools
- Additional framework adapters
- Performance profiling tools
```

---

# 29. Important Technical Decision

Before implementing the complete package, build a **Proof of Concept (POC)**.

The POC must compare at least:

```text
DOM Clone
vs
Canvas/Screenshot
```

Evaluate each against:

| Criteria | DOM Clone | Canvas |
|---|---:|---:|
| Text quality | TBD | TBD |
| Images | TBD | TBD |
| Forms | TBD | TBD |
| Dynamic UI | TBD | TBD |
| Performance | TBD | TBD |
| Cross-browser | TBD | TBD |
| Implementation complexity | TBD | TBD |
| Accessibility | TBD | TBD |
| Fixed elements | TBD | TBD |
| Sticky elements | TBD | TBD |

The final rendering approach should be selected from the POC results.

---

# 30. Final Product Architecture

```text
                         React / Next.js App
                                  |
                                  v
                           ZoomProvider
                                  |
                   +--------------+--------------+
                   |                             |
                   v                             v
              Zoom State                  Configuration
                   |
                   v
             Zoom Controller
                   |
          +--------+--------+
          |                 |
          v                 v
   Pointer Tracker     Zoom Controls
          |
          v
    x / y position
          |
          v
    Rendering Adapter
          |
     +----+-----+
     |          |
     v          v
    DOM       Canvas
  Renderer    Renderer
     |          |
     +----+-----+
          |
          v
      Zoom Lens
          |
          v
      User View
```

---

# 31. Definition of Done

The project is considered complete for its initial release when:

1. The package can be installed from npm.
2. A developer can integrate it into a React application with minimal configuration.
3. A developer can integrate it into a Next.js application.
4. A user can activate the magnifier with one click/tap.
5. The lens follows the pointer/touch position.
6. The correct visual content underneath the lens is magnified.
7. Zoom levels are configurable.
8. The experience works on supported desktop and mobile browsers.
9. Accessibility requirements are satisfied.
10. Performance is acceptable on realistic applications.
11. Automated tests protect the core behavior.
12. A demo application demonstrates supported scenarios.
13. Documentation explains installation, API, limitations, and troubleshooting.
14. CI/CD validates pull requests and release builds.

---

# 32. Recommended Implementation Order

Use this exact order for development:

```text
01. Requirements
       ↓
02. UI/UX prototype
       ↓
03. Rendering POC
       ↓
04. Select rendering strategy
       ↓
05. Zoom state engine
       ↓
06. Pointer tracking
       ↓
07. Lens renderer
       ↓
08. Zoom controls
       ↓
09. React Provider + Hook
       ↓
10. Touch support
       ↓
11. Next.js integration
       ↓
12. Accessibility
       ↓
13. Performance optimization
       ↓
14. Demo application
       ↓
15. Unit tests
       ↓
16. Integration tests
       ↓
17. E2E tests
       ↓
18. Visual regression
       ↓
19. Documentation
       ↓
20. CI/CD
       ↓
21. npm release
```

---

# 33. Project Principle

The package should always prioritize:

```text
Accuracy
   >
User experience
   >
Performance
   >
Accessibility
   >
Configurability
   >
Visual customization
```

The most important requirement is not simply making something larger.

The package must make the user feel that they are using a **real digital magnifying glass** over the application.
