import { RegisterForm } from "@/src/components/auth/RegisterForm";

export const metadata = {
  title: "Registrazione",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Crea un account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Registrati per utilizzare tutte le funzionalità di CinemaVerse.
          </p>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
