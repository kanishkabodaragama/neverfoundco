import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/account/login", request.url), 303);
  response.cookies.delete("nf_customer_email");
  response.cookies.delete("nf_customer_order");
  return response;
}
