import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — ENCOMM",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-orbit" aria-hidden="true"><i /><i /><span>404</span></div>
      <section>
        <Link className="not-found-brand" href="/en" aria-label="ENCOMM home">
          <img src="/encomm-logo-opt.webp" alt="" width="44" height="31" />
          <strong>ENCOMM</strong>
        </Link>
        <p>LOST SIGNAL / ΧΑΜΕΝΟ ΣΗΜΑ</p>
        <h1>THIS PATH<br /><em>ΔΕΝ ΥΠΑΡΧΕΙ.</em></h1>
        <div className="not-found-copy">
          <p>The page may have moved or the address may be incorrect.</p>
          <p>Η σελίδα μπορεί να μετακινήθηκε ή η διεύθυνση να μην είναι σωστή.</p>
        </div>
        <div className="not-found-actions">
          <Link href="/en">Return home <span aria-hidden="true">↗</span></Link>
          <Link href="/el">Επιστροφή στην αρχική <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <small>ENCOMM / SYSTEM STATUS · ΚΑΤΑΣΤΑΣΗ · 404</small>
    </main>
  );
}
