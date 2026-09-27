/* Page hero imagery + quote rotation for secondary pages. */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".page-hero");
  if (!hero) return;

  const image = hero.querySelector(".page-hero__image");
  const quote = hero.querySelector(".page-hero__quote");
  if (!image) return;

  const scenes = {
    day: (hero.dataset.day || "").split(",").map(x => x.trim()).filter(Boolean),
    night: (hero.dataset.night || "").split(",").map(x => x.trim()).filter(Boolean)
  };
  const quotes = (hero.dataset.quotes || "").split("|").map(x => x.trim()).filter(Boolean);

  let current = 0;
  let timer;

  const theme = () =>
    document.documentElement.dataset.theme === "night" ? "night" : "day";

  const render = (i, animate = true) => {
    const list = scenes[theme()];
    if (!list.length) return;

    current = i % list.length;
    if (animate) image.classList.add("is-changing");

    window.setTimeout(() => {
      image.src = list[current];
      image.alt = hero.dataset.page + " page hero";
      if (quote && quotes.length) quote.textContent = quotes[current % quotes.length];
      image.classList.remove("is-changing");
    }, animate ? 300 : 0);
  };

  const next = () => {
    const list = scenes[theme()];
    if (list.length < 2) return;

    let nextIndex = Math.floor(Math.random() * list.length);
    if (nextIndex === current) nextIndex = (nextIndex + 1) % list.length;
    render(nextIndex, true);
  };

  const restart = () => {
    clearInterval(timer);
    timer = setInterval(next, 3000);
  };

  render(Math.floor(Math.random() * (scenes[theme()].length || 1)), false);
  restart();

  document.addEventListener("themechange", () => {
    render(Math.floor(Math.random() * (scenes[theme()].length || 1)), true);
    restart();
  });
});
