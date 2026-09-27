
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

/* Close menu when a link is clicked */
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

const heroData = [
  {
    image: "assets/images/hero1.jpg",
    quote: "Building things with clarity and purpose.",
    author: "Drishay Chauhan"
  },
  {
    image: "assets/images/hero2.jpg",
    quote: "Learning by building, improving by reflecting.",
    author: "Drishay Chauhan"
  }
];

let heroIndex = 0;
let heroTimeout;

const heroImage = document.getElementById("heroImage");
const heroQuote = document.getElementById("heroQuote");
const heroAuthor = document.getElementById("heroAuthor");
const heroContent = document.getElementById("heroContent");

/* TIMING */
const DISPLAY_TIME = 7000; // fully visible
const FADE_TIME = 2000;    // fade duration

/* Force initial state */
function setVisible(visible) {
  const opacity = visible ? "1" : "0";
  heroImage.style.opacity = opacity;
  heroQuote.style.opacity = opacity;
  heroAuthor.style.opacity = opacity;
}

/* Set content ONLY when invisible */
function setContent(index) {
  heroImage.src = heroData[index].image;
  heroQuote.textContent = heroData[index].quote;
  heroAuthor.textContent = `— ${heroData[index].author}`;
}

/* Main loop */
function runHeroCycle() {
  // 1️⃣ Stay visible
  heroTimeout = setTimeout(() => {

    // 2️⃣ Fade OUT everything together
    setVisible(false);

    // 3️⃣ After fade-out finishes
    heroTimeout = setTimeout(() => {
      heroIndex = (heroIndex + 1) % heroData.length;

      // change content while invisible
      setContent(heroIndex);

      // force browser to register opacity=0 before fading in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 4️⃣ Fade IN everything together
          setVisible(true);

          // 5️⃣ Wait again
          runHeroCycle();
        });
      });

    }, FADE_TIME);

  }, DISPLAY_TIME);
}

/* INIT — show immediately */
setContent(heroIndex);
setVisible(true);
runHeroCycle();

/* Pause on hover */
if (heroContent) {
  heroContent.addEventListener("mouseenter", () => {
    clearTimeout(heroTimeout);
  });

  heroContent.addEventListener("mouseleave", () => {
    runHeroCycle();
  });
}

