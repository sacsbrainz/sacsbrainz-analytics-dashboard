import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

export default function withAuthorization(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (request: NextRequest, next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    if (requireAuth.some((path) => pathname.startsWith(path))) {
      const token = request.cookies.get("access_token")?.value;
      if (!token) {
        const url = new URL(`/web`, request.url);
        return NextResponse.redirect(url);
      }
    }
    return middleware(request, next);
  };
}
