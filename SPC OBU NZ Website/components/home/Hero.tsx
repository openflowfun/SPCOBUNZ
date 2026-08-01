"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-navy-950 text-white">
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Image
          src="/images/cover.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-900/80 to-navy-950" />
      </motion.div>

      {/* Ambient gold glow */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gold/[0.08] blur-3xl"
      />

      <motion.div style={{ opacity: fade }} className="container-site relative py-40">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full shadow-gold ring-2 ring-gold/60 sm:h-28 sm:w-28"
          >
            <Image
              src="/images/crest.jpg"
              alt="SPC OBU NZ crest"
              width={112}
              height={112}
              priority
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="eyebrow"
          >
            St. Peter&rsquo;s College Old Boys&rsquo; Union · Est. {site.established}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-serif text-5xl leading-[1.08] sm:text-6xl lg:text-7xl"
          >
            One College. One Brotherhood.
            <span className="gold-text block">Across Aotearoa.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/70"
          >
            Welcome to the official home of SPC OBU New Zealand — where Peterites gather to honour
            our legacy, celebrate our friendships, and carry <em className="text-gold-light">Virtus et Veritas</em> forward
            for the generations to come.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/events" className="btn-gold">
              Upcoming Events
            </Link>
            <Link href="/membership" className="btn-outline">
              Become a Member
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-7 items-start justify-center rounded-full border border-gold/40 p-2"
        >
          <span className="h-2 w-1 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
