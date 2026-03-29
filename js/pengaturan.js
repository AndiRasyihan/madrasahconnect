function selectTheme(el) {
  document.querySelectorAll(".theme-opt").forEach((t) => {
    t.classList.remove("active");
    t.textContent = "";
  });
  el.classList.add("active");
  el.textContent = "✓";
  showToast("Tema warna diperbarui");
}
