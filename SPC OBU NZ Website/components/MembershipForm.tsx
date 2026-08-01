"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function MembershipForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const details = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      city: form.get("city"),
      years: form.get("years"),
    };

    try {
      // Registration details are attached to the mail link as a fallback record;
      // payment is completed via Stripe Checkout.
      sessionStorage.setItem("spc-membership", JSON.stringify(details));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "membership_annual" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-gold/25 bg-white/[0.05] p-8 backdrop-blur-sm sm:p-10"
    >
      <h3 className="font-serif text-2xl text-gold-light">Membership Registration</h3>
      <div className="mt-8 grid gap-5">
        <div>
          <label className="label !text-white/60" htmlFor="m-name">Full Name *</label>
          <input id="m-name" name="name" required className="input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30" placeholder="Your full name" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label !text-white/60" htmlFor="m-email">Email *</label>
            <input id="m-email" name="email" type="email" required className="input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label !text-white/60" htmlFor="m-phone">Phone</label>
            <input id="m-phone" name="phone" type="tel" className="input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30" placeholder="+64…" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label !text-white/60" htmlFor="m-city">City in NZ *</label>
            <input id="m-city" name="city" required className="input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30" placeholder="Auckland" />
          </div>
          <div>
            <label className="label !text-white/60" htmlFor="m-years">Years at SPC</label>
            <input id="m-years" name="years" className="input !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30" placeholder="e.g. 1995–2008" />
          </div>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-gold mt-8 w-full disabled:opacity-60">
        {loading ? "Redirecting to payment…" : "Register & Pay — $50 NZD"}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <p className="mt-4 text-center text-[11px] text-white/40">
        Trouble joining? Email us at{" "}
        <a href={`mailto:${site.email}`} className="text-gold/70 hover:text-gold">{site.email}</a>
      </p>
    </form>
  );
}
