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
  const url = new URL(pathname, request.url);

  if (params.error) url.searchParams.set("error", params.error);
  if (params.success) url.searchParams.set("success", params.success);

  return NextResponse.redirect(url, 303);
}

export function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  return error instanceof Error ? error.message : fallback;
}
