import type { ReactNode } from "react";
import type { Metadata } from "next";
import AuthSessionSync from "../components/auth/auth-session-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jogwa-log",
  description: "Jogwa-log web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthSessionSync />
        {children}
      </body>
    </html>
  );
}
