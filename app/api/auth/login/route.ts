import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, licenseKey } = body;

    if (!username || !licenseKey) {
      return NextResponse.json(
        { error: "Username and license key are required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.subscribers.findFirst({
      where: {
        username: username,
        licenseKey: licenseKey,
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid username or license key" },
        { status: 401 }
      );
    }

    const now = new Date();
    const expiryDate = new Date(subscriber.expiryDate);

    if (now > expiryDate) {
      return NextResponse.json(
        { error: "License has expired" },
        { status: 401 }
      );
    }

    const cookieStore = cookies();
    cookieStore.set("auth-token", subscriber.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: subscriber.id,
        username: subscriber.username,
        type: subscriber.type,
        expiryDate: subscriber.expiryDate,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
