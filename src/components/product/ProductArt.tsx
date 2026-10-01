import type { ProductArt as Art } from "@/lib/commerce/types";

/**
 * Draws simple packaging for products that don't have photos yet.
 * Once real product photos exist (in Shopify), ProductMedia uses those instead.
 */
export function ProductArt({
  art,
  title,
  subtitle,
  brand,
  className = "",
}: {
  art: Art;
  title: string;
  subtitle?: string;
  brand: string;
  className?: string;
}) {
  const words = title.split(" ");
  const shape = art.shape ?? "tub";
  const ink = "#1F2A5C";

  const label = (cx: number, top: number) => (
    <g>
      <text x={cx} y={top} textAnchor="middle" fontSize="9" fontWeight="700" fill={ink} opacity="0.7" style={{ fontFamily: "var(--f-body)", letterSpacing: "0.04em" }}>
        {brand}
      </text>
      {words.map((w, i) => (
        <text key={i} x={cx} y={top + 26 + i * 22} textAnchor="middle" fontSize="23" fontWeight="800" fill={ink} style={{ fontFamily: "var(--f-heading)", fontVariationSettings: '"wdth" 78' }}>
          {w}
        </text>
      ))}
      {subtitle && (
        <text x={cx} y={top + 26 + words.length * 22 + 2} textAnchor="middle" fontSize="8.5" fontWeight="600" fill={ink} opacity="0.75" style={{ fontFamily: "var(--f-body)" }}>
          {subtitle}
        </text>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={`${title} packaging`}>
      <ellipse cx="100" cy="222" rx="66" ry="8" fill={ink} opacity="0.12" />
      {shape === "tub" && (
        <g>
          <path d="M44 66 H156 L150 206 Q149 216 139 216 H61 Q51 216 50 206 Z" fill={art.body} />
          <path d="M44 66 H156 L155 84 H45 Z" fill="#000" opacity="0.08" />
          <rect x="38" y="36" width="124" height="34" rx="9" fill={art.lid} />
          <rect x="38" y="62" width="124" height="8" rx="3" fill="#000" opacity="0.12" />
          <path d="M56 96 H144 Q148 96 148 100 V190 Q148 194 144 194 H56 Q52 194 52 190 V100 Q52 96 56 96 Z" fill={art.label} />
          {label(100, 116)}
          <path d="M60 40 Q63 52 60 66" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      )}
      {shape === "pouch" && (
        <g>
          <path d="M48 46 H152 L158 206 Q158 214 150 214 H50 Q42 214 42 206 Z" fill={art.body} />
          <rect x="48" y="38" width="104" height="14" rx="3" fill={art.lid} />
          <path d="M50 60 H150" stroke="#000" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="4 3" />
          <rect x="56" y="84" width="88" height="108" rx="10" fill={art.label} />
          {label(100, 104)}
        </g>
      )}
      {shape === "bottle" && (
        <g>
          <rect x="82" y="22" width="36" height="26" rx="6" fill={art.lid} />
          <path d="M86 48 H114 V60 Q140 66 142 92 V204 Q142 214 132 214 H68 Q58 214 58 204 V92 Q60 66 86 60 Z" fill={art.body} />
          <rect x="62" y="104" width="76" height="92" rx="10" fill={art.label} />
          <g transform="translate(100 0) scale(0.86) translate(-100 0)">{label(100, 128)}</g>
          <path d="M68 96 V196" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
