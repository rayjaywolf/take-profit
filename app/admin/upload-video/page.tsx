"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function UploadVideoPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    src: "",
    thumbnail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDuration, setIsFetchingDuration] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const extractMuxAssetId = (src: string): string | null => {
    // Try to extract asset ID from the URL parameters
    const url = new URL(src);
    const assetId =
      url.searchParams.get("assetId") || url.searchParams.get("asset_id");

    if (assetId) {
      return assetId;
    }

    // If no asset ID in params, try to extract from path (this might be a playback ID)
    const pathMatch = src.match(/player\.mux\.com\/([^?]+)/);
    if (pathMatch) {
      // This is likely a playback ID, we need to get the asset ID from Mux
      return pathMatch[1];
    }

    return null;
  };

  const fetchDurationFromMux = async (src: string) => {
    const assetId = extractMuxAssetId(src);
    if (!assetId) {
      toast.error("Invalid Mux URL. Please provide a valid Mux player URL.");
      return;
    }

    setIsFetchingDuration(true);
    try {
      const response = await fetch(`/api/mux/video?assetId=${assetId}`);
      const result = await response.json();

      if (response.ok && result.asset) {
        const duration = result.asset.duration;
        console.log("Raw duration from API:", duration, typeof duration);
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        console.log("Calculated minutes:", minutes, "seconds:", seconds);
        const formattedDuration = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
        console.log("Formatted duration:", formattedDuration);

        setFormData((prev) => ({
          ...prev,
          duration: formattedDuration,
        }));
        toast.success(`Duration fetched: ${formattedDuration}`);
      } else {
        const errorMessage =
          result.error || "Failed to fetch duration from Mux";
        toast.error(errorMessage);
        console.error("Mux API error:", result);
      }
    } catch (error) {
      console.error("Error fetching duration:", error);
      toast.error(
        "Failed to fetch duration from Mux. Check your Mux credentials."
      );
    } finally {
      setIsFetchingDuration(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.src) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create video");
      }

      toast.success("Video uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        src: "",
        thumbnail: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Upload Video</h1>
            <p className="text-xl text-muted-foreground">
              Add a new video to the course
            </p>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Video Details</CardTitle>
            <CardDescription className="text-base">
              Fill in the video information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="src">Mux Player URL *</Label>
                <Input
                  id="src"
                  type="url"
                  placeholder="https://player.mux.com/..."
                  value={formData.src}
                  onChange={(e) => handleInputChange("src", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full Mux player iframe URL here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnail}
                  onChange={(e) =>
                    handleInputChange("thumbnail", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Provide a thumbnail image URL
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchDurationFromMux(formData.src)}
                  disabled={!formData.src || isFetchingDuration}
                  className="flex-1"
                >
                  {isFetchingDuration
                    ? "Fetching..."
                    : "Fetch Duration from Mux"}
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload Video"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
