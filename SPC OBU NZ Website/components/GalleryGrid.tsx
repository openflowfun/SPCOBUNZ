"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Stagger, StaggerItem } from "@/components/Reveal";

export type GalleryItem = { src: string; alt: string; category: string };

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setActive((a) => (a === null ? a : (a + dir + visible.length) % visible.length));
    },
    [visible.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setFilter(c);
              setActive(null);
            }}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
              filter === c
                ? "bg-gold-gradient text-navy-900 shadow-gold"
                : "border border-navy-800/20 text-navy-800/60 hover:border-gold hover:text-gold-dark"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <StaggerItem key={item.src + i}>
            <button
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden rounded-2xl shadow-card"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-5 text-left">
                  <p className="text-sm font-medium text-white">{item.alt}</p>
                  <p className="text-[10px] uppercase tracking-widest2 text-gold">{item.category}</p>
                </div>
              </div>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && visible[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              aria-label="Close"
              onClick={close}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-navy-900"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <button
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-navy-900"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-navy-900"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={visible[active].src}
                alt={visible[active].alt}
                width={1600}
                height={1100}
                className="max-h-[78vh] w-auto rounded-2xl object-contain"
              />
              <figcaption className="mt-4 text-center">
                <p className="text-sm text-white">{visible[active].alt}</p>
                <p className="text-[10px] uppercase tracking-widest2 text-gold">
                  {visible[active].category}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
