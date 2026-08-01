import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="h-px w-full bg-gold-gradient opacity-60" />
      <div className="container-site grid gap-12 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-gold/50">
              <Image src="/images/crest.jpg" alt="SPC OBU NZ crest" fill sizes="48px" className="object-cover" />
            </span>
            <div>
              <p className="font-serif text-xl font-semibold">
                SPC OBU <span className="gold-text">New Zealand</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest2 text-gold/80">{site.motto}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            St. Peter&rsquo;s College Old Boys&rsquo; Union New Zealand — uniting Peterites across
            Aotearoa in brotherhood, legacy and service since {site.established}.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-5">Explore</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/70 transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Connect</p>
          <a href={`mailto:${site.email}`} className="text-sm text-white/70 transition-colors hover:text-gold">
            {site.email}
          </a>
          <div className="mt-5 flex gap-3">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-navy-900"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
              </svg>
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-navy-900"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.2-.1 1.6-.1 4.8-.1Zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2a2.9 2.9 0 0 0-1.2-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
              </svg>
            </a>
          </div>
          <Link href="/membership" className="btn-outline mt-8 !px-6 !py-2.5 !text-xs">
            Become a Member
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="container-site flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="uppercase tracking-widest2 text-gold/50">{site.motto}</p>
        </div>
      </div>
    </footer>
  );
}
