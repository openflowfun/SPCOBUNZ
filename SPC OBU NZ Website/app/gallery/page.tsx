import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryGrid, { type GalleryItem } from "@/components/GalleryGrid";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and memories from SPC OBU NZ events across New Zealand.",
};

// Add new photos here — drop files into /public/images and reference them below.
const items: GalleryItem[] = [
  { src: "/images/cover.jpg", alt: "SPC OBU NZ community gathering", category: "Community" },
  { src: "/images/crest.jpg", alt: "The College crest", category: "College" },
  { src: "/images/flag.webp", alt: "Flying the College flag", category: "Joe-Pete NZ" },
  { src: "/images/gallery-1.jpg", alt: "Peterite memories", category: "Events" },
  { src: "/images/nz-map.jpg", alt: "Peterites across Aotearoa", category: "Community" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>Moments that made <span className="gold-text">memories</span></>}>
        Relive the nights, the matches and the milestones of the Peterite family in New Zealand.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site">
          <GalleryGrid items={items} />
          <Reveal className="mt-16 text-center">
            <p className="text-navy-800/60">
              Have photos or videos from a past event?{" "}
              <a
                href={`mailto:${site.email}?subject=Gallery%20Submission`}
                className="font-semibold text-gold-dark underline-offset-4 hover:underline"
              >
                Share them with us
              </a>{" "}
              and we&rsquo;ll add them to the gallery.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
