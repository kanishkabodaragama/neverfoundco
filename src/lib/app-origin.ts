const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
export const PRODUCTION_APP_ORIGIN = "https://neverfoundco.com";

export function normalizeOrigin(value: string | null | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, "");

  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.origin;
  } catch {
    return null;
  }
}

export function isLocalOrigin(origin: string) {
  try {
    return LOCAL_HOSTS.has(new URL(origin).hostname);
  } catch {
    return false;
  }
}

export function resolveRequestOrigin(request: Request) {
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https";
  const forwardedOrigin = forwardedHost
    ? normalizeOrigin(`${forwardedProto}://${forwardedHost}`)
    : null;

  return forwardedOrigin ?? normalizeOrigin(request.url);
}

export function resolvePublicAppOrigin(request?: Request) {
  const candidates = [
    process.env.PAYHERE_APP_URL,
    process.env.NODE_ENV === "production" ? PRODUCTION_APP_ORIGIN : null,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    request ? resolveRequestOrigin(request) : null,
  ];

  for (const candidate of candidates) {
    const origin = normalizeOrigin(candidate);

    if (origin && !isLocalOrigin(origin)) return origin;
  }

  if (process.env.NODE_ENV !== "production") {
    for (const candidate of candidates) {
      const origin = normalizeOrigin(candidate);

      if (origin) return origin;
    }
  }

  throw new Error(
    "PayHere public app URL must be a real HTTPS domain. Set PAYHERE_APP_URL or NEXT_PUBLIC_APP_URL in Netlify.",
  );
}
