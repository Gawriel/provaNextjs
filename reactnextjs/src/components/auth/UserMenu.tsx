"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useUser } from "@/src/context/UserContext";
import { fetchApi } from "@/src/lib/api-client";

export function UserMenu() {
  const { user } = useUser();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetchApi("/api/auth/logout", {
        method: "POST",
      });

      setIsOpen(false);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Errore durante il logout:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={user ? `Profilo di ${user.username}` : "Account"}
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 transition hover:bg-zinc-600"
      >
        {user ? (
          <span className="text-sm font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM4 22a8 8 0 1 1 16 0H4Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 min-w-64 rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white shadow-xl">
          {!user ? (
            <div className="flex items-center gap-3 whitespace-nowrap p-1">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
              >
                Accedi
              </Link>

              <span className="text-sm text-zinc-400">
                Non hai un account?
              </span>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-white transition hover:text-zinc-300"
              >
                Registrati subito
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <Link
                href="/profilo"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
              >
                Profilo
              </Link>

              <Link
                href="/prenotazioni"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
              >
                Prenotazioni
              </Link>

              <div className="my-1 border-t border-zinc-800" />

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-md px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? "Uscita..." : "Esci"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { useState } from "react";

// import { useUser } from "@/src/context/UserContext";

// export function UserMenu() {
//   const { user } = useUser();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setIsOpen((current) => !current)}
//         aria-label={user ? `Profilo di ${user.username}` : "Account"}
//         aria-expanded={isOpen}
//         className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 transition hover:bg-zinc-600"
//       >
//         {user ? (
//           <span className="text-sm font-semibold">
//             {user.username.charAt(0).toUpperCase()}
//           </span>
//         ) : (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="h-5 w-5"
//             aria-hidden="true"
//           >
//             <path
//               fillRule="evenodd"
//               d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM4 22a8 8 0 1 1 16 0H4Z"
//               clipRule="evenodd"
//             />
//           </svg>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 top-12 z-50 rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white shadow-xl">
//           {!user ? (
//             <div className="flex items-center gap-3 whitespace-nowrap">
//               <Link
//                 href="/login"
//                 onClick={() => setIsOpen(false)}
//                 className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
//               >
//                 Accedi
//               </Link>

//               <span className="text-sm text-zinc-400">
//                 Non hai un account?
//               </span>

//               <Link
//                 href="/register"
//                 onClick={() => setIsOpen(false)}
//                 className="text-sm font-medium text-white transition hover:text-zinc-300"
//               >
//                 Registrati subito
//               </Link>
//             </div>
//           ) : (
//             <div className="text-sm text-zinc-300">
//               Ciao, {user.username}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
