import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(getSite().pages ?? {}).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getSite().pages?.[(await params).slug];
  return page ? { title: page.title } : {};
}

export default async function TextPage({ params }: Props) {
  const page = getSite().pages?.[(await params).slug];
  if (!page) notFound();
  return (
    <article className="container-x max-w-3xl py-12 md:py-20">
      <h1 className="display text-5xl md:text-6xl">{page.title}</h1>
      <div className="mt-8 space-y-5 text-lg">
        {page.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
