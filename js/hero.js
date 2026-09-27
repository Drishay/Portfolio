/* =========================================================
   Hero Scene + Quote Rotation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("heroImage");
  const quote = document.getElementById("heroQuote");

  if (!image || !quote) return;

  const scenes = {
    day: [
      ["assets/images/hero/day/day-01.svg", "Build with curiosity. Improve with intention."],
      ["assets/images/hero/day/day-02.svg", "Small steps become systems."],
      ["assets/images/hero/day/day-03.svg", "Clarity turns ideas into work."],
      ["assets/images/hero/day/day-04.svg", "Keep learning. Keep building."]
    ],
    night: [
      ["assets/images/hero/night/night-01.svg", "Quiet work becomes visible over time."],
      ["assets/images/hero/night/night-02.svg", "Reflection is part of building."],
      ["assets/images/hero/night/night-03.svg", "Good systems begin with good thinking."],
      ["assets/images/hero/night/night-04.svg", "Keep going, even when the work is invisible."]
    ]
  };

  let index = 0;
  let timer;

  const getTheme = () =>
    document.documentElement.dataset.theme === "night" ? "night" : "day";

  function renderScene(animate = true) {
    const theme = getTheme();
    const list = scenes[theme];
    const scene = list[index % list.length];

    if (animate) {
      image.classList.add("is-changing");
      quote.classList.add("is-changing");
    }

    window.setTimeout(() => {
      image.src = scene[0];
      image.alt = theme + " mountain landscape";
      quote.textContent = scene[1];
      image.classList.remove("is-changing");
      quote.classList.remove("is-changing");
    }, animate ? 360 : 0);
  }

  function nextScene() {
    index += 1;
    renderScene(true);
  }

  function restart() {
    clearInterval(timer);
    timer = window.setInterval(nextScene, 8500);
  }

  // Render immediately from the real SVG path.
  renderScene(false);
  restart();

  document.addEventListener("themechange", () => {
    index = 0;
    renderScene(true);
    restart();
  });
});
