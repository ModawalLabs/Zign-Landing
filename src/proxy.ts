import { NextResponse, type NextRequest } from "next/server";

/**
 * A strict, nonce-based Content Security Policy, minted per request.
 *
 * Scripts run only if they carry this request's nonce (Next.js stamps it on
 * its own scripts) or were loaded by one that did ('strict-dynamic'). Inline
 * <style> elements need the nonce too; inline style *attributes* are
 * allowed, because the page's motion is rendered on the server as style
 * attributes and a nonce cannot cover an attribute. Nothing is loaded from
 * another origin: fonts are self-hosted by next/font, images are local.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const isHttps = request.nextUrl.protocol === "https:";

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    // The dev overlay injects unnonced styles; production never does.
    isDev
      ? "style-src-elem 'self' 'unsafe-inline'"
      : `style-src-elem 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    ...(isHttps ? ["upgrade-insecure-requests"] : []),
  ];
  const csp = directives.join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: static files and images need no policy of their own.
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|product/|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
