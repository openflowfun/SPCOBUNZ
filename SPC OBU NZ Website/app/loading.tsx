export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        <p className="mt-6 text-xs uppercase tracking-widest2 text-gold/70">Virtus et Veritas</p>
      </div>
    </div>
  );
}
