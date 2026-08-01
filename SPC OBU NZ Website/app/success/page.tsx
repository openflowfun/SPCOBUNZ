import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <section className="flex min-h-screen items-center bg-navy-radial text-white">
      <div className="container-site py-40 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient text-navy-900 shadow-gold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-9 w-9">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="heading-xl mt-8">
          Thank you, <span className="gold-text">Peterite!</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Your payment was successful. A receipt has been emailed to you by Stripe, and our
          committee will be in touch with confirmation details shortly.
        </p>
        <p className="mt-4 text-sm text-white/50">
          Questions? <a href={`mailto:${site.email}`} className="text-gold/80 hover:text-gold">{site.email}</a>
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-gold">Back to Home</Link>
          <Link href="/events" className="btn-outline">More Events</Link>
        </div>
      </div>
    </section>
  );
}
