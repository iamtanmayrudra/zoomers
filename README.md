# zoomer

Monorepo for **react-zoom-magnifier** — an application-level magnifier / zoom
lens for React and Next.js.

```
zoomer/
├── packages/
│   └── react-zoom-magnifier/   the npm package — see its README for full docs
└── examples/
    ├── react/                  runnable Vite demo app
    └── nextjs/                 runnable Next.js (App Router) demo app
```

## Getting started

```bash
npm install
npm run build                 # build the package
npm run test                  # run the package's unit tests
npm run dev:react-example     # start the Vite demo at http://localhost:5173
npm run dev:nextjs-example    # start the Next.js demo at http://localhost:3000
```

See [`packages/react-zoom-magnifier/README.md`](packages/react-zoom-magnifier/README.md)
for the full API reference, configuration options, accessibility notes,
limitations, and troubleshooting.

## Status

Milestone 1: core zoom engine, pointer tracking, the DOM-clone lens renderer,
the full React API, and a screenshot-capture feature are implemented and
manually verified against both demo apps. Next.js App Router support is
confirmed working in both `next dev` and a production `next build`/`next
start` (a Server Component root layout rendering the client
`ZoomProvider`/`ZoomLens` boundary around a plain Server Component page, with
no hydration errors). Pages Router verification, full automated test suites
(integration/E2E/visual regression/accessibility), documentation polish, and
CI/CD are still ahead — see the package README's Limitations section.
