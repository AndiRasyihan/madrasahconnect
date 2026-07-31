// Tugas anak (ortu) – render dari MCDB, mengikuti status pengerjaan siswa
(function () {
  "use strict";

  const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function fmtDate(iso) {
    if (!iso) return "-";
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + BULAN[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  const ICON_BG = {
    "📐": "#def7ec", "⚗️": "#dbeafe", "🧪": "#fee2e2",
    "📖": "#e0e7ff", "🌐": "#fef3c7", "☪️": "#d1fae5", "📚": "#f3e8ff",
  };

  function render() {
    const wrap = document.getElementById("taskList");
    if (!wrap) return;
    const list = MCDB.get("tugas_list", []);
    const st = MCDB.get("tugas_status", {});
    const today = MCDB.todayISO();

    const items = list.map(function (t) {
      const s = st[t.id] || {};
      const done = !!s.done;
      const late = !done && t.deadline < today;
      return { t: t, done: done, late: late, doneAt: s.at };
    });
    items.sort(function (a, b) {
      const rank = function (x) { return x.done ? 2 : x.late ? 0 : 1; };
      return rank(a) - rank(b) || a.t.deadline.localeCompare(b.t.deadline);
    });

    if (!items.length) {
      wrap.innerHTML =
        '<p style="color:var(--gray-400);text-align:center;padding:28px">Belum ada tugas untuk ananda.</p>';
      return;
    }

    wrap.innerHTML = items
      .map(function (it) {
        const t = it.t;
        const dataSt = it.done ? "done" : it.late ? "late" : "active";
        const badge = it.done
          ? '<span class="badge badge-green">Selesai ✓</span>'
          : it.late
            ? '<span class="badge badge-red">Terlambat</span>'
            : '<span class="badge badge-yellow">Belum Dikumpulkan</span>';
        const doneInfo = it.done
          ? '<div class="task-grade" style="color:#059669;font-size:11px">Dikerjakan ' + fmtDate(it.doneAt) + "</div>"
          : "";
        return (
          '<div class="task-card" data-st="' + dataSt + '">' +
          '<div class="task-icon" style="background: ' + (ICON_BG[t.icon] || "#f3f4f6") + '">' + t.icon + "</div>" +
          '<div class="task-info">' +
          '<div class="task-title">' + esc(t.judul) + "</div>" +
          '<div class="task-meta"><span>' + t.icon + " " + esc(t.mapel) +
          "</span><span>👩‍🏫 " + esc(t.by) +
          "</span><span>📅 Deadline: " + fmtDate(t.deadline) + "</span></div>" +
          '<div class="task-desc">' + esc(t.desc) + "</div>" +
          "</div>" +
          '<div class="task-status">' + badge + doneInfo + "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  window.filterTask = function (btn, st) {
    btn.parentElement.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    document.querySelectorAll(".task-card").forEach(function (c) {
      c.style.display = st === "all" || c.dataset.st === st ? "flex" : "none";
    });
  };

  render();
})();
