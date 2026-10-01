import Link from "next/link";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { SiteConfig } from "@/config/types";
import { Icon } from "@/components/ui/Icon";

export function Footer({ site }: { site: SiteConfig }) {
  const { footer } = site;
  return (
    <footer className="bg-primary text-primary-ink">
      <div className="container-x py-10 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10 md:gap-x-12">
          <div className="mx-auto max-w-md text-center md:mx-0 md:max-w-sm md:text-left">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5 text-2xl font-extrabold md:justify-start"
              style={{ fontFamily: "var(--f-heading)" }}
            >
              {site.logo.mark && (
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-ink shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                  <Icon name={site.logo.mark} size={22} />
                </span>
              )}
              {site.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed opacity-85 sm:text-base">{footer.about}</p>

            {(footer.contact.email || footer.contact.phone) && (
              <ul className="mt-5 flex flex-col gap-2 sm:mx-auto sm:max-w-xs md:mx-0 md:max-w-none">
                {footer.contact.email && (
                  <li>
                    <a
                      href={`mailto:${footer.contact.email}`}
                      className="flex min-h-11 items-center justify-center gap-2.5 rounded-md border border-primary-ink/15 bg-primary-ink/5 px-4 py-2.5 text-sm font-medium transition-colors active:bg-primary-ink/10 md:justify-start md:border-0 md:bg-transparent md:px-0 md:py-0 md:font-normal md:active:bg-transparent"
                    >
                      <Mail size={17} className="shrink-0 opacity-90" aria-hidden />
                      <span className="truncate">{footer.contact.email}</span>
                    </a>
                  </li>
                )}
                {footer.contact.phone && (
                  <li>
                    <a
                      href={`tel:${footer.contact.phone.replace(/\s/g, "")}`}
                      className="flex min-h-11 items-center justify-center gap-2.5 rounded-md border border-primary-ink/15 bg-primary-ink/5 px-4 py-2.5 text-sm font-medium transition-colors active:bg-primary-ink/10 md:justify-start md:border-0 md:bg-transparent md:px-0 md:py-0 md:font-normal md:active:bg-transparent"
                    >
                      <Phone size={17} className="shrink-0 opacity-90" aria-hidden />
                      {footer.contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-primary-ink/12 pt-8 text-center sm:grid-cols-3 md:contents md:border-0 md:pt-0 md:text-left">
            {footer.columns.map((col, i) => (
              <nav
                key={col.title}
                aria-label={col.title}
                className={i === footer.columns.length - 1 && footer.columns.length === 3 ? "col-span-2 sm:col-span-1" : undefined}
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.12em] opacity-95 md:text-lg md:font-bold md:normal-case md:tracking-normal">
                  {col.title}
                </h2>
                <ul className="mt-3 space-y-0.5 md:mt-4 md:space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-10 w-full items-center justify-center text-sm opacity-85 transition-opacity hover:opacity-100 hover:underline underline-offset-4 md:min-h-0 md:w-auto md:justify-start"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-ink/15">
        <div
          className="container-x py-8 text-center md:py-10"
          style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto max-w-lg rounded-lg border border-primary-ink/12 bg-primary-ink/[0.06] px-4 py-5 text-sm leading-relaxed md:max-w-2xl md:border-0 md:bg-transparent md:px-0 md:py-0">
            <p className="opacity-90">
              © {new Date().getFullYear()} {site.name}. Storefront created by{" "}
              <a
                href="https://lance28-beep.github.io/portfolio-website/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-semibold underline underline-offset-4 hover:opacity-100"
              >
                Lance Valle
                <ExternalLink size={13} className="opacity-70" aria-hidden />
              </a>
              .
            </p>
            <p className="mt-3 opacity-90">
              Want a Shopify website like this?{" "}
              <a
                href="https://www.facebook.com/mr.c0oletz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-semibold underline underline-offset-4 hover:opacity-100"
              >
                Message me on Facebook
                <ExternalLink size={13} className="opacity-70" aria-hidden />
              </a>
              .
            </p>
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider opacity-60 md:mt-8">We accept</p>
          <ul className="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label="Payment methods">
            {footer.payments.map((p) => (
              <li key={p} className="rounded-full border border-primary-ink/20 bg-primary-ink/5 px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs">
                {p}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {footer.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center rounded-full border border-primary-ink/20 px-4 text-sm font-semibold transition-colors active:bg-primary-ink/10 md:min-h-0 md:border-0 md:px-0 md:active:bg-transparent md:hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
