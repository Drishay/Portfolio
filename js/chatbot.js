/* =========================================================
   Ask Drishay — UI shell
   RAG/API integration comes in the separate Portfolio-AI repo.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("askDrishay");

  if (!mount) {
    return;
  }

  mount.innerHTML =
    '<button class="ask-drishay__button" id="askDrishayButton" type="button" aria-expanded="false" aria-controls="askDrishayPanel">' +
      'Ask Drishay' +
    '</button>' +
    '<section class="ask-drishay__panel" id="askDrishayPanel" aria-label="Ask Drishay assistant">' +
      '<h3>Ask Drishay</h3>' +
      '<p>Ask about my skills, projects, experience, or journey. The RAG assistant will be connected here.</p>' +
      '<div class="ask-drishay__input">' +
        '<input id="askDrishayInput" type="text" placeholder="Ask something..." aria-label="Question for Ask Drishay">' +
        '<button type="button" id="askDrishaySend">Send</button>' +
      '</div>' +
    '</section>';

  const wrapper = mount;
  const button = document.getElementById("askDrishayButton");
  const input = document.getElementById("askDrishayInput");
  const send = document.getElementById("askDrishaySend");

  button.addEventListener("click", () => {
    const isOpen = wrapper.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      input.focus();
    }
  });

  send.addEventListener("click", () => {
    input.value = "";
    input.placeholder = "AI API coming in the next phase...";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      send.click();
    }
  });
});
