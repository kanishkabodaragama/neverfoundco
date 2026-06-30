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

  const requestUrl = new URL(request.url);
  const canonicalEnvUrl = getNonLocalOrigin(process.env.NEXT_PUBLIC_APP_URL);

  if (canonicalEnvUrl) return canonicalEnvUrl;
  if (requestUrl.hostname.endsWith("--nerverfoundco.netlify.app")) {
    return "https://nerverfoundco.netlify.app";
  }

  return requestUrl.origin;
}

function getNonLocalOrigin(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.hostname.endsWith("--nerverfoundco.netlify.app")) {
      return "https://nerverfoundco.netlify.app";
    }

    const isLocal =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";

    return isLocal ? null : url.origin;
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
