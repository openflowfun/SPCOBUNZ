import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Joe-Pete NZ | Battle of the Saints",
  description:
    "The Battle of the Saints comes to New Zealand — Joe-Pete NZ, the historic rivalry between St. Joseph's College and St. Peter's College.",
};

const facts = [
  { stat: "1933", label: "The first Joe-Pete encounter in Colombo" },
  { stat: "90+", label: "Years of the greatest schoolboy cricket rivalry" },
  { stat: "One Day", label: "Where blue meets blue, white and gold in NZ" },
];

export default function JoePetePage() {
  return (
    <>
      <PageHero
        eyebrow="Battle of the Saints"
        title={<>Joe-Pete <span className="gold-text">New Zealand</span></>}
      >
        The historic rivalry between St. Joseph&rsquo;s College and St. Peter&rsquo;s College —
        reborn under southern skies.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">The Rivalry</p>
            <h2 className="heading-lg mt-4 text-navy-800">
              Ninety years of cricket, <span className="gold-text">one unbreakable bond</span>
            </h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-navy-800/70">
              Since 1933, the annual &ldquo;Battle of the Saints&rdquo; between St. Joseph&rsquo;s
              College and St. Peter&rsquo;s College has been one of Sri Lanka&rsquo;s most beloved
              sporting traditions — two brother schools, one founder&rsquo;s legacy, and a rivalry
              played in the finest spirit of the game.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              Joe-Pete NZ brings that tradition to New Zealand. Each year, Josephians and Peterites
              across Aotearoa come together for a day of cricket, family festivities and friendship —
              proof that the Battle of the Saints is less about who wins, and more about what we
              share.
            </p>
            <a
              href={site.joePeteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-9"
            >
              Enter the Joe-Pete NZ Website
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gold-gradient opacity-20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl shadow-card">
                <Image
                  src="/images/flag.webp"
                  alt="St. Peter's College flag flying high"
                  width={1000}
                  height={563}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-navy-radial text-white">
        <div className="container-site">
          <Stagger className="grid gap-6 sm:grid-cols-3">
            {facts.map((f) => (
              <StaggerItem key={f.stat}>
                <div className="rounded-2xl border border-gold/20 bg-white/[0.04] p-10 text-center backdrop-blur-sm">
                  <p className="font-serif text-5xl gold-text">{f.stat}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{f.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-16 text-center">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70">
              Fixtures, results, tickets and the full story of the Battle of the Saints in New
              Zealand live on the dedicated Joe-Pete NZ website.
            </p>
            <a
              href={site.joePeteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-8"
            >
              Visit Joe-Pete NZ
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
