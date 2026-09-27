/* =========================================================
   Shared Navigation
   Theme control cycles Day, Night, and Anime modes.
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
        '<div class="nav__start">' +
          '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to night theme" title="Switch to night theme"><span class="theme-icon" aria-hidden="true">☀</span></button>' +
          '<a class="brand" href="index.html">Drishay Chauhan</a>' +
        '</div>' +

        '<div class="nav__links">' +
          '<a class="' + isActive("index.html") + '" href="index.html">Home</a>' +
          '<a class="' + isActive("journey.html") + '" href="journey.html">Journey</a>' +
          '<a class="' + isActive("skills.html") + '" href="skills.html">Skills</a>' +
          '<a class="' + isActive("projects.html") + '" href="projects.html">Projects</a>' +
          '<a class="resume-link" href="assets/resume/Drishay_Chauhan_Resume.pdf" target="_blank" rel="noreferrer">Resume</a>' +
        '</div>' +

        '<button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="Open navigation">☰</button>' +
      '</div>' +

      '<div class="mobile-menu" id="mobileMenu">' +
        '<a href="index.html">Home</a>' +
        '<a href="journey.html">Journey</a>' +
        '<a href="skills.html">Skills</a>' +
        '<a href="projects.html">Projects</a>' +
        '<a href="assets/resume/Drishay_Chauhan_Resume.pdf" target="_blank">Resume</a>' +
      '</div>' +
    '</nav>';

  const menu = document.getElementById("mobileMenu");
  const menuButton = document.getElementById("menuToggle");
  const themeButton = document.getElementById("themeToggle");

  const syncThemeButton = (theme) => {
    const icons = { day: "☀", night: "☾", anime: "🌸" };
    const labels = {
      day: "Switch to night theme",
      night: "Switch to anime theme",
      anime: "Switch to day theme",
    };

    if (!themeButton) return;

    const currentTheme = theme || PortfolioTheme.get();
    const icon = themeButton.querySelector(".theme-icon");
    if (icon) icon.textContent = icons[currentTheme] || icons.day;

    const label = labels[currentTheme] || labels.day;
    themeButton.setAttribute("aria-label", label);
    themeButton.setAttribute("title", label);
  };

  syncThemeButton(PortfolioTheme.get());

  document.addEventListener("themechange", (event) => {
    syncThemeButton(event.detail?.theme);
  });

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

  themeButton?.addEventListener("click", () => PortfolioTheme.toggle());
});
