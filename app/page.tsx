"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  src: string;
  createdAt: string;
}

export default function CourseDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/videos");
      const result = await response.json();

      if (response.ok) {
        setVideos(result.videos);
      } else {
        console.error("Failed to fetch videos:", result.error);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setIsSheetOpen(false);
  };

  return (
    <div className="h-[calc(100vh-60px)] bg-background">
      <div className="flex h-full flex-col sm:flex-row">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <div className="sm:hidden p-2 border-b">
            <SheetTrigger asChild>
              <Button size="sm" variant="outline">
                Browse Videos
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left" className="p-0 w-80">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold">Take Profit Course</h1>
                  <p className="text-xs text-muted-foreground">
                    Master the art of trading
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {videos.map((video, index) => (
                  <Card
                    key={video.id}
                    className={`cursor-pointer transition-all hover:shadow-md py-2 ${
                      selectedVideo?.id === video.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              video.thumbnail ||
                              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop"
                            }
                            alt={video.title}
                            className="w-16 h-12 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {index + 1}. {video.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {video.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="hidden sm:flex sm:w-80 sm:border-r bg-muted/30 flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-bold">
                  Take Profit Course
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Master the art of trading
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {videos.map((video, index) => (
                <Card
                  key={video.id}
                  className={`cursor-pointer transition-all hover:shadow-md py-2 ${
                    selectedVideo?.id === video.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            video.thumbnail ||
                            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop"
                          }
                          alt={video.title}
                          className="w-16 h-12 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {index + 1}. {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {video.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 bg-black min-h-0">
            <div className="relative h-full flex items-center justify-center">
              {!selectedVideo ? (
                <div className="text-center text-white px-4">
                  <Play className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Select a Video
                  </h2>
                  <p className="text-gray-400">
                    Choose a video from the sidebar to start watching
                  </p>
                </div>
              ) : (
                <div className="w-full h-full">
                  <iframe
                    src={selectedVideo.src}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                </div>
              )}
            </div>
          </div>
          {selectedVideo && (
            <div className="p-6 border-t">
              <div className="max-w-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">
                      {selectedVideo.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: {selectedVideo.duration}</span>
                      <span>•</span>
                      <span>
                        Video{" "}
                        {videos.findIndex((v) => v.id === selectedVideo.id) + 1}{" "}
                        of {videos.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button size="sm">Next</Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>

                {/* <div className="mt-6 flex items-center gap-4">
                  <Button className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Learning
                  </Button>
                  <Button variant="outline">Add to Favorites</Button>
                  <Button variant="outline">Download Notes</Button>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
