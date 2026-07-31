// Tugas siswa – render dari MCDB, sinkron dengan guru & ortu
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

  function render() {
    const wrap = document.getElementById("taskList");
    if (!wrap) return;
    const list = MCDB.get("tugas_list", []);
    const st = MCDB.get("tugas_status", {});
    const today = MCDB.todayISO();

    const items = list.map(function (t) {
      const s = st[t.id] || {};
      const done = !!s.done;
      const overdue = !done && t.deadline < today;
      return { t: t, done: done, overdue: overdue, doneAt: s.at };
    });
    // urutan: terlambat → berjalan (deadline terdekat) → selesai
    items.sort(function (a, b) {
      const rank = function (x) { return x.done ? 2 : x.overdue ? 0 : 1; };
      return rank(a) - rank(b) || a.t.deadline.localeCompare(b.t.deadline);
    });

    if (!items.length) {
      wrap.innerHTML =
        '<p style="color:var(--gray-400);text-align:center;padding:28px">Belum ada tugas dari guru. 🎉</p>';
      return;
    }

    wrap.innerHTML = items
      .map(function (it) {
        const t = it.t;
        const cls = it.done ? "done" : it.overdue ? "overdue" : "upcoming";
        const dataStatus = it.done ? "done" : it.overdue ? "pending overdue" : "pending";
        const deadlineTag = it.done
          ? '<span class="task-tag tag-deadline-ok">✅ Selesai ' + fmtDate(it.doneAt) + "</span>"
          : it.overdue
            ? '<span class="task-tag tag-deadline">⏰ Terlambat (deadline ' + fmtDate(t.deadline) + ")</span>"
            : '<span class="task-tag tag-deadline">⏰ ' + fmtDate(t.deadline) + "</span>";
        return (
          '<div class="task-card ' + cls + '" data-status="' + dataStatus + '">' +
          '<div class="task-check' + (it.done ? " checked" : "") +
          '" data-id="' + t.id + '" role="checkbox" aria-checked="' + it.done +
          '" tabindex="0" aria-label="Tandai tugas ' + esc(t.judul) + '">' +
          (it.done ? "✓" : "") + "</div>" +
          '<div class="task-body" data-id="' + t.id + '">' +
          '<div class="task-title' + (it.done ? " completed" : "") + '">' + esc(t.judul) + "</div>" +
          '<div class="task-desc">' + esc(t.desc) + "</div>" +
          '<div class="task-tags">' +
          '<span class="task-tag tag-subject">' + t.icon + " " + esc(t.mapel) + "</span>" +
          deadlineTag +
          '<span class="task-tag tag-type">' + esc(t.jenis) + "</span>" +
          "</div></div></div>"
        );
      })
      .join("");
    wire();
  }

  function toggleTask(id) {
    const st = MCDB.get("tugas_status", {});
    const now = !(st[id] && st[id].done);
    st[id] = { done: now, at: MCDB.todayISO() };
    MCDB.set("tugas_status", st);
    const t = MCDB.get("tugas_list", []).find(function (x) { return x.id === id; });
    const judul = t ? t.judul : "";
    if (now) {
      MCDB.notify("guru", "Ahmad Fauzi menyelesaikan tugas: " + judul);
      MCDB.notify("ortu", "Ananda Ahmad menyelesaikan tugas: " + judul);
      showToast("Tugas ditandai selesai ✓", "success");
    } else {
      showToast("Tugas ditandai belum selesai");
    }
    render();
  }

  function wire() {
    document.querySelectorAll(".task-check").forEach(function (el) {
      el.onclick = function () { toggleTask(el.dataset.id); };
      el.onkeydown = function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTask(el.dataset.id);
        }
      };
    });
    document.querySelectorAll(".task-body").forEach(function (body) {
      body.onclick = function () {
        const t = MCDB.get("tugas_list", []).find(function (x) {
          return x.id === body.dataset.id;
        });
        if (!t) return;
        mcModal(
          "📋 Detail Tugas",
          '<h3 style="margin-bottom:8px">' + esc(t.judul) + "</h3>" +
            '<p style="color:var(--gray-500);margin-bottom:12px">' + esc(t.desc) + "</p>" +
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">' +
            '<span style="background:var(--gray-50);padding:4px 10px;border-radius:12px;font-size:11px">' +
            t.icon + " " + esc(t.mapel) + "</span>" +
            '<span style="background:var(--gray-50);padding:4px 10px;border-radius:12px;font-size:11px">⏰ ' +
            fmtDate(t.deadline) + "</span>" +
            '<span style="background:var(--gray-50);padding:4px 10px;border-radius:12px;font-size:11px">👩‍🏫 ' +
            esc(t.by) + "</span></div>",
        );
      };
    });
  }

  window.filterTasks = function (btn, status) {
    btn.parentElement.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    document.querySelectorAll(".task-card").forEach(function (card) {
      const cs = card.dataset.status || "";
      card.style.display =
        status === "all" || cs.includes(status) ? "" : "none";
    });
  };

  // ── Upload pengumpulan (tetap) ──
  const uploadArea = document.querySelector(".upload-area");
  function renderUploaded(f) {
    uploadArea.innerHTML =
      '<div class="upload-icon">✅</div><p><strong>' + esc(f.name) +
      '</strong></p><p style="font-size:11px;margin-top:4px;color:var(--gray-400)">' +
      (f.size / 1024).toFixed(1) + " KB · Dikumpulkan " + (f.at || "") + "</p>";
  }
  if (uploadArea) {
    const savedUp = MCDB.get("tugas_siswa", {})["upload_utama"];
    if (savedUp) renderUploaded(savedUp);
    uploadArea.onclick = function () {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx,.jpg,.png";
      input.onchange = function (e) {
        if (e.target.files.length) {
          const f = e.target.files[0];
          if (f.size > 10 * 1024 * 1024) {
            showToast("File terlalu besar! Maks 10MB");
            return;
          }
          const rec = {
            name: f.name,
            size: f.size,
            at: MCDB.todayISO() + " " + MCDB.nowTime(),
          };
          const sub = MCDB.get("tugas_siswa", {});
          sub["upload_utama"] = rec;
          MCDB.set("tugas_siswa", sub);
          MCDB.notify("guru", "Ahmad Fauzi mengumpulkan tugas: " + f.name);
          renderUploaded(rec);
          showToast("Tugas " + f.name + " berhasil dikumpulkan ✅", "success");
        }
      };
      input.click();
    };
  }

  render();
})();
