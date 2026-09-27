/* =========================================================
   Skills Filtering
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll("[data-skill-filter]");
  const skills = document.querySelectorAll(".skill-card");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.skillFilter;
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      skills.forEach((skill) => {
        skill.hidden = selected !== "all" && skill.dataset.skillCategory !== selected;
      });
    });
  });
});
