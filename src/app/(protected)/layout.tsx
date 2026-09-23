// app/(protected)/layout.tsx

import { redirect } from "next/navigation";

// import { UserProvider } from "@/src/context/UserContext";
import { getCurrentUser } from "@/src/server/auth/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

    // <UserProvider user={user}>
    return <>{children}</>;
    // </UserProvider>
}