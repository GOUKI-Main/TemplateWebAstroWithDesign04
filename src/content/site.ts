// src/content/site.ts
// Single source of truth for site-wide settings. Header, Footer, SEO meta,
// JSON-LD graph, sitemap and the web manifest all read from here. (設定の集約)

export type SiteNavItem = {
  label: string;
  href: string;
  /** Small English sub-label under the Japanese one (design: 「ホーム / HOME」). */
  en?: string;
};

/** The one prominent button in the header (and the mobile bar). */
export type SiteCta = SiteNavItem & { external?: boolean };

/** Optional local-business / MEO data. When present, a LocalBusiness JSON-LD
 *  node is emitted and you can surface NAP in the UI. Leave undefined for
 *  non-storefront sites. (§4 MEO) */
export type BusinessConfig = {
  /** schema.org type, e.g. "LocalBusiness", "Restaurant", "Store". */
  type?: string;
  legalName?: string;
  telephone?: string;
  email?: string;
  priceRange?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  /** Google Maps place URL (MEO). */
  hasMap?: string;
  areaServed?: string[];
  /** e.g. "Mo-Fr 09:00-18:00". Shown on the page in Japanese
   *  (「月〜金 9:00〜18:00」) by src/lib/hours.ts — same data, so the visible
   *  hours and the JSON-LD can never disagree. */
  openingHours?: string[];
  /** Display only: closed days in words (「毎週火曜日・第2水曜日」). schema.org
   *  cannot say "2nd Wednesday", so this never goes into JSON-LD. */
  closedDays?: string;
  /** Display only: extra rows in the shop-info table (駐車場, 席数, …). */
  notes?: { label: string; value: string }[];
  /** Display only: how to get there, one line each (「〇〇駅から徒歩5分」). */
  access?: string[];
  /** Google Maps embed URL (the `src` of the iframe from 「地図を埋め込む」).
   *  Needs `frame-src https://www.google.com` if the CSP is enabled. */
  mapEmbedUrl?: string;
};

/** Who runs the site, as structured data. "Organization" for a company, shop
 *  or group; "Person" for an individual / freelancer. With "Person", no
 *  Organization node is emitted and the site Person becomes the publisher.
 *  (構造化データの主体) */
export type PublisherType = "Organization" | "Person";

export type SiteConfig = {
  /** Absolute production origin, no trailing slash (e.g. "https://example.jp").
   *  Drives canonical URLs, sitemap, robots.txt and JSON-LD via Astro.site. */
  url: string;
  name: string;
  tagline: string;
  description: string;
  locale: string;
  ogLocale: string;
  publisher: PublisherType;
  /** Brand/organization social profiles → Organization.sameAs (§4/§10). */
  sameAs?: string[];
  author: {
    name: string;
    email?: string;
    url?: string;
    socials?: {
      x?: string;
      github?: string;
      linkedin?: string;
    };
  };
  business?: BusinessConfig;
  /** External contact form (Google Forms, Tally, …). Linked from /contact —
   *  no form JS is shipped. Widen form-action / frame-src in public/_headers
   *  if you embed or post to it. */
  contactFormUrl?: string;
  nav: SiteNavItem[];
  /** The header's call-to-action button (お問い合わせ / ご予約 / ショップ …). */
  cta?: SiteCta;
  /** Secondary links shown in the footer (policy pages and the like). */
  footerNav?: SiteNavItem[];
  seo: {
    ogImage?: string;
    /** Intrinsic size of `ogImage` → og:image:width/height hints. */
    ogImageWidth?: number;
    ogImageHeight?: number;
    /** Site X (Twitter) handle → twitter:site, e.g. "@yourhandle". */
    twitterSite?: string;
    /** Organization / publisher logo (square, ideally >=112px). */
    logo?: string;
    robots: string;
    /** Browser UI color in light mode — keep in sync with --color-bg. */
    themeColor: string;
    /** Browser UI color in dark mode — keep in sync with the dark --color-bg. */
    themeColorDark?: string;
    /** Paths excluded from indexing: drives meta robots AND sitemap. (§1) */
    noindexPaths: string[];
    /** Google Search Console HTML-tag verification code (the `content` value).
     *  Public by design — it is printed into every page. */
    googleSiteVerification?: string;
  };
  /** Optional design behaviour. Both are pure presentation and safe to turn
   *  off; the page reads the same without them. */
  design: {
    /** Opening animation (awning stripes + logo) on the first page of a
     *  visit. Skipped on later pages, with reduced motion, and without JS. */
    loader: boolean;
    /** Fixed bottom bar on phones: 電話 (when business.telephone is set) and
     *  the header CTA. */
    mobileBar: boolean;
  };
  /** Cloudflare Web Analytics beacon token. Public by design (it ships to the
   *  browser); the beacon renders only when this is set. */
  cloudflareBeaconToken?: string;
};

