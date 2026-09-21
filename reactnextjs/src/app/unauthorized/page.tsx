import Link from "next/link";
import { PagePlaceholder } from "@/src/components/layout/PagePlaceholder";

export const metadata = {
  title: "Non autorizzato",
};

/**
 * Esempio pagina "unauthorized". Stesso layout root → navbar sempre presente.
 * Più avanti qui arriverai dopo un controllo JWT fallito.
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PagePlaceholder
        title="Accesso non autorizzato"
        description="Non hai i permessi per vedere questa sezione (o non sei collegato). Il menu in alto resta disponibile per tornare alle aree pubbliche."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <Link
          href="/profilo"
          className="text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
        >
          Vai al Profilo / Login
        </Link>
      </div>
    </div>
  );
}
