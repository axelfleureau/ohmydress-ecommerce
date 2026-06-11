import { NextResponse } from "next/server";

export function middleware(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin disabled", { status: 404 });
    }

    return NextResponse.next();
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const header = request.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    const [username, password] = atob(encoded).split(":");

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="OhMyDress Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
