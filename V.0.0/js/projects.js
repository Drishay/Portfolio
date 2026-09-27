const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll("[data-category]");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    updateSectionsVisibility();

  });
});

const sections = document.querySelectorAll("section");

function updateSectionsVisibility() {
  sections.forEach(section => {
    const visibleCards = section.querySelectorAll(
      '[data-category]:not([style*="display: none"])'
    );

    section.style.display = visibleCards.length ? "block" : "none";
  });
}
