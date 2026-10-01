import Image from "next/image";
import { getSite } from "@/config/site";
import type { ProductArt as Art, ProductImage } from "@/lib/commerce/types";
import { ProductArt } from "./ProductArt";

/** Shows the product photo if there is one, otherwise drawn packaging. */
export function ProductMedia({
  image,
  art,
  title,
  subtitle,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
  className = "",
}: {
  image?: ProductImage;
  art?: Art;
  title: string;
  subtitle?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain ${className}`}
      />
    );
  }
  return (
    <ProductArt
      art={art ?? { body: "#ccc", lid: "#999", label: "#fff" }}
      title={title}
      subtitle={subtitle}
      brand={getSite().name}
      className={`h-full w-full ${className}`}
    />
  );
}
