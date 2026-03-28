import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");

  try {
    const trackers = await prisma.appointmentTracker.findMany({
      where: userId ? { userId } : undefined,
      include: { slots: { where: { available: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: trackers,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, visaType, consulate, preferredDates } = body;

    const tracker = await prisma.appointmentTracker.create({
      data: { userId, visaType, consulate, preferredDates },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: tracker },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create tracker" },
      { status: 500 }
    );
  }
}
