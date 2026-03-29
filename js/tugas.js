function toggleTaskCheck(el) {
  const isChecked = el.classList.contains("checked");
  if (!isChecked) {
    el.classList.add("checked");
    el.textContent = "✓";
    el.setAttribute("aria-checked", "true");
    const title = el.parentElement.querySelector(".task-title");
    if (title) title.classList.add("completed");
    showToast("Tugas ditandai selesai ✓", "success");
  } else {
    el.classList.remove("checked");
    el.textContent = "";
    el.setAttribute("aria-checked", "false");
    const title = el.parentElement.querySelector(".task-title");
    if (title) title.classList.remove("completed");
    showToast("Tugas ditandai belum selesai");
  }
}
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
if (uploadArea) {
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
        uploadArea.innerHTML =
          '<div class="upload-icon">✅</div><p><strong>' +
          f.name +
          '</strong></p><p style="font-size:11px;margin-top:4px;color:var(--gray-400)">' +
          (f.size / 1024).toFixed(1) +
          " KB · Siap dikumpulkan</p>";
        showToast("File " + f.name + " berhasil dipilih ✅");
      }
    };
    input.click();
  };
}
