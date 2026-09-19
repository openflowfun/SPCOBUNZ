import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "President's Message",
  description:
    "A message from the President of SPC OBU New Zealand, Shohan Wimalaratne, welcoming Peterites, families and friends to the union.",
};

export default function PresidentsMessagePage() {
  return (
    <>
      <PageHero eyebrow="From the President" title={<>A Message from <span className="gold-text">our President</span></>}>
        Greetings to all Old Peterites, families and friends of SPC OBU New Zealand.
      </PageHero>

      <section className="section bg-navy-radial text-white">
        <div className="container-site mx-auto max-w-3xl">
          <Reveal>
            <div className="rounded-3xl border border-gold/20 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-12">
              <p className="text-xl font-light leading-relaxed tracking-wide text-white sm:text-2xl">
                Greetings to all Old Peterites, families and friends.
              </p>
              <p className="mt-6 leading-relaxed text-white/70">
                It is my pleasure to welcome you to the official home of the St. Peter&rsquo;s
                College Old Boys&rsquo; Union in New Zealand.
              </p>
              <p className="mt-4 leading-relaxed text-white/70">
                This Union is a community bound by College &mdash; old friends, new faces, and the
                same Peterite spirit carried across Aotearoa. We gather to reconnect, to celebrate,
                and to keep that brotherhood alive for the next generation.
              </p>
              <p className="mt-4 leading-relaxed text-white/70">
                Through cricket, Joe-Pete, social events and our Gala Dinner Dance, we create the
                moments that bring us back together. Through this website and our pages, every
                Peterite in New Zealand &mdash; and beyond &mdash; has one place for our news, our
                history and our upcoming events.
              </p>
              <p className="mt-4 leading-relaxed text-white/70">
                Whether you are already part of the Union or finding us for the first time, you are
                welcome here. Explore the site, follow our pages, and join us at the next gathering.
              </p>
              <p className="mt-4 leading-relaxed text-white/70">Thank you for being part of this family.</p>
              <div className="gold-rule mt-8" />
              <p className="mt-6 font-serif italic text-white/85">Sincerely,</p>
              <p className="mt-1 font-serif text-xl font-semibold text-white">Shohan Wimalaratne</p>
              <p className="eyebrow mt-1">President &middot; SPC OBU New Zealand</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
