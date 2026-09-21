import Link from "next/link";

/**
 * Pagina 404. Usa comunque il RootLayout → SiteHeader resta visibile.
 */
export default function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-zinc-500">Errore 404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Pagina non trovata
      </h1>
      <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        L&apos;indirizzo non esiste. Usa il menu in alto oppure torna alla home.
      </p>
      <Link
        href="/"
        className="w-fit text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
      >
        Torna alla Home
      </Link>
    </main>
  );
}
