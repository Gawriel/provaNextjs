export const metadata = {
  title: "Prenotazioni",
};

export default function PrenotazioniPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <section className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-3xl">
          🎬
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
          Work in progress
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Le prenotazioni stanno arrivando.
        </h1>
      </section>
    </main>
  );
}