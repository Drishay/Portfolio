/* =========================================================
   Shared Footer
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("siteFooter");

  if (!footer) {
    return;
  }

  footer.innerHTML =
    '<footer class="footer">' +
      '<div class="container footer__inner">' +
        '<span>Drishay Chauhan © 2026</span>' +
      '</div>' +
    '</footer>';
});


/* =========================================================
   Edge-hover scrollbar
   The scrollbar stays quiet until the pointer reaches
   the right edge of the viewport.
   ========================================================= */
document.addEventListener("mousemove", (event) => {
  const edgeDistance = 18;
  document.documentElement.classList.toggle(
    "scrollbar-visible",
    event.clientX >= window.innerWidth - edgeDistance
  );
});

document.addEventListener("mouseleave", () => {
  document.documentElement.classList.remove("scrollbar-visible");
});

/* =========================================================
   Anime mode atmosphere — falling blossom petals
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".anime-petals")) return;

  const layer = document.createElement("div");
  layer.className = "anime-petals";
  layer.setAttribute("aria-hidden", "true");

  for (let i = 0; i < 22; i += 1) {
    const petal = document.createElement("span");
    petal.className = "anime-petal";
    petal.style.setProperty("--x", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${7 + Math.random() * 9}px`);
    petal.style.setProperty("--duration", `${8 + Math.random() * 9}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 14}s`);
    petal.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    petal.style.setProperty("--r", `${Math.random() * 360}deg`);
    layer.appendChild(petal);
  }

  document.body.appendChild(layer);
});
