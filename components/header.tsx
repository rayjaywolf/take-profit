"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

type HeaderUser = {
  username: string;
  type: string;
} | null;

export function Header({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login") return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="w-full border-b">
      <div className="mx-auto flex h-14 w-full max-w-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Take Profit Logo"
            className="h-7 w-auto rounded-full"
          />
          <span className="font-semibold tracking-tight text-sm sm:text-base">
            Take Profit
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Badge
                variant="secondary"
                className="uppercase text-xs hidden sm:inline-flex"
              >
                {user.type}
              </Badge>
              <div className="flex items-center gap-1 sm:gap-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarFallback className="text-xs sm:text-sm">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                  {user.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground">
              Guest
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
