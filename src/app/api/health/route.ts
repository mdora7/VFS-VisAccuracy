import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json<ApiResponse>({
      success: true,
      data: { status: "healthy", db: "connected" },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Database connection failed" },
      { status: 503 }
    );
  }
}
