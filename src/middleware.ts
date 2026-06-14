import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import createNextIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

const intlMiddleware = createNextIntlMiddleware({
  locales,
  defaultLocale,
  // The user can always switch locale manually; we don't force-redirect by IP
  // (docs/creator-hub-master.md, section 12.10).
  localeDetection: false,
});

export async function middleware(request: NextRequest) {
  // ── 1. Supabase session refresh ──────────────────────────────────────────
  // IMPORTANT: Do not add any logic between createServerClient and
  // supabase.auth.getUser(). A subtle mistake here can cause users to be
  // randomly logged out (Supabase SSR requirement).

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            // CookieOptions (@supabase/ssr) and ResponseCookie (Next.js) are structurally
            // compatible at runtime but TypeScript sees sameSite type differences.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 2. Route protection ──────────────────────────────────────────────────
  const pathname = request.nextUrl.pathname;

  // Determine the locale present in the URL (fall back to defaultLocale so
  // redirect targets are always well-formed).
  const pathnameLocale =
    locales.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    ) ?? defaultLocale;

  const isDashboard = pathname.includes("/dashboard");
  const isOnboarding = pathname.includes("/onboarding");
  const isAuthRoute = pathname.includes("/auth/");

  if ((isDashboard || isOnboarding) && !user) {
    // Unauthenticated → send to login, preserving the intended destination.
    const loginUrl = new URL(`/${pathnameLocale}/auth/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies
      .getAll()
      .forEach((c) => redirectRes.cookies.set(c.name, c.value, c));
    return redirectRes;
  }

  if (isAuthRoute && user) {
    // Already authenticated → skip login/signup, go straight to dashboard.
    const dashboardUrl = new URL(`/${pathnameLocale}/dashboard`, request.url);
    const redirectRes = NextResponse.redirect(dashboardUrl);
    supabaseResponse.cookies
      .getAll()
      .forEach((c) => redirectRes.cookies.set(c.name, c.value, c));
    return redirectRes;
  }

  // ── 3. i18n locale routing ───────────────────────────────────────────────
  const intlRes = intlMiddleware(request);

  // Propagate any refreshed Supabase auth cookies to the final response so
  // the session is kept alive across navigations.
  supabaseResponse.cookies
    .getAll()
    .forEach((c) => intlRes.cookies.set(c.name, c.value, c));

  return intlRes;
}

export const config = {
  // Exclude API routes, Next.js internals, and static files.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
