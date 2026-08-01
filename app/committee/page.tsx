import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { committee, type Member } from "@/lib/site";

export const metadata: Metadata = {
  title: "Committee 2025/26",
  description: "The office bearers of SPC OBU New Zealand for 2025/26.",
};

function initials(name: string) {
  if (name === "Vacant") return "—";
  return name
    .split(" ")
    .filter((w) => !["Rev.", "Fr.", "Dr"].includes(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function MemberCard({ m, featured = false }: { m: Member; featured?: boolean }) {
  const vacant = m.name === "Vacant";
  return (
    <div
      className={`card h-full text-center ${featured ? "!p-10" : "!p-7"} ${
        vacant ? "opacity-70" : ""
      }`}
    >
      <span
        className={`mx-auto flex items-center justify-center rounded-full font-serif text-navy-900 ${
          featured ? "h-24 w-24 text-3xl" : "h-16 w-16 text-xl"
        } ${vacant ? "bg-navy-800/10 text-navy-800/40" : "bg-gold-gradient shadow-gold"}`}
      >
        {initials(m.name)}
      </span>
      <p className={`mt-5 font-serif text-navy-800 ${featured ? "text-2xl" : "text-lg"}`}>
        {vacant ? "Position Vacant" : m.name}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-dark">
        {m.role}
      </p>
      {m.note && <p className="mt-2 text-xs italic leading-relaxed text-navy-800/55">{m.note}</p>}
    </div>
  );
}

export default function CommitteePage() {
  const patron = committee[0];
  const rest = committee.slice(1);

  return (
    <>
      <PageHero
        eyebrow="Office Bearers · 2025/26"
        title={<>The Committee guiding <span className="gold-text">our Union</span></>}
      >
        Dedicated Peterites volunteering their time and energy to serve the brotherhood across New
        Zealand.
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-site space-y-20">
          {/* Patron */}
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">{patron.tier}</p>
              <div className="mx-auto mt-8 max-w-md">
                <MemberCard m={patron.members[0]} featured />
              </div>
            </div>
          </Reveal>

          {rest.map((group) => (
            <div key={group.tier}>
              <Reveal className="text-center">
                <p className="eyebrow">{group.tier}</p>
                <div className="gold-rule mx-auto mt-4" />
              </Reveal>
              <Stagger
                className={`mt-10 grid gap-6 ${
                  group.tier === "General Committee"
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : group.members.length <= 3
                      ? "mx-auto max-w-4xl sm:grid-cols-3"
                      : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                }`}
              >
                {group.members.map((m, i) => (
                  <StaggerItem key={`${m.role}-${m.name}-${i}`}>
                    <MemberCard m={m} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
