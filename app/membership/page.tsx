import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MembershipForm from "@/components/MembershipForm";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Become a member of SPC OBU New Zealand — join the Peterite brotherhood in Aotearoa.",
};

const benefits = [
  {
    title: "Priority Event Access",
    desc: "First access and member pricing for the Gala Dinner Dance, Joe-Pete NZ and all union events.",
  },
  {
    title: "A Voice in the Union",
    desc: "Vote at the AGM, stand for office, and help shape the direction of SPC OBU NZ.",
  },
  {
    title: "The Peterite Network",
    desc: "Connect with old boys across New Zealand — professionally, socially and in times of need.",
  },
  {
    title: "Giving Back",
    desc: "Your fees directly support union initiatives and charitable projects for St. Peter's College.",
  },
  {
    title: "Family Community",
    desc: "Membership embraces your whole family — from family days to the wider Peterite whānau.",
  },
  {
    title: "Global Recognition",
    desc: "Be part of the worldwide network of official St. Peter's College OBU branches.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title={<>Take your place in <span className="gold-text">the brotherhood</span></>}
      >
        Once a Peterite, always a Peterite. Formalise your bond with an annual membership of SPC OBU
        New Zealand.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site">
          <Reveal className="text-center">
            <p className="eyebrow">Why Join</p>
            <h2 className="heading-lg mt-4 text-navy-800">Membership benefits</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <StaggerItem key={b.title}>
                <div className="card h-full">
                  <span className="font-serif text-4xl gold-text">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-serif text-xl text-navy-800">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-800/60">{b.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-navy-radial text-white" id="join">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Join Now</p>
            <h2 className="heading-lg mt-4">
              Annual membership <span className="gold-text">$50 NZD</span>
            </h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-white/70">
              Complete the registration form and proceed to secure payment via Stripe. Your
              membership runs for one year from the date of joining and is open to all old boys of
              St. Peter&rsquo;s College, Colombo 04, residing in New Zealand.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {["Secure card payment via Stripe", "Instant confirmation by email", "Welcomed personally by the committee"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-navy-900">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {t}
                  </li>
                ),
              )}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <MembershipForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
