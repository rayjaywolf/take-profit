"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  licenseKey: string;
  username: string;
  type: string;
  txHash: string;
  date: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function TakeProfitForm() {
  const [formData, setFormData] = useState({
    username: "",
    type: "",
    txHash: "",
  });
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscribers");
      const result = await response.json();

      if (response.ok) {
        setSubscribers(result.subscribers);
      } else {
        toast.error("Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const generateRandomString = (length: number): string => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  };

  const generateLicenseKey = (): string => {
    const key = generateRandomString(16);
    return `${key.slice(0, 4)}-${key.slice(4, 8)}-${key.slice(
      8,
      12
    )}-${key.slice(12, 16)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.type || !formData.txHash) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const newKey = generateLicenseKey();

      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey: newKey,
          username: formData.username,
          type: formData.type,
          txHash: formData.txHash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create subscriber");
      }

      setLicenseKey(newKey);
      toast.success("License key generated and saved successfully!");
      console.log("Subscriber created:", result.subscriber);

      fetchSubscribers();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "trial":
        return "secondary";
      case "monthly":
        return "default";
      case "half-yearly":
        return "outline";
      case "lifetime":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="space-y-2 mt-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Take Profit Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage license keys and view subscribers
            </p>
          </div>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Key</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Generate License Key</CardTitle>
                <CardDescription className="text-base">
                  Please fill in all required fields to generate a new license
                  key
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Subscription Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subscription type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trial">Trial (7 days)</SelectItem>
                        <SelectItem value="monthly">
                          Monthly (30 days)
                        </SelectItem>
                        <SelectItem value="half-yearly">
                          Half-Yearly (6 months)
                        </SelectItem>
                        <SelectItem value="lifetime">Lifetime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="txHash">Transaction Hash</Label>
                    <Input
                      id="txHash"
                      type="text"
                      placeholder="Enter transaction hash"
                      value={formData.txHash}
                      onChange={(e) =>
                        handleInputChange("txHash", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Generating..." : "Generate License Key"}
                  </Button>

                  {licenseKey && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">
                        Generated License Key
                      </Label>
                      <div className="mt-2">
                        <code className="text-lg font-mono font-bold tracking-wider text-foreground bg-background px-3 py-2 rounded border">
                          {licenseKey}
                        </code>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">All Subscribers</CardTitle>
                    <CardDescription className="text-base">
                      View and manage all registered subscribers
                    </CardDescription>
                  </div>
                  <Button onClick={fetchSubscribers} disabled={isLoading}>
                    {isLoading ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">
                      Loading subscribers...
                    </div>
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">
                      No subscribers found
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>License Key</TableHead>
                          <TableHead>Transaction Hash</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Expires</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">
                              {subscriber.username}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getTypeVariant(subscriber.type)}
                                className={
                                  subscriber.type.toLowerCase() ===
                                  "half-yearly"
                                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                    : ""
                                }
                              >
                                {subscriber.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                {subscriber.licenseKey}
                              </code>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs text-muted-foreground">
                                {subscriber.txHash.slice(0, 12)}...
                              </code>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(subscriber.createdAt)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(subscriber.expiryDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
