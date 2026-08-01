"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/20 bg-navy-900/90 py-2 shadow-[0_8px_30px_rgba(5,13,26,0.35)] backdrop-blur-xl"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-site flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-gold/50 transition-all duration-300 group-hover:ring-gold">
            <Image src="/images/crest.jpg" alt="SPC OBU NZ crest" fill sizes="44px" className="object-cover" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold tracking-wide text-white">
              SPC OBU <span className="gold-text">NZ</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest2 text-gold/80">
              {site.motto}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[13px] font-medium uppercase tracking-widest transition-colors duration-300 ${
                  active ? "text-gold" : "text-white/80 hover:text-gold"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold-gradient transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
          <Link href="/membership" className="btn-gold !px-6 !py-2.5 !text-xs">
            Join
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-gold/40 xl:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-gold transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-5 bg-gold transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-5 bg-gold transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-navy-950/98 backdrop-blur-xl xl:hidden"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`font-serif text-2xl tracking-wide transition-colors ${
                      pathname === item.href ? "text-gold" : "text-white hover:text-gold"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + nav.length * 0.05 }}
              >
                <Link href="/membership" className="btn-gold mt-4">
                  Become a Member
                </Link>
              </motion.div>
            </div>
            <p className="pb-10 text-center text-xs uppercase tracking-widest2 text-gold/60">
              {site.motto}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