// ─────────────────────────────────────────────────────────────────────────
// TEMPLATE: every value below is a placeholder. The setup interview in
// CLAUDE.md (「初期セットアップ」) fills them in; `pnpm check:setup` lists
// every setup marker still left in the repo.
// ─────────────────────────────────────────────────────────────────────────
export const site: SiteConfig = {
  // TODO(setup): Q14 公開するURL（未定の間は example.com のままでよい）
  url: "https://example.com",
  // TODO(setup): Q2 サイト名 / Q3 キャッチコピー・説明文（120字前後）
  name: "サイト名",
  tagline: "ひとことで伝わるキャッチコピー。",
  description:
    "検索結果やSNSでのシェア時に表示される、サイト全体の説明文です。誰に・何を・どこで提供しているかを120字前後で書きます。",
  locale: "ja",
  ogLocale: "ja_JP",
  // TODO(setup): Q1 構造化データ（JSON-LD）の主体。会社・店舗・団体 → "Organization"、個人・フリーランス → "Person"
  publisher: "Organization",
  // TODO(setup): Q8 公式SNSのURL（なければ空配列）
  sameAs: [],
  // TODO(setup): Q4 運営責任者（人の名前）と連絡用メールアドレス
  author: {
    name: "運営者名",
    email: "hello@example.com",
    // url: "https://example.com",
    socials: {
      // x: "https://x.com/yourhandle",
      // github: "https://github.com/yourhandle",
      // linkedin: "https://www.linkedin.com/in/yourhandle/",
    },
  },
  // TODO(setup): Q5 店舗・事務所の情報。トップの「店舗情報」とフッター、JSON-LD
  // （LocalBusiness）がここから出る。店舗が無いサイトは business ごと削除する
  // （トップの店舗情報は自動で消え、代わりに問い合わせの帯が出る）。
  business: {
    type: "LocalBusiness",
    legalName: "株式会社〇〇",
    telephone: "+81-000-0000-0000",
    // email: "info@example.jp", // 公開してよい店舗の連絡先だけ
    priceRange: "¥",
    address: {
      streetAddress: "〇〇町1-2-3",
      addressLocality: "〇〇市",
      addressRegion: "〇〇県",
      postalCode: "000-0000",
      addressCountry: "JP",
    },
    // geo: { latitude: 35.6595, longitude: 139.7005 },
    hasMap: "https://maps.google.com/?cid=XXXX",
    // areaServed: ["〇〇県"],
    openingHours: ["Mo,We-Su 07:00-18:00"],
    closedDays: "毎週火曜日",
    notes: [{ label: "駐車場", value: "あり（〇台）" }],
    access: ["〇〇駅から徒歩〇分", "〇〇ICから車で約〇分"],
    // mapEmbedUrl: "https://www.google.com/maps/embed?pb=XXXX",
  },
  // TODO(setup): Q7 お問い合わせフォームの外部URL（Googleフォーム等。なければ行ごと削除）
  // contactFormUrl: "https://forms.gle/XXXX",
  // TODO(setup): Q6 ページ構成に合わせてナビを並べる（href は末尾スラッシュなし）
  nav: [
    { label: "ホーム", en: "Home", href: "/" },
    { label: "私たちについて", en: "About", href: "/about" },
    { label: "店舗情報", en: "Shop Info", href: "/#info" },
  ],
  // TODO(setup): Q7 ヘッダーの目立つボタン（問い合わせ / 予約 / 通販 など一番の導線）
  cta: { label: "お問い合わせ", en: "Contact", href: "/contact" },
  footerNav: [{ label: "サイトポリシー", href: "/legal" }],
  seo: {
    ogImage: "/images/og/og-default.jpg",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    // twitterSite: "@yourhandle",
    logo: "/icon-512.png",
    robots:
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    // TODO(setup): Q9 配色を変えたら global.css の --color-bg と揃える（ライト専用）
    themeColor: "#f4edde",
    noindexPaths: [],
    // 公開後: Search Console の「HTMLタグ」の content の値
    // googleSiteVerification: "XXXXXXXX",
  },
  design: {
    loader: true,
    mobileBar: true,
  },
  // 公開後: Cloudflare Web Analytics のトークン（入れるとアクセス解析が有効になる）
  // cloudflareBeaconToken: "XXXXXXXX",
};
