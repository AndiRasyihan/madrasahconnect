// Kelas guru – tabel siswa dari MCDB, kartu kelas interaktif
(function () {
  "use strict";

  function render() {
    const tbody = document.querySelector(".student-table tbody");
    if (!tbody) return;
    tbody.innerHTML = MCDB.get("students", [])
      .map(function (s, i) {
        const n = MCDB.nilaiSiswa(s.nis);
        const avg = ((n.uh1 + n.uh2 + n.uh3 + n.tugas + n.uts) / 5).toFixed(1);
        const hadir = 92 + (parseInt(s.nis, 10) % 8);
        return (
          "<tr><td>" + (i + 1) + "</td><td>" + s.nama + "</td><td>" + s.nis +
          '</td><td><strong style="color:var(--green-600)">' + avg + "</strong></td>" +
          "<td>" + hadir + '%</td><td><span style="color:var(--green-600);font-weight:600">✅ Aktif</span></td></tr>'
        );
      })
      .join("");
  }

  document.querySelectorAll(".class-card").forEach(function (card) {
    const title = card.querySelector(".class-title")?.textContent || "Kelas";
    card.onclick = function () {
      const stats = card.querySelector(".class-stats")?.innerHTML || "";
      mcModal(
        "🏫 " + title,
        '<div class="class-stats" style="display:flex;gap:16px;margin-bottom:16px">' +
          stats +
          '</div><p style="font-size:13px;color:var(--gray-500)">Klik tombol aksi di bawah kartu untuk mengelola kelas ini.</p>',
      );
    };
  });
  document.querySelectorAll(".ca-btn").forEach(function (btn) {
    const text = btn.textContent.trim();
    btn.onclick = function (e) {
      e.stopPropagation();
      if (text.includes("Absensi")) window.location.href = "guru-absensi.html";
      else if (text.includes("Nilai")) window.location.href = "guru-nilai.html";
      else if (text.includes("Tugas")) window.location.href = "guru-tugas.html";
    };
  });
  const searchInput = document.querySelector(".search-bar[type=text]");
  if (searchInput) {
    searchInput.onkeyup = function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll(".class-card").forEach(function (card) {
        card.style.display = !q || card.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    };
  }

  render();
})();
