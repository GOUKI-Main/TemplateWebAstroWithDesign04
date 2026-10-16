import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { site as siteConfig } from "./src/content/site";
import { isNoindexPath } from "./src/lib/noindex";

// The site origin drives canonical URLs, sitemap and JSON-LD. It is a
// committed value in site.ts (no .env, no build variables), so the whole site
// can be configured by editing files — from a phone, if need be.
const site = siteConfig.url;

// https://astro.build/config
export default defineConfig({
  site,
  // Single, predictable URL shape (no trailing slash) so canonical,
  // internal links and sitemap all agree. (§1 URL正規化)
  trailingSlash: "never",
  // Prefetch links on hover to improve perceived navigation speed. (§8)
  // This is the ONLY runtime JavaScript the starter ships (~2.3 kB, one module
  // on every page). Remove this block for a strictly zero-JS build, or keep it
  // and opt individual links in with `data-astro-prefetch`.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    sitemap({
      // Keep noindex paths out of the sitemap. The match itself lives in
      // src/lib/noindex.ts because Base.astro asks the same question for
      // meta robots — sharing the function is what stops the two from
      // drifting apart. (§1/§2)
      filter: (page) =>
        !isNoindexPath(new URL(page).pathname, siteConfig.seo.noindexPaths),
    }),
  ],
  // Design fonts, self-hosted: Astro downloads them from Google Fonts at build
  // time and serves them from /_astro/fonts, so the browser never talks to a
  // third party (font-src 'self' in the CSP is enough). Japanese faces are
  // split into unicode-range subsets, so a page only pulls the glyphs it uses.
  // All four are SIL Open Font License 1.1 — see LICENSE-FONTS.md.
  // The cssVariable names are the *raw* families; global.css builds the
  // Tailwind font tokens (font-sans / font-head / font-hand / font-en) on top
  // of them with system fallbacks. Change a face here and the whole site
  // follows. (CLAUDE.md 第2部「書体」)
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Zen Kaku Gothic Antique",
      cssVariable: "--font-raw-body",
      weights: [400, 500, 700],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Kaisei Decol",
      cssVariable: "--font-raw-head",
      weights: [500, 700],
      styles: ["normal"],
      fallbacks: ["serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Yomogi",
      cssVariable: "--font-raw-hand",
      weights: [400],
      styles: ["normal"],
      fallbacks: ["cursive"],
    },
    {
      provider: fontProviders.google(),
      name: "Josefin Sans",
      cssVariable: "--font-raw-en",
      weights: [400, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
