import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ref = searchParams.get("ref");

  try {
    if (ref) {
      const status = await prisma.applicationStatus.findUnique({
        where: { referenceNumber: ref },
        include: { history: { orderBy: { changedAt: "desc" } } },
      });

      if (!status) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        data: status,
      });
    }

    const statuses = await prisma.applicationStatus.findMany({
      include: { history: { orderBy: { changedAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: statuses,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, referenceNumber } = body;

    const status = await prisma.applicationStatus.create({
      data: {
        userId,
        referenceNumber,
        currentStatus: "pending",
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: status },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to track application" },
      { status: 500 }
    );
  }
}
