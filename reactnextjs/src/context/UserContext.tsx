"use client";

import { createContext, useContext } from "react";

import type { CurrentUser } from "@/src/types/user";

type UserContextValue = {
  user: CurrentUser | null;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: CurrentUser | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser deve essere utilizzato all'interno di UserProvider.",
    );
  }

  return context;
}