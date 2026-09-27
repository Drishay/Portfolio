/* =========================================================
   Theme Manager
   ========================================================= */

(() => {
  const STORAGE_KEY = "drishay-theme";

  function getInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "day" || savedTheme === "night" || savedTheme === "anime") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "night"
      : "day";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);

    const themeButton = document.getElementById("themeToggle");
    const themeIcon = themeButton?.querySelector(".theme-icon");

    if (themeButton && themeIcon) {
      const icons = { day: "☀", night: "☾", anime: "🌸" };
      const labels = { day: "Switch to night theme", night: "Switch to anime theme", anime: "Switch to day theme" };
      themeIcon.textContent = icons[theme] || icons.day;
      themeButton.setAttribute("aria-label", labels[theme] || labels.day);
      themeButton.setAttribute("title", labels[theme] || labels.day);
    }

    document.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme },
      }),
    );
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === "day"
      ? "night"
      : currentTheme === "night"
        ? "anime"
        : "day";

    applyTheme(nextTheme);
  }

  window.PortfolioTheme = {
    apply: applyTheme,
    toggle: toggleTheme,
    get: () => document.documentElement.dataset.theme,
  };

  document.documentElement.dataset.theme = getInitialTheme();
})();
