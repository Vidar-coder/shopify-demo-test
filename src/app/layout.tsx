import type { Metadata } from "next";
import "./globals.css";
import { getSite } from "@/config/site";
import { commerceMode, getProductsByHandles } from "@/lib/commerce";
import { AnnouncementBar, Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Providers, QuickView, SearchOverlay, Toasts } from "@/components/layout/Overlays";

const site = getSite();

export const metadata: Metadata = {
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", description: site.description },
};

/** Turns the site config's theme into CSS variables consumed by globals.css. */
function themeCss() {
  const { colors, fonts, radius } = site.theme;
  const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  const vars = [
    ...Object.entries(colors).map(([k, v]) => `--c-${kebab(k)}:${v}`),
    `--f-heading:"${fonts.heading.family}",${fonts.heading.fallback}`,
    `--f-body:"${fonts.body.family}",${fonts.body.fallback}`,
    `--r-sm:${radius.sm}`,
    `--r-md:${radius.md}`,
    `--r-lg:${radius.lg}`,
  ];
  return `:root{${vars.join(";")}}`;
}

function fontsHref() {
  const families = [site.theme.fonts.heading.google, site.theme.fonts.body.google].filter(Boolean);
  if (!families.length) return null;
  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const upsells = await getProductsByHandles(site.commerce.upsellHandles ?? []);
  const href = fontsHref();

  return (
    <html lang={site.locale.split("-")[0]}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        {href && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={href} />
          </>
        )}
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <Providers />
        {site.demoMode && (
          <div className="bg-pop px-4 py-1.5 text-center text-xs font-semibold text-pop-ink">
            Demo store: products, prices and reviews are placeholders.
          </div>
        )}
        <AnnouncementBar messages={site.announcements} />
        <Header name={site.logo.text} mark={site.logo.mark} nav={site.nav} />
        <main id="main">{children}</main>
        <Footer site={site} />
        <CartDrawer
          brand={site.name}
          currency={site.currency}
          freeShippingThreshold={site.commerce.freeShippingThreshold}
          upsells={upsells}
          demo={commerceMode === "demo"}
        />
        <SearchOverlay brand={site.name} suggestions={site.searchSuggestions ?? []} />
        <QuickView brand={site.name} />
        <Toasts />
      </body>
    </html>
  );
}
