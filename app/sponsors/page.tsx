import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "The generous sponsors behind SPC OBU NZ events — Joe-Pete NZ, Gala Dinner Dance and more.",
};

// Add sponsors here as they come on board:
// { name: "Company Name", tier: "Gold", logo: "/images/sponsors/company.png", url: "https://..." }
const sponsors: { name: string; tier: string; logo?: string; url?: string }[] = [];

const tiers = [
  {
    name: "Gold Sponsor",
    desc: "Premier branding across all major events, the website and event programmes.",
  },
  {
    name: "Silver Sponsor",
    desc: "Prominent placement at the Gala Dinner Dance and Joe-Pete NZ.",
  },
  {
    name: "Event Partner",
    desc: "Tailored packages supporting individual events and initiatives.",
  },
];

function PlaceholderLogo({ label }: { label: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-navy-800/15 bg-white/60 transition-all duration-300 hover:border-gold/50">
      <span className="text-xs font-semibold uppercase tracking-widest text-navy-800/35">
        {label}
      </span>
    </div>
  );
}

export default function SponsorsPage() {
  return (
    <>
      <PageHero eyebrow="Sponsors" title={<>Powered by <span className="gold-text">generous partners</span></>}>
        Our events are made possible by businesses and individuals who share our values. Thank you
        for backing the brotherhood.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site">
          <Reveal className="text-center">
            <p className="eyebrow">Our Sponsors</p>
            <h2 className="heading-lg mt-4 text-navy-800">
              Joe-Pete NZ · Gala Dinner Dance · Community Events
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-navy-800/60">
              Sponsor logos will appear here. Interested in supporting SPC OBU NZ? We&rsquo;d love
              to hear from you.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sponsors.length > 0
              ? sponsors.map((s) => (
                  <StaggerItem key={s.name}>
                    <a
                      href={s.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card flex h-32 items-center justify-center"
                    >
                      {s.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.logo} alt={s.name} className="max-h-16 object-contain" />
                      ) : (
                        <span className="font-serif text-lg text-navy-800">{s.name}</span>
                      )}
                    </a>
                  </StaggerItem>
                ))
              : [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <StaggerItem key={i}>
                    <PlaceholderLogo label={`Your logo here`} />
                  </StaggerItem>
                ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-navy-radial text-white">
        <div className="container-site">
          <Reveal className="text-center">
            <p className="eyebrow">Partner With Us</p>
            <h2 className="heading-lg mt-4">Sponsorship opportunities</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-3">
            {tiers.map((t) => (
              <StaggerItem key={t.name}>
                <div className="h-full rounded-2xl border border-gold/20 bg-white/[0.04] p-8 text-center backdrop-blur-sm transition-all hover:border-gold/50">
                  <span className="gold-rule mx-auto" />
                  <h3 className="mt-5 font-serif text-xl text-gold-light">{t.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{t.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-14 text-center">
            <a href={`mailto:${site.email}?subject=Sponsorship%20Enquiry`} className="btn-gold">
              Become a Sponsor
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
