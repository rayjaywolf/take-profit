import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.videos.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, src, thumbnail, duration } = body;

    if (!title || !description || !src) {
      return NextResponse.json(
        { error: "Title, description, and src are required" },
        { status: 400 }
      );
    }

    const video = await prisma.videos.create({
      data: {
        title,
        description,
        src,
        thumbnail: thumbnail || "",
        duration: duration || "0:00",
      },
    });

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        src: video.src,
        duration: video.duration,
        thumbnail: video.thumbnail,
        createdAt: video.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
