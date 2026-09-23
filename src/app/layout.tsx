import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/src/components/layout/SiteHeader";
import { UserProvider } from "@/src/context/UserContext";
import { getCurrentUser } from "@/src/server/auth/session";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CinemaVerse",
    template: "%s | CinemaVerse",
  },
  description: "Catalogo film, streaming e prenotazioni cinema",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <UserProvider user={user}>
          <SiteHeader brand="CinemaVerse" />

          <div className="flex flex-1 flex-col">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}



// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { SiteHeader } from "@/src/components/layout/SiteHeader";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: {
//     default: "CinemaVerse",
//     template: "%s | CinemaVerse",
//   },
//   description: "Catalogo film, streaming e prenotazioni cinema",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="it"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="flex min-h-full flex-col font-sans">
//         {/*
//           SiteHeader vive nel layout root: resta montato su OGNI pagina
//           (home, film, 404, unauthorized, ecc.) senza essere ricreato a ogni route.
//         */}
//         <SiteHeader brand="CinemaVerse" />
//         <div className="flex flex-1 flex-col">{children}</div>
//       </body>
//     </html>
//   );
// }
