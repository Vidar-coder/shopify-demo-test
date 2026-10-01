import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/commerce";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const results = await searchProducts(q);
  return NextResponse.json({
    results: results.map((p) => ({
      handle: p.handle,
      title: p.title,
      subtitle: p.subtitle,
      price: p.priceRange.min,
      image: p.images[0],
      art: p.art,
    })),
  });
}
