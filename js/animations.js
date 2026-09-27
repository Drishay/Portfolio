/* =========================================================
   Ambient Motion
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setupCursorGlow();
  setupHeroThemeImages();
});

function setupCursorGlow() {
  const glow = document.createElement("div");

  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    },
    { passive: true },
  );

  function animate() {
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;

    glow.style.left = currentX + "px";
    glow.style.top = currentY + "px";

    requestAnimationFrame(animate);
  }

  animate();
}

function setupHeroThemeImages() {
  const heroImage = document.getElementById("heroImage");

  if (!heroImage) {
    return;
  }

  const images = {
    day: "assets/images/hero/day-01.jpg",
    night: "assets/images/hero/night-01.jpg",
  };

  function updateHeroImage(theme) {
    const nextImage = images[theme];

    if (!nextImage || heroImage.src.endsWith(nextImage)) {
      return;
    }

    heroImage.classList.add("is-changing");

    window.setTimeout(() => {
      heroImage.src = nextImage;
      heroImage.onload = () => heroImage.classList.remove("is-changing");
    }, 380);
  }

  updateHeroImage(PortfolioTheme.get());

  document.addEventListener("themechange", (event) => {
    updateHeroImage(event.detail.theme);
  });
}
