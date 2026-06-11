import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "ohmydress-ecommerce",
    timestamp: new Date().toISOString(),
  });
}
