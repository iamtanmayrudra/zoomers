import type { Metadata } from "next";
import {
  ZoomButton,
  ZoomControls,
  ZoomLens,
  ZoomProvider,
  ZoomScreenshotButton,
} from "react-zoom-magnifier";
import "react-zoom-magnifier/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zoom Magnifier — Next.js Demo",
  description: "Verifying react-zoom-magnifier inside Next.js App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ZoomProvider minZoom={1.5} maxZoom={4} step={0.5} defaultZoom={2}>
          <header className="app-header">
            <h1>Zoom Magnifier — Next.js Demo</h1>
            <div className="app-header-controls">
              <ZoomControls />
              <ZoomScreenshotButton />
              <ZoomButton />
            </div>
          </header>

          {children}

          <ZoomLens />
        </ZoomProvider>
      </body>
    </html>
  );
}
