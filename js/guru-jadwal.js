// Jadwal mengajar guru – render grid dari MCDB (jadwal_mengajar)
(function () {
  "use strict";

  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const COLORS = ["blue", "purple", "amber", ""];

  function render() {
    const grid = document.querySelector(".schedule-grid");
    if (!grid) return;
    const rows = MCDB.get("jadwal_mengajar", []);
    let html = '<div class="sch-header">Waktu</div>';
    DAYS.forEach(function (d) {
      html += '<div class="sch-header">' + d + "</div>";
    });
    rows.forEach(function (row, ri) {
      html += '<div class="sch-time">' + row.time.replace("–", "<br />") + "</div>";
      for (let di = 0; di < DAYS.length; di++) {
        const cell = row.cells[di];
        if (!cell) {
          html += '<div class="sch-cell"><div class="sch-empty">—</div></div>';
          continue;
        }
        html +=
          '<div class="sch-cell"><div class="sch-item ' + COLORS[ri % COLORS.length] +
          '" data-cls="' + cell.cls + '" data-room="' + cell.room + '">' +
          '<div class="cls">' + cell.cls + "</div>" +
          '<div class="room">' + cell.room + "</div></div></div>";
      }
    });
    grid.innerHTML = html;
    grid.querySelectorAll(".sch-item").forEach(function (item) {
      item.style.cursor = "pointer";
      item.addEventListener("click", function () {
        mcModal(
          "📅 Detail Jadwal",
          "<p><strong>Kelas:</strong> " + item.dataset.cls +
            "</p><p><strong>Ruang:</strong> " + item.dataset.room +
            '</p><p><strong>Mata Pelajaran:</strong> Matematika</p><p style="margin-top:10px"><a href="guru-kelas.html" style="color:var(--green-600);font-weight:600">Lihat Detail Kelas →</a></p>',
        );
      });
    });
  }

  render();
})();
