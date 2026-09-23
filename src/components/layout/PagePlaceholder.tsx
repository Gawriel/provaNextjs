type PagePlaceholderProps = {
  title: string;
  description: string;
};

/** Contenuto semplice per pagine ancora da sviluppare. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    // <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 px-4 py-10 sm:px-6">
    <main className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col gap-3 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </main>
  );
}
