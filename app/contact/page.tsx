import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with SPC OBU New Zealand — spcobunz@gmail.com.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>We&rsquo;d love to <span className="gold-text">hear from you</span></>}>
        Questions about events, membership or sponsorship — or simply want to reconnect? Reach out
        any time.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Get in Touch</p>
            <h2 className="heading-lg mt-4 text-navy-800">Talk to the committee</h2>
            <div className="gold-rule mt-6" />
            <div className="mt-8 space-y-6">
              <a href={`mailto:${site.email}`} className="group flex items-center gap-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-gold transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-navy-800/50">Email</span>
                  <span className="font-medium text-navy-800 group-hover:text-gold-dark">{site.email}</span>
                </span>
              </a>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-gold transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-navy-800/50">Facebook</span>
                  <span className="font-medium text-navy-800 group-hover:text-gold-dark">SPC OBU New Zealand</span>
                </span>
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-gold transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-navy-800/50">Instagram</span>
                  <span className="font-medium text-navy-800 group-hover:text-gold-dark">@spcobunz</span>
                </span>
              </a>
            </div>
            <div className="mt-10 rounded-2xl border border-gold/30 bg-navy-900 p-7 text-white">
              <p className="font-serif text-lg gold-text">Based across New Zealand</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Our members span Auckland, Wellington, Christchurch and beyond. Wherever you are in
                Aotearoa, you&rsquo;re part of the family.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
