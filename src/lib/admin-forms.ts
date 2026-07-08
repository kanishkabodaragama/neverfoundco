import { NextResponse } from "next/server";

type FlashParams = {
  error?: string;
  success?: string;
};

export function adminRedirect(
  request: Request,
  pathname: string,
  params: FlashParams = {},
) {
  const targetUrl = new URL(pathname, request.url);
  const url = new URL(
    `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
    getAdminRedirectOrigin(request, targetUrl),
  );

  if (params.error) url.searchParams.set("error", params.error);
  if (params.success) url.searchParams.set("success", params.success);

  return NextResponse.redirect(url, 303);
}

function getAdminRedirectOrigin(request: Request, targetUrl: URL) {
  if (!targetUrl.pathname.startsWith("/admin")) {
    return targetUrl.origin;
  }

  return getBrowserOrigin(request) ?? new URL(request.url).origin;
}

function getBrowserOrigin(request: Request) {
  const origin = getHeaderOrigin(request.headers.get("origin"));
  if (origin) return origin;

  const referer = getHeaderOrigin(request.headers.get("referer"));
  if (referer) return referer;

  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!forwardedHost) return null;

  const forwardedProto =
    request.headers.get("x-forwarded-proto") ??
    new URL(request.url).protocol.replace(":", "");

  return `${forwardedProto}://${forwardedHost}`;
}

function getHeaderOrigin(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  return error instanceof Error ? error.message : fallback;
}
