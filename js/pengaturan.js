// Pengaturan siswa – pilihan tema tersimpan permanen
function selectTheme(el) {
  document.querySelectorAll(".theme-opt").forEach((t) => {
    t.classList.remove("active");
    t.textContent = "";
  });
  el.classList.add("active");
  el.textContent = "✓";
  const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
  MCDB.set("theme_choice", idx);
  showToast("Tema warna diperbarui & tersimpan");
}
document.addEventListener("DOMContentLoaded", () => {
  const saved = MCDB.get("theme_choice", null);
  if (saved === null) return;
  const opts = document.querySelectorAll(".theme-opt");
  if (opts[saved]) {
    opts.forEach((t) => {
      t.classList.remove("active");
      t.textContent = "";
    });
    opts[saved].classList.add("active");
    opts[saved].textContent = "✓";
  }
});
