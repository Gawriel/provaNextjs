import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden">
        <div className="relative mx-auto grid w-[90%] max-w-[1600px] gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
              CinemaVerse
            </p>

            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Il cinema,
              <br />
              <span className="text-zinc-500">nel tuo universo.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Esplora film, scopri nuove storie, crea la tua lista personale
              e trova qualcosa da guardare stasera.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/film"
                className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
              >
                Esplora i film
              </Link>
            </div>
          </div>  
        </div>
      </section>
    </main>
  );
}