/* =========================================================
   Project Filtering
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedFilter = filterButton.dataset.filter;

      filters.forEach((button) => button.classList.remove("active"));
      filterButton.classList.add("active");

      projects.forEach((project) => {
        const category = project.dataset.category;
        const isFeatured = project.dataset.featured === "true";

        const visible =
          selectedFilter === "all" ||
          (selectedFilter === "featured" && isFeatured) ||
          category === selectedFilter;

        project.hidden = !visible;
      });
    });
  });
});
