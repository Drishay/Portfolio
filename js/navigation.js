/* =========================================================
   Shared Navigation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navMount = document.getElementById("siteNav");

  if (!navMount) {
    return;
  }

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  const isActive = (page) => currentPage === page ? "active" : "";

  navMount.innerHTML =
    '<nav class="nav" aria-label="Primary navigation">' +
      '<div class="container nav__inner">' +
        '<a class="brand" href="index.html">Drishay Chauhan</a>' +
        '<div class="nav__links">' +
          '<a class="' + isActive("index.html") + '" href="index.html">Home</a>' +
          '<a class="' + isActive("skills.html") + '" href="skills.html">Skills</a>' +
          '<a class="' + isActive("journey.html") + '" href="journey.html">Journey</a>' +
          '<a class="' + isActive("projects.html") + '" href="projects.html">Projects</a>' +
          '<a class="' + isActive("blog.html") + '" href="blog.html">Blog</a>' +
          '<a class="resume-link" href="assets/resume/Drishay_Chauhan_Resume.pdf" target="_blank" rel="noreferrer">Resume</a>' +
          '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch between Day and Night">◐</button>' +
        '</div>' +
        '<button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="Open navigation">☰</button>' +
      '</div>' +
      '<div class="mobile-menu" id="mobileMenu">' +
        '<a href="index.html">Home</a>' +
        '<a href="skills.html">Skills</a>' +
        '<a href="journey.html">Journey</a>' +
        '<a href="projects.html">Projects</a>' +
        '<a href="blog.html">Blog</a>' +
        '<a href="assets/resume/Drishay_Chauhan_Resume.pdf" target="_blank">Resume</a>' +
        '<button class="theme-toggle" id="mobileThemeToggle" type="button" aria-label="Switch between Day and Night">◐ Day / Night</button>' +
      '</div>' +
    '</nav>';

  const menu = document.getElementById("mobileMenu");
  const menuButton = document.getElementById("menuToggle");

  menuButton?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  document.getElementById("themeToggle")
    ?.addEventListener("click", () => PortfolioTheme.toggle());

  document.getElementById("mobileThemeToggle")
    ?.addEventListener("click", () => PortfolioTheme.toggle());

  function updateThemeControls() {
    const isNight = PortfolioTheme.get() === "night";
    const icon = isNight ? "☀" : "☾";

    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.textContent = button.id === "mobileThemeToggle"
        ? icon + " Day / Night"
        : icon;
    });
  }

  updateThemeControls();
  document.addEventListener("themechange", updateThemeControls);
});
