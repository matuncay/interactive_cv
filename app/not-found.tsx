import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-lg p-8 font-mono text-sm">
        <p className="text-muted">$ pipeline run --stage route</p>
        <p className="mt-3 text-red-400">✗ Stage 404 failed — resource not found</p>
        <p className="mt-1 text-dim">exit code 404 · no artifact at this path</p>
        <Link href="/" className="mt-6 inline-block rounded-lg border border-line px-4 py-2 text-accent hover:bg-raised">↺ rollback to home</Link>
      </div>
    </main>
  );
}
