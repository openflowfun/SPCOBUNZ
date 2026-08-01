import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & History",
  description:
    "The story of SPC OBU New Zealand — established 2020, uniting old boys of St. Peter's College, Colombo 04 across Aotearoa.",
};

const values = [
  {
    title: "Brotherhood",
    desc: "The bonds formed at College are for life. We look after our own — through celebration and challenge alike.",
  },
  {
    title: "Legacy",
    desc: "We honour the traditions of St. Peter's College and pass the Peterite spirit to the next generation in New Zealand.",
  },
  {
    title: "Service",
    desc: "Virtus et Veritas calls us to give back — to our College, our communities, and those in need.",
  },
  {
    title: "Community",
    desc: "From Auckland to Christchurch, we create spaces where Peterite families connect and belong.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Us" title={<>Our Story, <span className="gold-text">Our Legacy</span></>}>
        Established in {site.established}, SPC OBU New Zealand is the official chapter of the St.
        Peter&rsquo;s College Old Boys&rsquo; Union for Peterites who call Aotearoa home.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Est. {site.established}</p>
            <h2 className="heading-lg mt-4 text-navy-800">From Colombo 04 to Aotearoa</h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-navy-800/70">
              St. Peter&rsquo;s College, Colombo 04, has shaped generations of young men since 1922
              under the motto <em>Virtus et Veritas</em> — Virtue and Truth. As Peterites made new
              lives across the world, the bonds of College followed them.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              In {site.established}, a group of old boys in New Zealand came together to formally
              establish SPC OBU New Zealand — creating a home for the growing Peterite community
              across the country. What began as reunions among friends has grown into a thriving
              union hosting the Gala Dinner Dance, the Joe-Pete NZ Battle of the Saints, family
              events, and charitable initiatives supporting our alma mater.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              Today, we proudly stand alongside our mother OBU in Sri Lanka and sister branches
              worldwide — one global brotherhood, united by the blue, white and gold.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid gap-6">
              <div className="relative overflow-hidden rounded-3xl shadow-card">
                <Image
                  src="/images/crest.jpg"
                  alt="St. Peter's College crest"
                  width={900}
                  height={600}
                  className="h-72 w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="card !p-6 text-center">
                  <p className="font-serif text-4xl gold-text">1922</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-navy-800/60">
                    College Founded
                  </p>
                </div>
                <div className="card !p-6 text-center">
                  <p className="font-serif text-4xl gold-text">{site.established}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-navy-800/60">
                    NZ Union Established
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-navy-radial text-white">
        <div className="container-site">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Our Mission</p>
            <h2 className="heading-lg mt-4">
              To unite, celebrate and serve the <span className="gold-text">Peterite community</span> in
              New Zealand
            </h2>
            <p className="mt-6 leading-relaxed text-white/70">
              We exist to keep old boys connected to one another and to St. Peter&rsquo;s College —
              fostering fellowship, supporting members and their families, and contributing to
              causes that reflect the values our College instilled in us.
            </p>
          </Reveal>
          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-2xl border border-gold/20 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-white/[0.07]">
                  <span className="gold-rule" />
                  <h3 className="mt-5 font-serif text-xl text-gold-light">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Mother OBU */}
      <section className="section bg-white">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/images/flag.webp"
                alt="St. Peter's College flag"
                width={1000}
                height={563}
                className="w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow">One Global Family</p>
            <h2 className="heading-lg mt-4 text-navy-800">
              Connected to the <span className="gold-text">mother OBU</span> in Sri Lanka
            </h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-navy-800/70">
              SPC OBU New Zealand operates in close partnership with the St. Peter&rsquo;s College
              Old Boys&rsquo; Union in Colombo — the mother union that has served the College for
              over a century. Our Patron, Rev. Fr. Rohitha Rodrigo, Rector of St. Peter&rsquo;s
              College, and Vice Patron Asoka Attapattu, current President of the Sri Lanka OBU,
              embody that living connection.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              Together with branches across Australia, the UK, Canada and beyond, we form a global
              network of Peterites supporting the College and each other, wherever life has taken us.
            </p>
            <Link href="/committee" className="btn-outline-navy mt-8">
              Meet Our Committee
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
