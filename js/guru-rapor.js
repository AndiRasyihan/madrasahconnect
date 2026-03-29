/* --- Topbar buttons --- */
document
  .querySelectorAll(
    ".topbar-btns .btn-outline, .topbar-btns .btn-primary",
  )
  .forEach(function (btn) {
    var t = btn.textContent.trim();
    if (t.indexOf("Export") !== -1) {
      btn.onclick = function () {
        showToast("Menyiapkan export rapor...");
        setTimeout(function () {
          var csv = "No,NIS,Nama,Rata-rata,Predikat,Kehadiran,Status\n";
          document
            .querySelectorAll("table tbody tr")
            .forEach(function (r, i) {
              var cells = r.querySelectorAll("td");
              var row = [];
              cells.forEach(function (c, j) {
                if (j < 7)
                  row.push(c.textContent.trim().replace(/,/g, ""));
              });
              csv += row.join(",") + "\n";
            });
          var blob = new Blob([csv], { type: "text/csv" });
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "rapor_10IPA_genap_2026.csv";
          a.click();
          showToast("Rapor berhasil diexport! ✅");
        }, 1500);
      };
    } else if (t.indexOf("Cetak") !== -1) {
      btn.onclick = function () {
        mcConfirm(
          "Cetak Rapor Batch",
          'Cetak rapor untuk semua siswa yang statusnya "Siap"? (28 rapor)',
          function () {
            showToast("Menyiapkan cetak batch...");
            setTimeout(function () {
              showToast("28 rapor siap dicetak! 🖨️");
            }, 2000);
          },
          "Cetak Semua",
          "mc-btn-primary",
        );
      };
    }
  });

/* --- Per-student action buttons --- */
document.querySelectorAll("table tbody tr").forEach(function (row) {
  var cells = row.querySelectorAll("td");
  if (cells.length < 8) return;
  var nama = cells[2].textContent.trim();
  var nis = cells[1].textContent.trim();
  var avg = cells[3].textContent.trim();
  var predikat = cells[4].textContent.trim();
  var kehadiran = cells[5].textContent.trim();
  var status = cells[6].textContent.trim();

  row.querySelectorAll(".action-btn").forEach(function (btn) {
    var t = btn.textContent.trim();
    if (t === "👁️") {
      btn.onclick = function () {
        if (status.indexOf("Belum") !== -1) {
          mcModal(
            "📋 Preview: " + nama,
            "<p><strong>NIS:</strong> " +
              nis +
              "</p>" +
              "<p><strong>Rata-rata:</strong> " +
              avg +
              "</p>" +
              "<p><strong>Predikat:</strong> " +
              predikat +
              "</p>" +
              "<p><strong>Kehadiran:</strong> " +
              kehadiran +
              "</p>" +
              '<p style="color:#d97706;margin-top:12px">⚠️ Beberapa nilai belum lengkap. Lengkapi terlebih dahulu.</p>' +
              "<button class=\"mc-btn mc-btn-primary\" onclick=\"this.closest('.mc-modal-overlay').remove();window.location.href='guru-nilai.html'\">Lengkapi Nilai</button>",
          );
        } else {
          mcModal(
            "📄 Rapor: " + nama,
            "<p><strong>NIS:</strong> " +
              nis +
              "</p>" +
              "<p><strong>Rata-rata:</strong> " +
              avg +
              "</p>" +
              "<p><strong>Predikat:</strong> " +
              predikat +
              "</p>" +
              "<p><strong>Kehadiran:</strong> " +
              kehadiran +
              "</p>" +
              '<hr style="margin:12px 0">' +
              '<table style="width:100%;font-size:13px;border-collapse:collapse">' +
              '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Matematika Wajib</td><td style="padding:6px;font-weight:600">' +
              avg +
              "</td></tr>" +
              '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Matematika Peminatan</td><td style="padding:6px;font-weight:600">86</td></tr>' +
              '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Sikap Spiritual</td><td style="padding:6px;font-weight:600">Baik</td></tr>' +
              '<tr><td style="padding:6px">Sikap Sosial</td><td style="padding:6px;font-weight:600">Baik</td></tr>' +
              "</table>",
          );
        }
      };
    } else if (t === "🖨️") {
      btn.onclick = function () {
        mcConfirm(
          "Cetak Rapor",
          "Cetak rapor untuk " + nama + " (" + nis + ")?",
          function () {
            showToast("Mencetak rapor " + nama + "...");
            setTimeout(function () {
              showToast("Rapor " + nama + " siap! 🖨️");
            }, 1500);
          },
          "Cetak",
          "mc-btn-primary",
        );
      };
    } else if (t === "✏️") {
      btn.onclick = function () {
        window.location.href = "guru-nilai.html";
      };
    }
  });
});
