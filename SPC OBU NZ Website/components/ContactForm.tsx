"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Website enquiry from ${form.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${form.get("name")}\nEmail: ${form.get("email")}\n\n${form.get("message")}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="card !p-8 sm:!p-10">
      <div className="grid gap-5">
        <div>
          <label className="label" htmlFor="c-name">Name *</label>
          <input id="c-name" name="name" required className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email *</label>
          <input id="c-email" name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="c-message">Message *</label>
          <textarea id="c-message" name="message" required rows={5} className="input resize-none" placeholder="How can we help?" />
        </div>
      </div>
      <button type="submit" className="btn-gold mt-7 w-full">
        Send Message
      </button>
      {sent && (
        <p className="mt-4 text-center text-sm text-navy-800/60">
          Your email app should have opened — if not, write to us directly at{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-gold-dark">{site.email}</a>.
        </p>
      )}
    </form>
  );
}
