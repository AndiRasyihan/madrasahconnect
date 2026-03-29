function openModal() {
  document.getElementById("modalOverlay").classList.add("show");
}
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
}

/* --- Announcement action buttons --- */
document.querySelectorAll(".ann-card").forEach(function (card) {
  var title = card.querySelector(".ann-title")
    ? card
        .querySelector(".ann-title")
        .textContent.replace(/^[📌📝🏆📋]\s*/, "")
    : "";
  var badge = card.querySelector(".ann-badge");
  var isDraft = badge && badge.textContent.trim() === "Draft";

  card.querySelectorAll(".a-btn").forEach(function (btn) {
    var t = btn.textContent.trim();
    if (t.indexOf("Edit") !== -1) {
      btn.onclick = function () {
        var body = card.querySelector(".ann-body")
          ? card.querySelector(".ann-body").textContent.trim()
          : "";
        mcModal(
          "✏️ Edit Pengumuman",
          '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Judul</label><input type="text" id="editAnnTitle" value="' +
            title.replace(/"/g, "&quot;") +
            '" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
            '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Isi</label><textarea id="editAnnBody" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;min-height:100px">' +
            body +
            "</textarea></div>" +
            "<button class=\"mc-btn mc-btn-primary\" onclick=\"var c=this.closest('.mc-modal-overlay');c.remove();showToast('Pengumuman berhasil diperbarui ✅')\">Simpan</button>",
        );
      };
    } else if (t.indexOf("🗑️") !== -1) {
      btn.onclick = function () {
        mcConfirm(
          "Hapus Pengumuman",
          'Yakin ingin menghapus "' +
            title +
            '"? Tindakan ini tidak dapat dibatalkan.',
          function () {
            card.style.transition = "opacity 0.3s";
            card.style.opacity = "0";
            setTimeout(function () {
              card.remove();
              showToast("Pengumuman berhasil dihapus");
            }, 300);
          },
          "Hapus",
          "mc-btn-danger",
        );
      };
    } else if (t.indexOf("Publish") !== -1) {
      btn.onclick = function () {
        mcConfirm(
          "Publish Pengumuman",
          'Publikasikan "' + title + '" ke seluruh penerima?',
          function () {
            if (badge) {
              badge.textContent = "Terpublikasi";
              badge.style.background = "var(--green-50)";
              badge.style.color = "var(--green-600)";
            }
            btn.remove();
            showToast("Pengumuman berhasil dipublikasikan! 📢");
          },
          "Publish",
          "mc-btn-primary",
        );
      };
    }
  });
});

/* --- Modal publish button --- */
var pubBtn = document.querySelector("#modalOverlay .btn-primary");
if (pubBtn) {
  pubBtn.onclick = function () {
    closeModal();
    showToast("Pengumuman berhasil dipublikasikan! 📢");
  };
}
