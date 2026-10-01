import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <h1 className="display text-6xl md:text-8xl">This page wandered off.</h1>
      <p className="mt-4 text-lg text-muted">The link may be old, or the product may no longer be available.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/shop" className="btn btn-primary">Browse products</Link>
        <Link href="/" className="btn btn-ghost">Go to homepage</Link>
      </div>
    </div>
  );
}
