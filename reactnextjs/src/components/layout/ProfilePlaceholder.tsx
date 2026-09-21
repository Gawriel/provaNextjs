import type { CurrentUser } from "@/src/types/user";

type ProfilePlaceholderProps = {
  user: CurrentUser;
};

/**
 * Contenuto provvisorio della pagina profilo.
 */
export function ProfilePlaceholder({
  user,
}: ProfilePlaceholderProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profilo
        </h1>

        <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Qui puoi visualizzare le informazioni del tuo account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Username
          </p>

          <p className="mt-1 text-lg font-medium text-zinc-100">
            {user.username}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Email
          </p>

          <p className="mt-1 text-lg font-medium text-zinc-100">
            {user.email}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Film preferiti
          </p>

          <p className="mt-1 text-zinc-100">
            Nessun film nei preferiti.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Prenotazioni
          </p>

          <p className="mt-1 text-zinc-100">
            Nessuna prenotazione effettuata.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:col-span-2">
          <p className="text-sm text-zinc-400">
            Stato account
          </p>

          <p className="mt-1 text-zinc-100">
            Account CinemaVerse attivo.
          </p>
        </div>
      </div>
    </main>
  );
}



// import type { CurrentUser } from "@/src/types/user";

// type ProfilePlaceholderProps = {
//   user: CurrentUser;
// };

// export function ProfilePlaceholder({
//   user,
// }: ProfilePlaceholderProps) {
//   return (
//     <div className="mt-6 grid gap-4 sm:grid-cols-2">
//       <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
//         <p className="text-sm text-zinc-400">
//           Username
//         </p>

//         <p className="mt-1 text-lg font-medium text-zinc-100">
//           {user.username}
//         </p>
//       </div>

//       <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
//         <p className="text-sm text-zinc-400">
//           Email
//         </p>

//         <p className="mt-1 text-lg font-medium text-zinc-100">
//           {user.email}
//         </p>
//       </div>

//       <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
//         <p className="text-sm text-zinc-400">
//           Preferiti
//         </p>

//         <p className="mt-1 text-zinc-100">
//           Nessun film nei preferiti.
//         </p>
//       </div>

//       <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
//         <p className="text-sm text-zinc-400">
//           Prenotazioni
//         </p>

//         <p className="mt-1 text-zinc-100">
//           Nessuna prenotazione effettuata.
//         </p>
//       </div>

//       <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:col-span-2">
//         <p className="text-sm text-zinc-400">
//           Account
//         </p>

//         <p className="mt-1 text-zinc-100">
//           Account CinemaVerse attivo.
//         </p>
//       </div>
//     </div>
//   );
// }
