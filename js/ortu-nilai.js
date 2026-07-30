// Nilai anak (ortu) – baris Matematika tersinkron dari input guru
(function () {
  "use strict";

  function gradeLetter(avg) {
    if (avg >= 85) return "A";
    if (avg >= 75) return "B";
    if (avg >= 60) return "C";
    return "D";
  }

  function init() {
    const g = MCDB.getNilaiSiswa("10001");
    if (!g) return;
    const rows = document.querySelectorAll(".card table tbody tr");
    rows.forEach(function (row) {
      const mapel = row.cells[1] ? row.cells[1].textContent.trim() : "";
      if (mapel !== "Matematika") return;
      const fields = ["uh1", "uh2", "uh3", "uts"];
      fields.forEach(function (f, i) {
        const cell = row.cells[3 + i];
        if (cell && g[f] !== undefined && g[f] !== null)
          cell.textContent = g[f];
      });
      const vals = [g.uh1, g.uh2, g.uh3, g.tugas, g.uts]
        .map(parseFloat)
        .filter(function (v) {
          return !isNaN(v);
        });
      if (vals.length) {
        const avg =
          vals.reduce(function (a, b) {
            return a + b;
          }, 0) / vals.length;
        const gradeEl = row.querySelector(".grade");
        if (gradeEl) {
          gradeEl.textContent = avg.toFixed(1);
          gradeEl.className =
            "grade " + (avg >= 85 ? "grade-a" : "grade-b");
        }
        const badge = row.querySelector(".badge");
        if (badge) badge.textContent = gradeLetter(avg);
      }
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
