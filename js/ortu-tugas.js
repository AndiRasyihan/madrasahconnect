function filterTask(btn, st) {
  btn.parentElement
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".task-card").forEach((c) => {
    c.style.display =
      st === "all" || c.dataset.st === st ? "flex" : "none";
  });
}
