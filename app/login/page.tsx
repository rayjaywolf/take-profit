"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    licenseKey: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.licenseKey) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication failed");
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
        }}
      />
      <div className="w-full max-w-md relative z-10 ">
        <Card className="border-2 shadow-lg bg-[#101B2C] border-[#202B3C]">
          <CardHeader className="text-center space-y-4">
            <Image
              src="/logo.png"
              alt="Take Profit Logo"
              width={64}
              height={64}
              className="mx-auto w-16 h-16 rounded-full shadow-lg"
              priority
            />
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access the dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="licenseKey" className="text-sm font-semibold">
                  License Key
                </Label>
                <Input
                  id="licenseKey"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={formData.licenseKey}
                  onChange={(e) =>
                    handleInputChange("licenseKey", e.target.value)
                  }
                  className="h-12 text-base font-mono"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
