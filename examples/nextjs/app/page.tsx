import Image from "next/image";

// Deliberately a plain Server Component (no "use client") rendered as a child
// of the client ZoomProvider/ZoomLens boundary in app/layout.tsx — the thing
// this example exists to verify.
export default function Home() {
  return (
    <main className="app-main">
      <section className="card-grid">
        <div className="card">
          <h2>Revenue</h2>
          <p className="stat">$128,430</p>
          <svg width="160" height="60" viewBox="0 0 160 60" aria-hidden="true">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points="0,50 20,40 40,45 60,20 80,30 100,10 120,18 140,5 160,15"
            />
          </svg>
        </div>
        <div className="card">
          <h2>Active Users</h2>
          <p className="stat">4,207</p>
          <Image
            src="https://picsum.photos/seed/zoom-nextjs-demo/160/80"
            width={160}
            height={80}
            alt="Sample usage chart thumbnail"
          />
        </div>
        <div className="card">
          <h2>Signups</h2>
          <p className="stat">312</p>
          <button type="button">View details</button>
        </div>
      </section>

      <section className="panel">
        <h2>Create Account</h2>
        <form>
          <label>
            Name
            <input type="text" placeholder="Jane Doe" />
          </label>
          <label>
            Email
            <input type="email" placeholder="jane@example.com" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="panel">
        <h2>Notes</h2>
        <p>
          This page is a plain Next.js Server Component (no &quot;use
          client&quot;). It is rendered as a child of the client-side
          ZoomProvider/ZoomLens boundary in the root layout — confirming the
          master plan&apos;s requirement that the package not force the whole
          app to become client-rendered.
        </p>
      </section>
    </main>
  );
}
