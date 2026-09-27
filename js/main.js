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
