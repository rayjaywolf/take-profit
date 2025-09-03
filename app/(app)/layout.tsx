import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";

export default async function AppLayout({
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
    <>
      <Header user={user} />
      {children}
    </>
  );
}
