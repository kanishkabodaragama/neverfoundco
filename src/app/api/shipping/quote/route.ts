import { NextResponse } from "next/server";
import { getShippingFeeForAddress } from "@/lib/db/shipping";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const countryCode = url.searchParams.get("countryCode") ?? undefined;
  const district = url.searchParams.get("district") ?? undefined;

  try {
    const shippingFee = await getShippingFeeForAddress(countryCode, district);
    return NextResponse.json({ shippingFee });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to calculate shipping.",
      },
      { status: 400 },
    );
  }
}
