const generateForm = document.querySelector(".js-generate-form");
generateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  generateForm.classList.add("hidden");
  const x = Number(generateForm.elements.width.value);
  const y = Number(generateForm.elements.height.value);
  generateBoard(x, y);
});

function generateBoard(x, y) {
  console.log(x, y);
}
