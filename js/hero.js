/* =========================================================
   Hero Rotator
   Each theme has its own visual set and quote set.
   A different scene is selected on each page load.
   The scene then rotates automatically.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("heroImage");
  const quote = document.getElementById("heroQuote");

  if (!image || !quote) {
    return;
  }

  const scenes = {
    day: [
      {
        image: "assets/images/hero/day/day-01.svg",
        quote: "Build with curiosity. Improve with intention.",
      },
      {
        image: "assets/images/hero/day/day-02.svg",
        quote: "Small steps become systems.",
      },
      {
        image: "assets/images/hero/day/day-03.svg",
        quote: "Clarity turns ideas into work.",
      },
      {
        image: "assets/images/hero/day/day-04.svg",
        quote: "Keep learning. Keep building.",
      },
    ],
    night: [
      {
        image: "assets/images/hero/night/night-01.svg",
        quote: "Quiet work becomes visible over time.",
      },
      {
        image: "assets/images/hero/night/night-02.svg",
        quote: "Reflection is part of building.",
      },
      {
        image: "assets/images/hero/night/night-03.svg",
        quote: "Good systems begin with good thinking.",
      },
      {
        image: "assets/images/hero/night/night-04.svg",
        quote: "Keep going, even when the work is invisible.",
      },
    ],
  };

  let currentIndex = -1;
  let timer;

  function currentTheme() {
    return document.documentElement.dataset.theme === "night"
      ? "night"
      : "day";
  }

  function chooseNextIndex(list) {
    if (list.length < 2) {
      return 0;
    }

    let next = Math.floor(Math.random() * list.length);

    while (next === currentIndex) {
      next = Math.floor(Math.random() * list.length);
    }

    return next;
  }

  function showScene(instant = false) {
    const list = scenes[currentTheme()];
    currentIndex = chooseNextIndex(list);
    const scene = list[currentIndex];

    if (!instant) {
      image.classList.add("is-changing");
    }

    window.setTimeout(() => {
      image.src = scene.image;
      image.alt = "Abstract " + currentTheme() + " landscape";
      quote.textContent = scene.quote;
      image.classList.remove("is-changing");
    }, instant ? 0 : 420);
  }

  function restartRotation() {
    window.clearInterval(timer);
    timer = window.setInterval(() => showScene(false), 9000);
  }

  showScene(true);
  restartRotation();

  document.addEventListener("themechange", () => {
    currentIndex = -1;
    showScene(false);
    restartRotation();
  });
});
