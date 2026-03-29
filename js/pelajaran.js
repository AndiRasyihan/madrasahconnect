function filterPelajaran(btn, cat) {
  btn.parentElement
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".subject-card-lg").forEach((card) => {
    if (cat === "semua" || card.dataset.cat === cat) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}
