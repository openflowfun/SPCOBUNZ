import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Countdown from "@/components/Countdown";
import CheckoutButton from "@/components/CheckoutButton";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { gala, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming SPC OBU NZ events — Gala Dinner Dance 2026, Joe-Pete NZ Battle of the Saints, and more.",
};

const recurring = [
  {
    title: "Joe-Pete NZ · Battle of the Saints",
    desc: "The annual cricket encounter between Josephians and Peterites in New Zealand — a full day of sport, food and family fun.",
    tag: "Annual",
    href: "/joe-pete",
  },
  {
    title: "Peterite Family Day",
    desc: "A relaxed summer get-together for Peterite families — BBQ, games and fellowship under the Kiwi sun.",
    tag: "Annual",
  },
  {
    title: "College Feast Day Celebration",
    desc: "Marking the Feast of St. Peter with mass and fellowship, keeping our College traditions alive in NZ.",
    tag: "June",
  },
  {
    title: "Annual General Meeting",
    desc: "Members gather to reflect on the year, elect office bearers and shape the union's future.",
    tag: "Yearly",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHero eyebrow="Events" title={<>Where the brotherhood <span className="gold-text">comes together</span></>}>
        Mark your calendars — from black-tie evenings to family days, our events are the heartbeat
        of SPC OBU NZ.
      </PageHero>

      {/* Gala feature */}
      <section className="section bg-ivory">
        <div className="container-site">
          <Reveal>
            <div className="overflow-hidden rounded-3xl bg-navy-radial text-white shadow-[0_30px_80px_rgba(5,13,26,0.35)]">
              <div className="grid lg:grid-cols-5">
                <div className="p-10 sm:p-14 lg:col-span-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 text-gold">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                    Tickets on sale
                  </span>
                  <h2 className="heading-lg mt-6">
                    Gala Dinner <span className="gold-text">Dance 2026</span>
                  </h2>
                  <p className="mt-5 max-w-xl leading-relaxed text-white/70">
                    The premier evening on the SPC OBU NZ calendar. Join Peterites, families and
                    friends for a night of fine dining, live music and dancing — celebrating the
                    brotherhood in true Peterite style.
                  </p>
                  <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest2 text-gold/70">Date</dt>
                      <dd className="mt-1 font-medium text-white/90">{gala.dateLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest2 text-gold/70">Venue</dt>
                      <dd className="mt-1 font-medium text-white/90">{gala.venue}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest2 text-gold/70">Dress</dt>
                      <dd className="mt-1 font-medium text-white/90">Formal / Black tie</dd>
                    </div>
                  </dl>
                  <div className="mt-10">
                    <Countdown targetISO={gala.dateISO} dark />
                  </div>
                </div>

                {/* Ticket panel */}
                <div className="border-t border-gold/20 bg-white/[0.04] p-10 backdrop-blur-sm sm:p-14 lg:col-span-2 lg:border-l lg:border-t-0">
                  <p className="eyebrow">Tickets</p>
                  <div className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-gold/25 p-6">
                      <div className="flex items-baseline justify-between">
                        <p className="font-serif text-lg">Single Ticket</p>
                        <p className="font-serif text-3xl gold-text">${gala.price}</p>
                      </div>
                      <p className="mt-2 text-xs text-white/55">
                        Per person · dinner, entertainment &amp; dancing
                      </p>
                      <CheckoutButton product="gala_single" className="btn-gold mt-5 w-full">
                        Buy Tickets
                      </CheckoutButton>
                    </div>
                    <div className="rounded-2xl border border-gold/25 p-6">
                      <div className="flex items-baseline justify-between">
                        <p className="font-serif text-lg">Table of 10</p>
                        <p className="font-serif text-3xl gold-text">${gala.tablePrice.toLocaleString()}</p>
                      </div>
                      <p className="mt-2 text-xs text-white/55">
                        Reserve a full table for your crew &amp; family
                      </p>
                      <CheckoutButton product="gala_table" className="btn-outline mt-5 w-full">
                        Reserve a Table
                      </CheckoutButton>
                    </div>
                  </div>
                  <p className="mt-6 text-center text-[11px] text-white/40">
                    Secure payment via Stripe · Questions?{" "}
                    <a href={`mailto:${site.email}`} className="text-gold/70 hover:text-gold">
                      {site.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Recurring / past */}
      <section className="section bg-white">
        <div className="container-site">
          <Reveal className="text-center">
            <p className="eyebrow">Recurring &amp; Past Events</p>
            <h2 className="heading-lg mt-4 text-navy-800">A calendar full of tradition</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2">
            {recurring.map((e) => (
              <StaggerItem key={e.title}>
                <div className="card h-full">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl text-navy-800">{e.title}</h3>
                    <span className="shrink-0 rounded-full bg-navy-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
                      {e.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-navy-800/60">{e.desc}</p>
                  {e.href && (
                    <Link
                      href={e.href}
                      className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-dark hover:gap-3"
                    >
                      Learn more
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-14 text-center">
            <p className="text-navy-800/60">
              Photos from past events live in our{" "}
              <Link href="/gallery" className="font-semibold text-gold-dark underline-offset-4 hover:underline">
                Gallery
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
