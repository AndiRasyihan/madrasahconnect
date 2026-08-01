// Dashboard ortu – badge tagihan & notifikasi dari data nyata
(function () {
  "use strict";

  function init() {
    // Badge pembayaran = jumlah tagihan belum dibayar
    const unpaid = MCDB.get("pembayaran", []).filter(function (b) {
      return b.status === "unpaid";
    }).length;
    document
      .querySelectorAll('.sidebar-link[href*="pembayaran"] .sidebar-badge')
      .forEach(function (b) {
        if (unpaid > 0) b.textContent = unpaid;
        else b.remove();
      });

    // Badge pesan = notifikasi ortu belum dibaca
    const unread = MCDB.getNotif("ortu").filter(function (n) {
      return !n.read;
    }).length;
    document
      .querySelectorAll('.sidebar-link[href*="pesan"] .sidebar-badge')
      .forEach(function (b) {
        if (unread > 0) b.textContent = unread;
        else b.remove();
      });

    renderCharts();
    window.addEventListener("resize", renderCharts);
    window.addEventListener("mc-a11y", renderCharts);
  }

  function renderCharts() {
    if (typeof mcChart !== "function") return;
    const nilaiCv = document.getElementById("chartNilai");
    if (nilaiCv) {
      const n = MCDB.nilaiSiswa("10001");
      mcChart(nilaiCv, {
        type: "line",
        labels: ["UH1", "UH2", "UH3", "Tugas", "UTS"],
        values: [n.uh1, n.uh2, n.uh3, n.tugas, n.uts],
        color: "#7c3aed",
        label: "Grafik tren nilai ananda",
      });
    }
    const absenCv = document.getElementById("chartAbsen");
    if (absenCv) {
      const r = MCDB.getAbsensiRekapSiswa("10001");
      const total = r.h + r.i + r.s + r.a;
      mcChart(absenCv, {
        type: "bar",
        labels: ["Hadir", "Izin", "Sakit", "Alfa"],
        values: total ? [r.h, r.i, r.s, r.a] : [22, 1, 1, 0],
        color: ["#16a34a", "#f59e0b", "#3b82f6", "#ef4444"],
        min: 0,
        label: "Grafik rekap kehadiran ananda",
      });
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
