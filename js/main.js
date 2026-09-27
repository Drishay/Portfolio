/* =========================================================
   Shared Footer
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("siteFooter");

  if (!footer) {
    return;
  }

  footer.innerHTML =
    '<footer class="footer">' +
      '<div class="container footer__inner">' +
        '<span>Drishay Chauhan · Building things with clarity and purpose.</span>' +
        '<span>' +
          '<a href="https://github.com/Drishay" target="_blank" rel="noreferrer">GitHub</a> · ' +
          '<a href="https://www.linkedin.com/in/drishaychauhan/" target="_blank" rel="noreferrer">LinkedIn</a> · ' +
          '<a href="mailto:drishaychauhan3357@gmail.com">Email</a> · ' +
          '© 2026' +
        '</span>' +
      '</div>' +
    '</footer>';
});
