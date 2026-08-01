import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-navy-radial text-white">
      <div className="container-site py-40 text-center">
        <p className="eyebrow">404</p>
        <h1 className="heading-xl mt-4">
          Lost on the way to <span className="gold-text">College?</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-white/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist. Let&rsquo;s get you back home.
        </p>
        <Link href="/" className="btn-gold mt-10">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
