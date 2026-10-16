/**
 * スクロールに合わせた動き。yohaku-koumuten の GSAP 演出を、ライブラリなしの
 * IntersectionObserver + CSS トランジションに置き換えたもの（約1kB）。
 * 見た目の定義はすべて global.css の「動き」にあり、ここは合図を出すだけ。
 *
 *   data-reveal        わずかに持ち上がって現れる
 *   data-reveal-child  直下の子を順に出す（並んだカード用）
 *   data-rule          罫線が左から引かれる
 *   data-img-reveal    写真が下から幕を上げて現れる
 *   data-pop           装飾のスタンプがポンと押される
 *   data-ink           縦書き見出しが一列ずつ現れる（直下の子＝一列）
 *
 * 遅らせたいときは style="--d: 200ms"。並びの順番は --i（ここで振る）。
 * <html> に .js-motion が無ければ（JS 無効・動きを減らす設定）何もしない。
 */

const SELECTOR =
  "[data-reveal],[data-reveal-child],[data-rule],[data-img-reveal],[data-pop],[data-ink]";

export function initMotion(): void {
  const root = document.documentElement;
  if (!root.classList.contains("js-motion")) return;

  // 順番を振る。子を順に出すもの・一列ずつ出すものは子に、並んだスタンプは
  // 親の中での順に。
  document
    .querySelectorAll<HTMLElement>("[data-reveal-child],[data-ink]")
    .forEach((el) =>
      Array.from(el.children).forEach((child, i) =>
        (child as HTMLElement).style.setProperty("--i", String(i)),
      ),
    );
  document.querySelectorAll<HTMLElement>("[data-pop]").forEach((el) => {
    const siblings = el.parentElement
      ? Array.from(el.parentElement.querySelectorAll(":scope > [data-pop]"))
      : [];
    el.style.setProperty("--i", String(siblings.indexOf(el)));
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    // 画面の下から14%入ったところで始める（GSAP 版の "top 86%" 相当）。
    { rootMargin: "0px 0px -14% 0px" },
  );
  document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));

  initHeader();
}

/** ヘッダー。下へ動かすと隠し、上へ動かすと出す。天面付近では常に出す。 */
function initHeader(): void {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    // 数pxの揺れ（慣性スクロールの戻り）では切り替えない。
    if (Math.abs(y - last) < 6) return;
    header.toggleAttribute("data-hidden", y > last && y > 240);
    last = y;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  // キーボードでヘッダー内にフォーカスが来たら必ず見せる。
  header.addEventListener("focusin", () =>
    header.removeAttribute("data-hidden"),
  );
}
