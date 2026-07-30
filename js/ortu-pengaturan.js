// Pengaturan ortu – pilihan tema tersimpan permanen
(function () {
  "use strict";

  window.selectTheme = function (el) {
    document.querySelectorAll(".theme-opt").forEach(function (t) {
      t.classList.remove("active");
      t.textContent = "";
    });
    el.classList.add("active");
    el.textContent = "✓";
    const idx = Array.prototype.indexOf.call(
      el.parentElement.children,
      el,
    );
    MCDB.set("theme_choice", idx);
    showToast("Tema warna diperbarui & tersimpan");
  };

  function init() {
    const saved = MCDB.get("theme_choice", null);
    if (saved === null) return;
    const opts = document.querySelectorAll(".theme-opt");
    if (opts[saved]) {
      opts.forEach(function (t) {
        t.classList.remove("active");
        t.textContent = "";
      });
      opts[saved].classList.add("active");
      opts[saved].textContent = "✓";
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
