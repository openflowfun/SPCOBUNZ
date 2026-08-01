import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/home/Hero";
import Countdown from "@/components/Countdown";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { gala, site } from "@/lib/site";

const quickLinks = [
  {
    title: "Upcoming Events",
    href: "/events",
    desc: "From the Gala Dinner Dance to family days — see what's next on the Peterite calendar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Membership",
    href: "/membership",
    desc: "Join the brotherhood. Support the union and enjoy exclusive member benefits.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4a3.5 3.5 0 0 1 0 7M15.5 13.6A6.5 6.5 0 0 1 21.5 20" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Joe-Pete NZ",
    href: "/joe-pete",
    desc: "The Battle of the Saints lives on in New Zealand. Relive the greatest rivalry.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M12 3l2.4 4.8 5.3.8-3.8 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3L4.3 8.6l5.3-.8L12 3z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Committee",
    href: "/committee",
    desc: "Meet the office bearers guiding SPC OBU NZ through 2025/26.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Welcome */}
      <section className="section bg-ivory">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Welcome, Peterite</p>
            <h2 className="heading-lg mt-4 text-navy-800">
              A home away from home, <span className="gold-text">7,000 miles from Bambalapitiya</span>
            </h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-navy-800/70">
              Founded in {site.established}, SPC OBU New Zealand brings together old boys of St.
              Peter&rsquo;s College, Colombo 04 who now call Aotearoa home. Whether you left College
              last year or decades ago, this is your union — built on the friendships forged in the
              classrooms, playing fields and chapel of our beloved school by the sea.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              We gather to celebrate, to support one another, and to give back — to our community
              here in New Zealand and to the College that made us who we are.
            </p>
            <Link href="/about" className="btn-outline-navy mt-8">
              Our Story
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gold-gradient opacity-20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl shadow-card">
                <Image
                  src="/images/cover.jpg"
                  alt="SPC OBU New Zealand community"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 rounded-2xl border border-gold/30 bg-navy-900 px-6 py-4 shadow-gold sm:-left-8">
                <p className="font-serif text-3xl gold-text">Est. {site.established}</p>
                <p className="text-[10px] uppercase tracking-widest2 text-white/60">
                  Proudly Peterite in NZ
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick links */}
      <section className="section bg-white">
        <div className="container-site">
          <Reveal className="text-center">
            <p className="eyebrow">Explore the Union</p>
            <h2 className="heading-lg mt-4 text-navy-800">Everything Peterite, in one place</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((q) => (
              <StaggerItem key={q.href}>
                <Link href={q.href} className="card group block h-full">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-gold transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                    {q.icon}
                  </span>
                  <h3 className="mt-6 font-serif text-xl text-navy-800">{q.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-800/60">{q.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-dark transition-all group-hover:gap-3">
                    Discover
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured event */}
      <section className="relative overflow-hidden bg-navy-radial section text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-200px] top-[-150px] h-[500px] w-[500px] rounded-full bg-gold/[0.08] blur-3xl"
        />
        <div className="container-site relative">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">Featured Event</p>
              <h2 className="heading-lg mt-4">
                {gala.title.replace("SPC OBU NZ ", "")}
                <span className="gold-text block">An evening to remember</span>
              </h2>
              <div className="gold-rule mt-6" />
              <ul className="mt-8 space-y-4 text-white/80">
                <li className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
                    </svg>
                  </span>
                  {gala.dateLabel}
                </li>
                <li className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
                      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  {gala.venue}
                </li>
                <li className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5">
                      <path d="M12 2v20M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2 2.7 5 3.5 5 1.6 5 3.5-2.2 3-5 3-5-1.1-5-3" strokeLinecap="round" />
                    </svg>
                  </span>
                  ${gala.price} per person · Tables of 10 available
                </li>
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/events" className="btn-gold">
                  Get Tickets
                </Link>
                <Link href="/events" className="btn-outline">
                  Event Details
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-col items-center gap-8">
              <p className="text-xs uppercase tracking-widest2 text-gold/80">The countdown is on</p>
              <Countdown targetISO={gala.dateISO} dark />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Joe-Pete strip */}
      <section className="section bg-white">
        <div className="container-site">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-14 text-white sm:px-14">
              <div
                aria-hidden
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: "url(/images/flag.webp)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-900/60" />
              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                  <p className="eyebrow">The Greatest Rivalry</p>
                  <h2 className="heading-md mt-3">
                    Joe-Pete NZ · <span className="gold-text">Battle of the Saints</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-white/70">
                    A rivalry born in 1933, reborn in Aotearoa. Cricket, camaraderie and College
                    pride — the Battle of the Saints continues in New Zealand.
                  </p>
                </div>
                <Link href="/joe-pete" className="btn-gold shrink-0">
                  Explore Joe-Pete NZ
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="section bg-ivory">
        <div className="container-site text-center">
          <Reveal>
            <p className="eyebrow">Join Us</p>
            <h2 className="heading-lg mx-auto mt-4 max-w-3xl text-navy-800">
              Once a Peterite, <span className="gold-text">always a Peterite</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-navy-800/70">
              Your membership strengthens the union, funds our events and charitable causes, and
              keeps the Peterite spirit alive in New Zealand.
            </p>
            <Link href="/membership" className="btn-gold mt-10">
              Become a Member
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
