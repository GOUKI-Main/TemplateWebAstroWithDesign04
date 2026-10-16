// Display formatters for site.business. Both turn the JSON-LD value into
// what the page shows, so the two are one piece of data, not two.
//
// formatOpeningHours turns schema.org opening hours ("Mo,We-Su 07:00-18:00") into the Japanese
// the page shows (「月・水〜日 7:00〜18:00」). The page and the LocalBusiness
// JSON-LD both read site.business.openingHours, so deriving the visible text
// from the same string is what keeps the two from disagreeing — never type
// the hours a second time in a component.

const DAYS: Record<string, string> = {
  Mo: "月",
  Tu: "火",
  We: "水",
  Th: "木",
  Fr: "金",
  Sa: "土",
  Su: "日",
};

const time = (t: string) => t.replace(/^0(\d)/, "$1");

/** One schema.org openingHours value → Japanese. Anything it does not
 *  recognise is returned unchanged rather than guessed at. */
export function formatOpeningHours(value: string): string {
  const m = value.trim().match(/^([A-Za-z,\-\s]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
  if (!m) return value;
  const [, dayPart, open, close] = m;
  const days = dayPart
    .replace(/\s/g, "")
    .split(",")
    .map((token) => {
      const ends = token.split("-");
      if (ends.length > 2 || ends.some((d) => !(d in DAYS))) return null;
      return ends.map((d) => DAYS[d]).join("〜");
    });
  if (days.includes(null)) return value;
  return `${days.join("・")} ${time(open)}〜${time(close)}`;
}

/** "+81-3-1234-5678" (the JSON-LD form) → "03-1234-5678" for display. The
 *  tel: link keeps the international form, which works from any phone. */
export function formatTel(value: string): string {
  return value.replace(/^\+81[-\s]?/, "0");
}
