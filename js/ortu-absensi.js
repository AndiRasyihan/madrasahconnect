// Absensi anak (ortu) – rekap dari data absensi yang dicatat guru
(function () {
  "use strict";

  const NIS = "10001"; // Ahmad Fauzi

  function fmtTanggal(iso) {
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + bulan[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  const ST_LABEL = {
    i: ["Izin", "badge badge-blue"],
    s: ["Sakit", "badge badge-yellow"],
    a: ["Alpha", "badge badge-red"],
  };

  function init() {
    const rekap = MCDB.getAbsensiRekapSiswa(NIS);
    // Tambah baris ketidakhadiran dari catatan guru (terbaru dulu)
    const tbody = document.querySelectorAll(".card table tbody");
    const detail = tbody[tbody.length - 1];
    if (detail && rekap.detail.length) {
      rekap.detail
        .slice()
        .reverse()
        .forEach(function (d) {
          if (d.st === "h") return;
          const lbl = ST_LABEL[d.st] || ["-", "badge"];
          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td>" + fmtTanggal(d.date) + '</td><td><span class="' +
            lbl[1] + '">' + lbl[0] + "</span></td><td>" +
            (d.note || "Dicatat via absensi digital") +
            "</td><td>Wali Kelas – Siti Rahma, S.Pd</td>";
          detail.insertBefore(tr, detail.firstChild);
        });
    }
    // Perbarui statistik ringkas bila ada data baru
    if (rekap.detail.length) {
      const stats = document.querySelectorAll(".stat-card .stat-num");
      const totalHadir = 57 + rekap.h;
      const totalIzin = 2 + rekap.i;
      const totalSakit = 1 + rekap.s;
      const total = totalHadir + totalIzin + totalSakit + rekap.a;
      if (stats[0])
        stats[0].textContent =
          Math.round((totalHadir / Math.max(total, 1)) * 100) + "%";
      if (stats[1]) stats[1].textContent = totalHadir;
      if (stats[2]) stats[2].textContent = totalIzin;
      if (stats[3]) stats[3].textContent = totalSakit;
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
