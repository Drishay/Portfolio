/* =========================================================
   Hero Scene + Quote Rotation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("heroImage");
  const quote = document.getElementById("heroQuote");

  if (!image || !quote) return;

  const scenes = {
    day: [
      ["assets/images/home/day/home-01.svg", "Build with curiosity. Improve with intention."],
      ["assets/images/home/day/home-02.svg", "Small steps become systems."],
      ["assets/images/home/day/home-03.svg", "Clarity turns ideas into work."],
      ["assets/images/home/day/home-04.svg", "Keep learning. Keep building."]
    ],
    night: [
      ["assets/images/home/night/home-01.svg", "Quiet work becomes visible over time."],
      ["assets/images/home/night/home-02.svg", "Reflection is part of building."],
      ["assets/images/home/night/home-03.svg", "Good systems begin with good thinking."],
      ["assets/images/home/night/home-04.svg", "Keep going, even when the work is invisible."]
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
    const list = scenes[getTheme()];
    let nextIndex = Math.floor(Math.random() * list.length);

    // Avoid showing the same scene twice in a row.
    if (list.length > 1 && nextIndex === index % list.length) {
      nextIndex = (nextIndex + 1) % list.length;
    }

    index = nextIndex;
    renderScene(true);
  }

  function restart() {
    clearInterval(timer);
    timer = window.setInterval(nextScene, 3000);
  }

  // Render immediately from the real SVG path.
  renderScene(false);
  restart();

  document.addEventListener("themechange", () => {
    index = Math.floor(Math.random() * scenes[getTheme()].length);
    renderScene(true);
    restart();
  });
});
