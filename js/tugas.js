function taskKey(el) {
  const card = el.closest(".task-card");
  const t = card ? card.querySelector(".task-title") : null;
  return "tugas:" + (t ? t.textContent.trim() : "");
}
function saveCheck(key, val) {
  const checks = MCDB.get("task_checks", {});
  checks[key] = val;
  MCDB.set("task_checks", checks);
}
function toggleTaskCheck(el) {
  const isChecked = el.classList.contains("checked");
  if (!isChecked) {
    el.classList.add("checked");
    el.textContent = "✓";
    el.setAttribute("aria-checked", "true");
    const title = el.parentElement.querySelector(".task-title");
    if (title) title.classList.add("completed");
    saveCheck(taskKey(el), true);
    showToast("Tugas ditandai selesai ✓", "success");
  } else {
    el.classList.remove("checked");
    el.textContent = "";
    el.setAttribute("aria-checked", "false");
    const title = el.parentElement.querySelector(".task-title");
    if (title) title.classList.remove("completed");
    saveCheck(taskKey(el), false);
    showToast("Tugas ditandai belum selesai");
  }
}
// Pulihkan status centang tersimpan
document.addEventListener("DOMContentLoaded", () => {
  const checks = MCDB.get("task_checks", {});
  document.querySelectorAll(".task-check").forEach((el) => {
    const key = taskKey(el);
    if (!(key in checks)) return;
    const shouldCheck = !!checks[key];
    const isChecked = el.classList.contains("checked");
    if (shouldCheck !== isChecked) {
      el.classList.toggle("checked", shouldCheck);
      el.textContent = shouldCheck ? "✓" : "";
      el.setAttribute("aria-checked", String(shouldCheck));
      const title = el.parentElement.querySelector(".task-title");
      if (title) title.classList.toggle("completed", shouldCheck);
    }
  });
});
document.querySelectorAll(".task-check").forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
});

function filterTasks(btn, status) {
  btn.parentElement
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".task-card").forEach((card) => {
    const cardStatus = card.dataset.status || "";
    if (status === "all") {
      card.style.display = "";
    } else if (status === "overdue") {
      card.style.display = cardStatus.includes("overdue") ? "" : "none";
    } else {
      card.style.display = cardStatus.includes(status) ? "" : "none";
    }
  });
  showToast("Filter: " + btn.textContent);
}

/* --- Task body click → detail modal --- */
document.querySelectorAll(".task-body").forEach(function (body) {
  var card = body.closest(".task-card");
  if (!card || card.classList.contains("done")) return;
  var title = body.querySelector(".task-title")
    ? body.querySelector(".task-title").textContent.trim()
    : "";
  var desc = body.querySelector(".task-desc")
    ? body.querySelector(".task-desc").textContent.trim()
    : "";
  var tags = [];
  body.querySelectorAll(".task-tag").forEach(function (t) {
    tags.push(t.textContent.trim());
  });

  body.onclick = function () {
    mcModal(
      "📋 Detail Tugas",
      '<h3 style="margin-bottom:8px">' +
        title +
        "</h3>" +
        '<p style="color:var(--gray-500);margin-bottom:12px">' +
        desc +
        "</p>" +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">' +
        tags
          .map(function (t) {
            return (
              '<span style="background:var(--gray-50);padding:4px 10px;border-radius:12px;font-size:11px">' +
              t +
              "</span>"
            );
          })
          .join("") +
        "</div>" +
        '<button class="mc-btn mc-btn-primary" onclick="this.closest(\'.mc-modal-overlay\').remove()">Tutup</button>',
    );
  };
});

/* --- Upload area enhancement --- */
var uploadArea = document.querySelector(".upload-area");
function renderUploaded(f) {
  uploadArea.innerHTML =
    '<div class="upload-icon">✅</div><p><strong>' +
    f.name +
    '</strong></p><p style="font-size:11px;margin-top:4px;color:var(--gray-400)">' +
    (f.size / 1024).toFixed(1) +
    " KB · Dikumpulkan " +
    (f.at || "") +
    "</p>";
}
if (uploadArea) {
  var savedUp = MCDB.get("tugas_siswa", {})["upload_utama"];
  if (savedUp) renderUploaded(savedUp);
  uploadArea.onclick = function () {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.jpg,.png";
    input.onchange = function (e) {
      if (e.target.files.length) {
        var f = e.target.files[0];
        if (f.size > 10 * 1024 * 1024) {
          showToast("File terlalu besar! Maks 10MB");
          return;
        }
        var rec = {
          name: f.name,
          size: f.size,
          at: MCDB.todayISO() + " " + MCDB.nowTime(),
        };
        var sub = MCDB.get("tugas_siswa", {});
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
