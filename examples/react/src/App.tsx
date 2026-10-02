import {
  ZoomButton,
  ZoomControls,
  ZoomLens,
  ZoomProvider,
  ZoomScreenshotButton,
} from "react-zoom-magnifier";
import "react-zoom-magnifier/styles.css";
import "./App.css";

export default function App() {
  return (
    <ZoomProvider minZoom={1.5} maxZoom={4} step={0.5} defaultZoom={2}>
      <div className="app-shell">
        <header className="app-header">
          <h1>Zoom Magnifier Demo</h1>
          <div className="app-header-controls">
            <ZoomControls />
            <ZoomScreenshotButton />
            <ZoomButton />
          </div>
        </header>

        <div className="app-body">
          <aside className="app-sidebar">
            <nav>
              <ul>
                <li>Dashboard</li>
                <li>Reports</li>
                <li>Customers</li>
                <li>Settings</li>
              </ul>
            </nav>
          </aside>

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
                <img
                  src="https://picsum.photos/seed/zoom-demo/160/80"
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
              <form onSubmit={(e) => e.preventDefault()}>
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
              <h2>Recent Orders</h2>
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#1042</td>
                    <td>Alice Chen</td>
                    <td>$89.00</td>
                    <td>Shipped</td>
                  </tr>
                  <tr>
                    <td>#1043</td>
                    <td>Rahul Verma</td>
                    <td>$214.50</td>
                    <td>Processing</td>
                  </tr>
                  <tr>
                    <td>#1044</td>
                    <td>Maria Garcia</td>
                    <td>$42.99</td>
                    <td>Delivered</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="panel">
              <h2>Notes</h2>
              <p>
                Move the pointer around this page while Zoom Mode is active. The lens should
                magnify exactly the content under the cursor &mdash; text, the chart lines,
                the thumbnail image, table cells, and form fields &mdash; with no offset.
                Try the viewport edges and corners too.
              </p>
            </section>
          </main>
        </div>

        <ZoomLens />
      </div>
    </ZoomProvider>
  );
}
