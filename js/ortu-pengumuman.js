function filterAnn(cat, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".ann-card").forEach((c) => {
    c.style.display =
      cat === "all" || c.dataset.cat === cat ? "" : "none";
  });
}
