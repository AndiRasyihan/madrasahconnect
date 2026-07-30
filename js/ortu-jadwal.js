// Jadwal anak (ortu) – sorot hari ini & unduh jadwal
(function () {
  "use strict";

  const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

  function init() {
    const today = HARI[new Date().getDay()];
    // Sorot kartu/sel yang memuat nama hari ini
    document
      .querySelectorAll("th, .day-label, .card-title, h3")
      .forEach(function (el) {
        if (el.textContent.trim() === today) {
          el.style.background = "var(--green-50, #ecf6e8)";
          el.style.borderRadius = "6px";
          el.setAttribute("title", "Hari ini");
        }
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
