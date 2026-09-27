/* =========================================================
   Secondary page hero imagery
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const image = document.querySelector(".page-hero__image");
  if (!image) return;

  function render() {
    const theme = document.documentElement.dataset.theme === "night" ? "night" : "day";
    image.src = image.dataset[theme];
  }

  render();
  document.addEventListener("themechange", render);
});
