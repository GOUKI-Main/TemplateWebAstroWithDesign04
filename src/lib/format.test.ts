import { describe, expect, it } from "vitest";
import { formatOpeningHours, formatTel } from "./format";

// The visible hours are derived from the JSON-LD value, so a wrong conversion
// would show customers different hours from what search engines are told.

describe("formatOpeningHours", () => {
  it("formats a day range", () => {
    expect(formatOpeningHours("Mo-Fr 09:00-18:00")).toBe("月〜金 9:00〜18:00");
  });

  it("formats a list mixing single days and ranges", () => {
    expect(formatOpeningHours("Mo,We-Su 07:00-18:00")).toBe(
      "月・水〜日 7:00〜18:00",
    );
  });

  it("keeps two-digit hours", () => {
    expect(formatOpeningHours("Sa 10:00-17:30")).toBe("土 10:00〜17:30");
  });

  it("returns anything it cannot parse unchanged", () => {
    expect(formatOpeningHours("Mo-Fr")).toBe("Mo-Fr");
    expect(formatOpeningHours("Xx 09:00-18:00")).toBe("Xx 09:00-18:00");
  });
});

describe("formatTel", () => {
  it("turns the international form into the domestic one", () => {
    expect(formatTel("+81-3-1234-5678")).toBe("03-1234-5678");
    expect(formatTel("+81-287-62-1234")).toBe("0287-62-1234");
  });

  it("leaves a domestic number alone", () => {
    expect(formatTel("03-1234-5678")).toBe("03-1234-5678");
  });
});
