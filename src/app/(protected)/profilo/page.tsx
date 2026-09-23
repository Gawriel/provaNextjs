import { ProfilePlaceholder } from "@/src/components/layout/ProfilePlaceholder";
import { getCurrentUser } from "@/src/server/auth/session";

export const metadata = {
  title: "Profilo",
};

export default async function ProfiloPage() {
  const user = await getCurrentUser();

  return <ProfilePlaceholder user={user!} />;
}
