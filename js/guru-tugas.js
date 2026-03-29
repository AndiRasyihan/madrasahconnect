function filterTask(btn, s) {
  btn.parentElement
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".task-table tbody tr").forEach((r) => {
    r.style.display = s === "all" || r.dataset.status === s ? "" : "none";
  });
}
function openModal() {
  document.getElementById("taskModal").classList.add("open");
}
function closeModal() {
  document.getElementById("taskModal").classList.remove("open");
}

/* --- Replace all showToast action-btn handlers --- */
document
  .querySelectorAll(".task-table .action-btn")
  .forEach(function (btn) {
    var txt = btn.textContent.trim();
    var row = btn.closest("tr");
    if (!row) return;
    var nama = row.querySelector("td strong")
      ? row.querySelector("td strong").textContent
      : "";
    var kelas = row.querySelectorAll("td")[1]
      ? row.querySelectorAll("td")[1].textContent.trim()
      : "";
    var status = row.dataset.status;

    if (txt.indexOf("Nilai") !== -1) {
      btn.onclick = function () {
        var pengumpulan = row.querySelectorAll("td")[3]
          ? row.querySelectorAll("td")[3].textContent.trim()
          : "";
        mcModal(
          "📊 Penilaian: " + nama,
          "<p><strong>Kelas:</strong> " +
            kelas +
            "</p>" +
            "<p><strong>Pengumpulan:</strong> " +
            pengumpulan +
            "</p>" +
            '<hr style="margin:12px 0">' +
            "<p>Rata-rata sementara: <strong>78.5</strong></p>" +
            "<p>Belum dinilai: <strong>5 siswa</strong></p>" +
            "<button class=\"mc-btn mc-btn-primary\" onclick=\"this.closest('.mc-modal-overlay').remove();window.location.href='guru-nilai.html'\">Buka Halaman Nilai</button>",
        );
      };
    } else if (txt.indexOf("Hasil") !== -1) {
      btn.onclick = function () {
        mcModal(
          "📄 Hasil: " + nama,
          "<p><strong>Kelas:</strong> " +
            kelas +
            "</p>" +
            "<p><strong>Status:</strong> Selesai (100%)</p>" +
            '<hr style="margin:12px 0">' +
            '<table style="width:100%;font-size:13px;border-collapse:collapse">' +
            '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Rata-rata</td><td style="padding:6px;font-weight:600">82.4</td></tr>' +
            '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Nilai Tertinggi</td><td style="padding:6px;font-weight:600">96</td></tr>' +
            '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Nilai Terendah</td><td style="padding:6px;font-weight:600">62</td></tr>' +
            '<tr><td style="padding:6px">Tuntas (KKM 75)</td><td style="padding:6px;font-weight:600;color:#059669">87%</td></tr>' +
            "</table>",
        );
      };
    } else if (txt.indexOf("Publish") !== -1) {
      btn.onclick = function () {
        var b = btn;
        mcConfirm(
          "Publikasikan Tugas",
          'Apakah Anda yakin ingin mempublikasikan "' +
            nama +
            '" ke siswa ' +
            kelas +
            "?",
          function () {
            var badge = row.querySelector(".status-badge");
            if (badge) {
              badge.textContent = "Aktif";
              badge.className = "status-badge st-aktif";
            }
            row.dataset.status = "aktif";
            b.remove();
            showToast("Tugas berhasil dipublikasikan! ✅");
          },
          "Publish",
          "mc-btn-primary",
        );
      };
    } else if (txt === "✏️") {
      btn.onclick = function () {
        mcModal(
          "✏️ Edit: " + nama,
          '<div class="form-group"><label>Judul Tugas</label><input type="text" class="form-input" value="' +
            nama +
            '" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
            '<div class="form-group"><label>Kelas</label><input type="text" class="form-input" value="' +
            kelas +
            '" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
            '<div class="form-group"><label>Deskripsi</label><textarea class="form-textarea" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;min-height:80px">Instruksi tugas untuk siswa...</textarea></div>' +
            "<button class=\"mc-btn mc-btn-primary\" onclick=\"this.closest('.mc-modal-overlay').remove();showToast('Perubahan disimpan ✅')\">Simpan Perubahan</button>",
        );
      };
    }
  });

/* --- Modal publish & draft buttons --- */
var modalBtns = document.querySelectorAll(
  "#taskModal .btn-primary, #taskModal .filter-btn",
);
modalBtns.forEach(function (b) {
  var t = b.textContent.trim();
  if (t === "Publikasikan") {
    b.onclick = function () {
      closeModal();
      showToast("Tugas berhasil dibuat dan dipublikasikan! ✅");
    };
  } else if (t.indexOf("Draft") !== -1) {
    b.onclick = function () {
      closeModal();
      showToast("Draft berhasil disimpan 📝");
    };
  }
});
