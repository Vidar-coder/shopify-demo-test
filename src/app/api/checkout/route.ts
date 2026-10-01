import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/commerce";
import type { CartLineInput } from "@/lib/commerce/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { lines?: CartLineInput[] };
  const lines = (body.lines ?? []).filter((l) => l.merchandiseId && l.quantity > 0);
  if (!lines.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  try {
    return NextResponse.json(await createCheckout(lines));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Checkout is unavailable right now. Try again in a minute." }, { status: 502 });
  }
}
