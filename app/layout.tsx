import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
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
  title: "Take Profit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth-token")?.value;
  let user: { username: string; type: string } | null = null;
  if (authToken) {
    const subscriber = await prisma.subscribers.findUnique({
      where: { id: authToken },
      select: { username: true, type: true },
    });
    if (subscriber) {
      user = { username: subscriber.username, type: subscriber.type };
    }
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Header user={user} />
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
