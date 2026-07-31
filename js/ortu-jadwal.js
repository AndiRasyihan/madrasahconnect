// Jadwal anak (ortu) – render grid mingguan dari MCDB (sumber sama dgn siswa)
(function () {
  "use strict";

  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const SLOTS = [
    { key: "07:30", label: "07:30<br />09:00" },
    { key: "09:15", label: "09:15<br />10:45" },
    { key: "13:00", label: "13:00<br />14:30" },
    { key: "14:45", label: "14:45<br />16:00" },
  ];
  const SUBJ_CLASS = [
    [/matematika/i, "mat"], [/fisika/i, "fis"], [/kimia/i, "kim"],
    [/biologi/i, "bio"], [/indonesia/i, "ind"], [/inggris|reading/i, "eng"],
    [/informatika|robotika/i, "inf"], [/agama|pai/i, "pai"],
    [/penjas|badminton|olahraga/i, "pjok"], [/seni/i, "seni"],
    [/sejarah/i, "sej"], [/pkn|pancasila/i, "pkn"],
  ];

  function subjClass(name) {
    const hit = SUBJ_CLASS.find(function (p) { return p[0].test(name); });
    return hit ? hit[1] : "mat";
  }
  function stripEmoji(s) {
    return s.replace(/^[^\w]*\s*/, "").trim();
  }

  function render() {
    const grid = document.querySelector(".schedule-grid");
    if (!grid) return;
    const jadwal = MCDB.get("jadwal_pelajaran", {});
    let html = '<div class="sch-header">Waktu</div>';
    DAYS.forEach(function (d) {
      html += '<div class="sch-header">' + d + "</div>";
    });
    SLOTS.forEach(function (slot) {
      html += '<div class="sch-time">' + slot.label + "</div>";
      DAYS.forEach(function (d) {
        const entry = (jadwal[d] || []).find(function (e) {
          return e.time === slot.key && e.name;
        });
        if (!entry) {
          html += '<div class="sch-cell"></div>';
          return;
        }
        const meta = (entry.meta || "").split("·").map(function (x) { return x.trim(); });
        html +=
          '<div class="sch-cell"><div class="sch-item ' + subjClass(entry.name) + '">' +
          '<div class="subj">' + stripEmoji(entry.name) + "</div>" +
          '<div class="teacher">' + (meta[0] || "") + "</div>" +
          '<div class="room">' + (meta[1] || "") + "</div></div></div>";
      });
    });
    grid.innerHTML = html;
  }

  // Sorot header hari ini
  function highlightToday() {
    const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const today = HARI[new Date().getDay()];
    document.querySelectorAll(".sch-header").forEach(function (el) {
      if (el.textContent.trim() === today) {
        el.style.background = "var(--green-800, #166534)";
        el.setAttribute("title", "Hari ini");
      }
    });
  }

  render();
  highlightToday();
})();
