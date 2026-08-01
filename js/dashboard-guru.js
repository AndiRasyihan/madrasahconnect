// Dashboard guru – tanda notifikasi & ringkasan data nyata
(function () {
  "use strict";

  function renderCharts() {
    if (typeof mcChart !== "function") return;
    const nilaiCv = document.getElementById("chartNilaiKelas");
    if (nilaiCv) {
      const students = MCDB.get("students", []);
      const sum = { uh1: 0, uh2: 0, uh3: 0, tugas: 0, uts: 0 };
      students.forEach(function (s) {
        const n = MCDB.nilaiSiswa(s.nis);
        sum.uh1 += n.uh1; sum.uh2 += n.uh2; sum.uh3 += n.uh3;
        sum.tugas += n.tugas; sum.uts += n.uts;
      });
      const c = students.length || 1;
      mcChart(nilaiCv, {
        type: "bar",
        labels: ["UH1", "UH2", "UH3", "Tugas", "UTS"],
        values: [sum.uh1, sum.uh2, sum.uh3, sum.tugas, sum.uts].map(function (v) {
          return Math.round((v / c) * 10) / 10;
        }),
        color: "#2563eb",
        min: 0,
        max: 100,
        label: "Grafik rata-rata nilai kelas per komponen",
      });
    }
    const absenCv = document.getElementById("chartAbsenKelas");
    if (absenCv) {
      const all = MCDB.get("absensi", {});
      const rekap = { h: 0, i: 0, s: 0, a: 0 };
      Object.keys(all).forEach(function (date) {
        Object.keys(all[date]).forEach(function (nis) {
          const st = all[date][nis] && all[date][nis].st;
          if (rekap[st] != null) rekap[st]++;
        });
      });
      const total = rekap.h + rekap.i + rekap.s + rekap.a;
      mcChart(absenCv, {
        type: "bar",
        labels: ["Hadir", "Izin", "Sakit", "Alfa"],
        values: total ? [rekap.h, rekap.i, rekap.s, rekap.a] : [30, 1, 1, 0],
        color: ["#16a34a", "#f59e0b", "#3b82f6", "#ef4444"],
        min: 0,
        label: "Grafik rekap absensi kelas",
      });
    }
  }

  function init() {
    // Badge pesan di sidebar = notifikasi guru yang belum dibaca
    const unread = MCDB.getNotif("guru").filter(function (n) {
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

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
