import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subscribers = await prisma.subscribers.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      subscribers
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, username, type, txHash } = body;

    if (!licenseKey || !username || !type || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const calculateExpiryDate = (type: string): Date => {
      const now = new Date();
      
      switch (type.toLowerCase()) {
        case "trial":
          const trialExpiry = new Date(now);
          trialExpiry.setDate(now.getDate() + 7);
          return trialExpiry;
        
        case "monthly":
          const monthlyExpiry = new Date(now);
          monthlyExpiry.setMonth(now.getMonth() + 1);
          return monthlyExpiry;
        
        case "half-yearly":
          const halfYearlyExpiry = new Date(now);
          halfYearlyExpiry.setMonth(now.getMonth() + 6);
          return halfYearlyExpiry;
        
        case "lifetime":
          const lifetimeExpiry = new Date(now);
          lifetimeExpiry.setFullYear(now.getFullYear() + 100);
          return lifetimeExpiry;
        
        default:
          throw new Error(`Invalid subscription type: ${type}`);
      }
    };

    const expiryDate = calculateExpiryDate(type);

    const subscriber = await prisma.subscribers.create({
      data: {
        licenseKey,
        username,
        type,
        txHash,
        expiryDate,
      },
    });

    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber.id,
        licenseKey: subscriber.licenseKey,
        username: subscriber.username,
        type: subscriber.type,
        txHash: subscriber.txHash,
        date: subscriber.date,
        expiryDate: subscriber.expiryDate,
      },
    });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "License key already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
