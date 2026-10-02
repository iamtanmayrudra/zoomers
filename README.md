# zoomer

Monorepo for **react-zoom-magnifier** — an application-level magnifier / zoom
lens for React and Next.js. Built from the plan in
[`react-nextjs-zoom-magnifier-master-plan.md`](react-nextjs-zoom-magnifier-master-plan.md).

```
zoomer/
├── packages/
│   └── react-zoom-magnifier/   the npm package — see its README for full docs
└── examples/
    └── react/                  runnable Vite demo app
```

## Getting started

```bash
npm install
npm run build                 # build the package
npm run test                  # run the package's unit tests
npm run dev:react-example     # start the demo app at http://localhost:5173
```

See [`packages/react-zoom-magnifier/README.md`](packages/react-zoom-magnifier/README.md)
for the full API reference, configuration options, accessibility notes,
limitations, and troubleshooting.

## Status

Milestone 1 of the master plan: core zoom engine, pointer tracking, the
DOM-clone lens renderer, the full React API, and a screenshot-capture feature
are implemented and manually verified against the demo app. Next.js
integration, full automated test suites (integration/E2E/visual
regression/accessibility), documentation polish, and CI/CD are still ahead —
see the master plan's Phase list and the package README's Limitations section.
