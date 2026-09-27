/* =========================================================
   Theme Manager
   ========================================================= */

(() => {
  const STORAGE_KEY = "drishay-theme";

  function getInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "day" || savedTheme === "night") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "night"
      : "day";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);

    document.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme },
      }),
    );
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme === "night"
      ? "night"
      : "day";

    applyTheme(currentTheme === "night" ? "day" : "night");
  }

  window.PortfolioTheme = {
    apply: applyTheme,
    toggle: toggleTheme,
    get: () => document.documentElement.dataset.theme,
  };

  document.documentElement.dataset.theme = getInitialTheme();
})();
