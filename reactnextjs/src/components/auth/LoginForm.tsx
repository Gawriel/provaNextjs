"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { fetchApi } from "@/src/lib/api-client";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await fetchApi("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            router.replace("/profilo");
            router.refresh();
            console.log("Login effettuato");
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Errore durante il login.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-200"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@esempio.it"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-200"
                >
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Inserisci la tua password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700"
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Accesso..." : "Accedi"}
            </button>

            <div className="text-center text-sm text-zinc-400">
                Non hai un account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-white underline underline-offset-4 hover:text-zinc-300"
                >
                    Registrati subito
                </Link>
            </div>
        </form>
    );
}


// "use client";

// import { useState } from "react";
// import { fetchApi } from "@/src/lib/api-client";

// export function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       await fetchApi("/api/auth/login", {
//         method: "POST",
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       // Per ora ci limitiamo a verificare che la richiesta sia andata a buon fine.
//       console.log("Login effettuato");
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error
//           ? error.message
//           : "Errore durante il login.";

//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="email">Email</label>

//         <input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="password">Password</label>

//         <input
//           id="password"
//           type="password"
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//           required
//         />
//       </div>

//       {error && <p>{error}</p>}

//       <button type="submit" disabled={loading}>
//         {loading ? "Accesso..." : "Accedi"}
//       </button>
//     </form>
//   );
// }
