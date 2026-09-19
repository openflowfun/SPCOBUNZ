import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Crest, Flag & Anthem",
  description:
    "The Peterite Crest, motto, flag and College Anthem of St. Peter's College, Colombo 04 - the symbols every Peterite carries with them.",
};

const symbols = [
  {
    title: "The Cross",
    desc: "Set right at the top of the Crest, the Cross keeps Christ and His teaching at the centre of everything the College stands for.",
    icon: <path d="M12 3v18M7 8h10" />,
  },
  {
    title: "Two Elephants",
    desc: "Holding the Cross aloft, the two elephants root the College's faith firmly in Sri Lankan soil and honour people of every faith and background.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
      </>
    ),
  },
  {
    title: "The Bible & Palms",
    desc: "At the base, an open book carries the College's guiding words, flanked by two palms recalling Christ's triumphant entry into Jerusalem.",
    icon: (
      <>
        <path d="M12 6c-2-1.5-5-2-8-1v13c3-1 6-.5 8 1 2-1.5 5-2 8-1V5c-3-1-6-.5-8 1Z" />
        <path d="M12 6v13" />
      </>
    ),
  },
  {
    title: "Papal Crown & Keys",
    desc: "The upper half carries the papal tiara and the crossed keys of Heaven - the same keys entrusted to St Peter, the College's patron and first Pope.",
    icon: <path d="M4 18h16M4 18l-1-9 5 4 4-7 4 7 5-4-1 9" />,
  },
  {
    title: "The Motto Plaque",
    desc: "Anchoring the Crest at its base, a plaque bears the College motto - the standard every Peterite carries into the world.",
    icon: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M9 4h6l-1 3h-4Z" />
      </>
    ),
  },
];

export default function CrestFlagAnthemPage() {
  return (
    <>
      <PageHero eyebrow="About Us" title={<>Crest, Flag <span className="gold-text">&amp; Anthem</span></>}>
        The symbols and song every Peterite carries with them &mdash; from Colombo 04 to Aotearoa.
      </PageHero>

      {/* Crest */}
      <section className="section bg-ivory">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white p-10 shadow-card">
              <Image
                src="/images/crest-spc-cutout.png"
                alt="St. Peter's College crest"
                width={855}
                height={1240}
                className="h-full w-full object-contain"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow">Est. 1927</p>
            <h2 className="heading-lg mt-4 text-navy-800">The Peterite Crest</h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-navy-800/70">
              Rendered in full colour &mdash; blue, white and gold &mdash; the Crest has carried the
              College&rsquo;s identity since 1927 and remains, to every Peterite, a mark of pride
              wherever it is worn or displayed.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              Every element of it was chosen with care &mdash; blending the Catholic faith of the
              College&rsquo;s founders with the culture of the island that shaped it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ivory pt-0">
        <div className="container-site">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {symbols.map((s) => (
              <StaggerItem key={s.title}>
                <div className="card h-full">
                  <span className="icon-badge">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {s.icon}
                    </svg>
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-navy-800">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-800/65">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Motto */}
      <section className="section bg-navy-radial text-white">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The College Motto</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Virtus <span className="gold-text">et</span> Veritas
            </h2>
            <div className="gold-rule mx-auto mt-6" />
            <p className="mt-6 leading-relaxed text-white/70">
              Virtue and Truth &mdash; the vision our founders set for every Peterite to carry into
              the world.
            </p>
          </Reveal>
          <Stagger className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-2xl border border-gold/20 bg-white/[0.04] p-8 backdrop-blur-sm">
                <span className="gold-rule" />
                <h3 className="mt-5 font-serif text-xl text-gold-light">Virtus &middot; Virtue</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Moral excellence, integrity and a sense of duty &mdash; justice, prudence,
                  temperance and courage in every walk of life, and, in faith, hope and charity.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-2xl border border-gold/20 bg-white/[0.04] p-8 backdrop-blur-sm">
                <span className="gold-rule" />
                <h3 className="mt-5 font-serif text-xl text-gold-light">Veritas &middot; Truth</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Honesty, sincerity and loyalty &mdash; a life lived accurately and truly, in word
                  and in character.
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Flag */}
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
            <p className="eyebrow">Blue, White &amp; Gold</p>
            <h2 className="heading-lg mt-4 text-navy-800">
              The College <span className="gold-text">Flag</span>
            </h2>
            <div className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-navy-800/70">
              The same tricolour that fills the Crest is flown wherever Peterites gather &mdash; at
              College, and at every Old Boys&rsquo; Union occasion around the world, including here
              in New Zealand.
            </p>
            <p className="mt-4 leading-relaxed text-navy-800/70">
              Raised at our Gala Dinner Dance, Joe-Pete NZ and family gatherings, it is an instant,
              unmistakable mark of who we are and where we come from.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Anthem */}
      <section className="section bg-navy-radial pb-24 text-white">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The College Anthem</p>
            <h2 className="heading-lg mt-4">
              The song that unites <span className="gold-text">every Peterite gathering</span>
            </h2>
            <div className="gold-rule mx-auto mt-6" />
            <p className="mt-6 text-white/70">Music by George De Niese &middot; Words by T.L. Minor</p>
            <p className="mt-4 leading-relaxed text-white/70">
              First sung on the College grounds and carried by old boys to every corner of the
              world, the anthem calls on Peterites to hold their flag high, to meet life&rsquo;s
              challenges with courage, and to stand loyally by one another and by their College,
              wherever life takes them.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto mt-12 max-w-3xl">
            <div className="overflow-hidden rounded-3xl border border-gold/30 shadow-2xl">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                controls
                preload="metadata"
                poster="/videos/spc-college-anthem-poster.jpg"
                className="block w-full bg-black"
              >
                <source src="/videos/spc-college-anthem.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="mt-5 text-center">
              <a href="/videos/spc-college-anthem.mp4" download className="btn-outline">
                Download Anthem Video
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.25} className="mx-auto mt-10 max-w-3xl rounded-3xl border border-gold/20 bg-white/[0.04] p-8 text-center backdrop-blur-sm sm:p-10">
            <p className="eyebrow">For Future OBU NZ Events</p>
            <h3 className="mt-3 font-serif text-xl text-white">Audio-only, ready to play</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              A clean audio track for the Gala Dinner Dance, Joe-Pete NZ and any occasion where the
              anthem needs to be heard &mdash; no screen required.
            </p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls preload="none" className="mt-6 w-full">
              <source src="/audio/spc-college-anthem.mp3" type="audio/mpeg" />
            </audio>
            <div className="mt-5">
              <a href="/audio/spc-college-anthem.mp3" download className="btn-gold">
                Download Anthem MP3
              </a>
            </div>
          </Reveal>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/45">
            Need the full lyric sheet for a printed programme?{" "}
            <a href="mailto:spcobunz@gmail.com" className="text-gold/80 hover:text-gold">
              Email the committee
            </a>{" "}
            and we&rsquo;ll send it through.
          </p>
        </div>
      </section>
    </>
  );
}
