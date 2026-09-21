// /login

import { LoginForm } from "@/src/components/auth/LoginForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Accedi
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Accedi al tuo account CinemaVerse.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
