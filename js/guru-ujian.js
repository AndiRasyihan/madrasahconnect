function filterSoal(btn, cat) {
  btn.parentElement
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".soal-card").forEach((c) => {
    c.style.display =
      cat === "all" || c.dataset.cat === cat ? "block" : "none";
  });
}

/* --- Soal card click → detail modal --- */
document.querySelectorAll(".soal-card").forEach(function (card) {
  var title = card.querySelector(".soal-title")
    ? card
        .querySelector(".soal-title")
        .textContent.replace(/^[📦📄📝]\s*/, "")
    : "";
  var meta = card.querySelector(".soal-meta")
    ? card.querySelector(".soal-meta").textContent.trim()
    : "";
  var count = card.querySelector(".soal-count")
    ? card.querySelector(".soal-count").textContent.trim()
    : "";
  var badge = card.querySelector(".soal-badge")
    ? card.querySelector(".soal-badge").textContent.trim()
    : "";
  var tags = [];
  card.querySelectorAll(".soal-tag").forEach(function (t) {
    tags.push(t.textContent);
  });

  card.onclick = function () {
    mcModal(
      "📋 " + title,
      "<p><strong>Status:</strong> " +
        badge +
        "</p>" +
        "<p><strong>Info:</strong> " +
        meta +
        "</p>" +
        "<p><strong>Jumlah:</strong> " +
        count +
        "</p>" +
        (tags.length
          ? "<p><strong>Topik:</strong> " + tags.join(", ") + "</p>"
          : "") +
        '<hr style="margin:12px 0">' +
        '<p style="color:var(--gray-400);font-size:13px">Klik tombol aksi di bawah kartu untuk mengedit, melihat preview, atau mencetak soal.</p>',
    );
  };
});

/* --- Action buttons inside soal cards --- */
document.querySelectorAll(".sa-btn").forEach(function (btn) {
  var txt = btn.textContent.trim();
  var card = btn.closest(".soal-card");
  var title =
    card && card.querySelector(".soal-title")
      ? card
          .querySelector(".soal-title")
          .textContent.replace(/^[📦📄📝]\s*/, "")
      : "";

  if (txt === "✏️") {
    btn.onclick = function (e) {
      e.stopPropagation();
      mcModal(
        "✏️ Edit: " + title,
        '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Judul</label><input type="text" value="' +
          title +
          '" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
          '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Deskripsi</label><textarea style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;min-height:80px">Deskripsi soal...</textarea></div>' +
          "<button class=\"mc-btn mc-btn-primary\" onclick=\"this.closest('.mc-modal-overlay').remove();showToast('Perubahan disimpan ✅')\">Simpan</button>",
      );
    };
  } else if (txt === "👁️") {
    btn.onclick = function (e) {
      e.stopPropagation();
      mcModal(
        "👁️ Preview: " + title,
        '<div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:12px">' +
          '<p style="font-weight:600;margin-bottom:8px">Soal 1 (Pilihan Ganda)</p>' +
          "<p>Tentukan nilai x dari persamaan 2x + 5 = 15</p>" +
          '<div style="margin-top:8px;font-size:13px"><div>A. x = 3</div><div>B. x = 5 ✅</div><div>C. x = 7</div><div>D. x = 10</div></div>' +
          "</div>" +
          '<div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:12px">' +
          '<p style="font-weight:600;margin-bottom:8px">Soal 2 (Essay)</p>' +
          "<p>Jelaskan langkah-langkah penyelesaian sistem persamaan linear dua variabel.</p>" +
          "</div>" +
          '<p style="color:var(--gray-400);font-size:12px;text-align:center">...dan soal lainnya</p>',
      );
    };
  } else if (txt === "🖨️") {
    btn.onclick = function (e) {
      e.stopPropagation();
      mcConfirm(
        "Cetak Soal",
        'Cetak semua soal dari "' + title + '"?',
        function () {
          showToast("Menyiapkan file cetak...");
          setTimeout(function () {
            showToast("File cetak siap! 🖨️");
          }, 1500);
        },
        "Cetak",
        "mc-btn-primary",
      );
    };
  } else if (txt === "📋") {
    btn.onclick = function (e) {
      e.stopPropagation();
      mcConfirm(
        "Duplikat Soal",
        'Buat salinan dari "' + title + '"?',
        function () {
          showToast("Berhasil diduplikat! 📋");
        },
        "Duplikat",
        "mc-btn-primary",
      );
    };
  } else if (txt === "🚀") {
    btn.onclick = function (e) {
      e.stopPropagation();
      mcConfirm(
        "Publish Soal",
        'Publish "' + title + '" agar bisa digunakan dalam ujian?',
        function () {
          var cardBadge = card.querySelector(".soal-badge");
          if (cardBadge) {
            cardBadge.textContent = "Aktif";
            cardBadge.style.background = "var(--green-50)";
            cardBadge.style.color = "var(--green-600)";
          }
          showToast("Soal berhasil dipublish! ✅");
        },
        "Publish",
        "mc-btn-primary",
      );
    };
  }
});

/* --- Buat Soal Baru button in topbar --- */
var buatBtn = document.querySelector(".topbar .btn-primary");
if (buatBtn && buatBtn.textContent.trim().indexOf("Buat Soal") !== -1) {
  buatBtn.onclick = function () {
    mcModal(
      "📝 Buat Soal Baru",
      '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Tipe Soal</label><select style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"><option>Pilihan Ganda</option><option>Essay</option><option>Paket Ujian</option></select></div>' +
        '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Judul</label><input type="text" placeholder="Contoh: PG - Aljabar Bab 4" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
        '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Kelas</label><select style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"><option>Kelas 10 IPA</option><option>Kelas 10 IPS</option><option>Kelas 11 IPA</option><option>Kelas 11 IPS</option><option>Kelas 12 IPA</option><option>Kelas 12 IPS</option></select></div>' +
        '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Topik</label><input type="text" placeholder="Contoh: Aljabar, Matriks" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
        "<button class=\"mc-btn mc-btn-primary\" onclick=\"this.closest('.mc-modal-overlay').remove();showToast('Soal baru berhasil dibuat! ✅')\">Buat Soal</button>",
    );
  };
}
