export const metadata = {
    title: "About",
  };
  
  export default function AboutPage() {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          About CinemaVerse
        </h1>
  
        <p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          CinemaVerse è una web application dedicata al mondo del cinema,
          sviluppata con Next.js, React, TypeScript e MongoDB.
        </p>
  
        <p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Il progetto permette di esplorare un catalogo di film, visualizzarne
          i dettagli e, con un account, gestire preferiti e film da vedere.
        </p>
      </main>
    );
  }