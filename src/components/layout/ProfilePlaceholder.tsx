import type { CurrentUser } from "@/src/types/user";

type ProfilePlaceholderProps = {
  user: CurrentUser;
};

type ProfileCardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

function ProfileCard({
  label,
  value,
  accent = false,
}: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-sm text-zinc-500">{label}</p>

      <p
        className={`mt-2 font-medium ${
          accent ? "text-emerald-400" : "text-zinc-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

type ActivityCardProps = {
  title: string;
  description: string;
  value: string;
  symbol: string;
};

function ActivityCard({
  title,
  description,
  value,
  symbol,
}: ActivityCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg text-amber-400">
          {symbol}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-zinc-400">
        {value}
      </p>
    </div>
  );
}

export function ProfilePlaceholder({
  user,
}: ProfilePlaceholderProps) {
  return (
    <main className="mx-auto flex w-[90%] max-w-1200px flex-1 flex-col py-10">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.14),transparent_35%)]" />

        <div className="relative flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-amber-400 text-2xl font-bold text-zinc-950">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
              Il tuo profilo
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {user.username}
            </h1>

            <p className="mt-1 text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">
          Il tuo account
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ProfileCard
            label="Username"
            value={user.username}
          />

          <ProfileCard
            label="Email"
            value={user.email}
          />

          <ProfileCard
            label="Stato account"
            value="Account attivo"
            accent
          />

          <ProfileCard
            label="Membro di CinemaVerse"
            value="Dal tuo primo accesso"
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">
          La tua attività
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ActivityCard
            title="Prenotazioni"
            description="Qui troverai lo storico delle tue prenotazioni."
            value="Nessuna prenotazione"
            symbol="◷"
          />

          <ActivityCard
            title="Recensioni"
            description="Le recensioni che lascerai sui film che hai visto."
            value="Nessuna recensione"
            symbol="★"
          />
        </div>
      </section>
    </main>
  );
}