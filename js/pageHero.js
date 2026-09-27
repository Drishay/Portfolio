/* =========================================================
   Page hero theme imagery
   Keeps Skills, Journey and Projects visually aligned
   with the home hero structure.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".page-hero");
  if (!hero) return;

  const image = hero.querySelector(".page-hero__image");

  function render() {
    const theme = document.documentElement.dataset.theme === "night" ? "night" : "day";
    const path = hero.dataset[theme];
    if (!path) return;

    image.classList.add("is-changing");

    window.setTimeout(() => {
      image.src = path;
      image.alt = hero.dataset.page + " page landscape";
      image.classList.remove("is-changing");
    }, 260);
  }

  render();
  document.addEventListener("themechange", render);
});
