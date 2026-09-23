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
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full
          border border-white/10
          bg-white/5
          text-zinc-300
          shadow-sm
          transition-all duration-200
          hover:border-amber-400/40
          hover:bg-white/10
          hover:text-white
        "
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
        <div
          className="
            absolute right-0 top-12 z-50
            min-w-64
            overflow-hidden
            rounded-xl
            border border-white/10
            bg-zinc-900/95
            p-2
            text-white
            shadow-2xl shadow-black/40
            backdrop-blur-md
          "
        >
          {!user ? (
            <div className="flex items-center gap-3 whitespace-nowrap p-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="
                  rounded-lg
                  bg-amber-400
                  px-4 py-2
                  text-sm font-semibold
                  text-zinc-950
                  transition-colors
                  hover:bg-amber-300
                "
              >
                Accedi
              </Link>

              <span className="text-sm text-zinc-400">
                Non hai un account?
              </span>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="
                  text-sm font-medium
                  text-zinc-200
                  transition-colors
                  hover:text-amber-400
                "
              >
                Registrati
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Account
                </p>

                <p className="mt-1 truncate text-sm font-medium text-white">
                  {user.username}
                </p>
              </div>

              <Link
                href="/profilo"
                onClick={() => setIsOpen(false)}
                className="
                  rounded-lg
                  px-3 py-2.5
                  text-sm text-zinc-200
                  transition-colors
                  hover:bg-white/5
                  hover:text-amber-400
                "
              >
                Profilo
              </Link>

              <Link
                href="/prenotazioni"
                onClick={() => setIsOpen(false)}
                className="
                  rounded-lg
                  px-3 py-2.5
                  text-sm text-zinc-200
                  transition-colors
                  hover:bg-white/5
                  hover:text-amber-400
                "
              >
                Prenotazioni
              </Link>

              <div className="my-1 border-t border-white/10" />

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="
                  rounded-lg
                  px-3 py-2.5
                  text-left text-sm
                  text-zinc-400
                  transition-colors
                  hover:bg-white/5
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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