// Rapor guru – render dari MCDB (students + nilai), export CSV & cetak nyata
(function () {
  "use strict";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function dataSiswa() {
    return MCDB.get("students", []).map(function (s, i) {
      const n = MCDB.nilaiSiswa(s.nis);
      const avg = (n.uh1 + n.uh2 + n.uh3 + n.tugas + n.uts) / 5;
      const pred = avg >= 88 ? "A" : avg >= 80 ? "B" : avg >= 72 ? "C" : "D";
      const hadir = 92 + (parseInt(s.nis, 10) % 8);
      return { no: i + 1, nis: s.nis, nama: s.nama, nilai: n, avg: avg, pred: pred, hadir: hadir };
    });
  }

  const PRED_BADGE = { A: "badge-green", B: "badge-blue", C: "badge-yellow", D: "badge-red" };

  function render() {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;
    tbody.innerHTML = dataSiswa()
      .map(function (d) {
        return (
          "<tr><td>" + d.no + "</td><td>" + d.nis +
          '</td><td style="font-weight:600">' + esc(d.nama) + "</td>" +
          '<td><span class="grade grade-' + d.pred.toLowerCase() + '">' + d.avg.toFixed(1) + "</span></td>" +
          '<td><span class="badge ' + PRED_BADGE[d.pred] + '">' + d.pred + "</span></td>" +
          "<td>" + d.hadir + '%</td><td><span class="badge badge-green">Siap</span></td>' +
          '<td><button class="action-btn" data-act="view" data-nis="' + d.nis + '">👁️</button>' +
          '<button class="action-btn" data-act="print" data-nis="' + d.nis + '">🖨️</button>' +
          '<button class="action-btn" data-act="pdf" data-nis="' + d.nis +
          '" aria-label="Unduh PDF rapor ' + esc(d.nama) + '">⬇️ PDF</button></td></tr>'
        );
      })
      .join("");
    wire();
  }

  function raporHTML(d) {
    const rows = [
      ["Ulangan Harian 1", d.nilai.uh1], ["Ulangan Harian 2", d.nilai.uh2],
      ["Ulangan Harian 3", d.nilai.uh3], ["Tugas", d.nilai.tugas], ["UTS", d.nilai.uts],
    ];
    return (
      '<div style="font-family:Georgia,serif;color:#111;padding:32px;max-width:640px;margin:0 auto">' +
      '<div style="text-align:center;border-bottom:3px double #111;padding-bottom:12px;margin-bottom:20px">' +
      '<div style="font-size:18px;font-weight:700">SMAN MUHAMMADIYAH 1</div>' +
      '<div style="font-size:12px">Jl. Kauman No. 1, Yogyakarta · MaConnect Portal Madrasah</div>' +
      '<div style="font-size:15px;font-weight:700;margin-top:10px">LAPORAN HASIL BELAJAR (RAPOR)</div>' +
      '<div style="font-size:12px">Semester Genap · Tahun Ajaran 2025/2026</div></div>' +
      '<table style="width:100%;font-size:13px;margin-bottom:16px">' +
      "<tr><td style='width:130px'>Nama</td><td>: <strong>" + esc(d.nama) + "</strong></td></tr>" +
      "<tr><td>NIS</td><td>: " + d.nis + "</td></tr>" +
      "<tr><td>Kelas</td><td>: X IPA 1</td></tr>" +
      "<tr><td>Kehadiran</td><td>: " + d.hadir + "%</td></tr></table>" +
      '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
      '<tr style="background:#f3f4f6"><th style="border:1px solid #999;padding:8px;text-align:left">Komponen (Matematika)</th>' +
      '<th style="border:1px solid #999;padding:8px">Nilai</th></tr>' +
      rows
        .map(function (r) {
          return (
            '<tr><td style="border:1px solid #999;padding:8px">' + r[0] +
            '</td><td style="border:1px solid #999;padding:8px;text-align:center">' + r[1] + "</td></tr>"
          );
        })
        .join("") +
      '<tr style="font-weight:700"><td style="border:1px solid #999;padding:8px">Rata-rata</td>' +
      '<td style="border:1px solid #999;padding:8px;text-align:center">' + d.avg.toFixed(1) +
      " (" + d.pred + ")</td></tr></table>" +
      '<div style="display:flex;justify-content:space-between;margin-top:40px;font-size:13px">' +
      '<div style="text-align:center">Orang Tua/Wali<br /><br /><br />(________________)</div>' +
      '<div style="text-align:center">Yogyakarta, ' + MCDB.todayISO() +
      "<br />Wali Kelas<br /><br />(Siti Rahma, S.Pd)</div></div></div>"
    );
  }

  function wire() {
    document.querySelectorAll("table [data-act]").forEach(function (btn) {
      const d = dataSiswa().find(function (x) { return x.nis === btn.dataset.nis; });
      if (!d) return;
      if (btn.dataset.act === "view") {
        btn.onclick = function () {
          mcModal(
            "📄 Rapor: " + esc(d.nama),
            "<p><strong>NIS:</strong> " + d.nis + "</p>" +
              "<p><strong>Rata-rata:</strong> " + d.avg.toFixed(1) + " · Predikat " + d.pred + "</p>" +
              "<p><strong>Kehadiran:</strong> " + d.hadir + "%</p>" +
              '<hr style="margin:12px 0">' +
              '<table style="width:100%;font-size:13px;border-collapse:collapse">' +
              '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">UH1 / UH2 / UH3</td><td style="padding:6px;font-weight:600">' +
              d.nilai.uh1 + " / " + d.nilai.uh2 + " / " + d.nilai.uh3 + "</td></tr>" +
              '<tr style="border-bottom:1px solid #e5e7eb"><td style="padding:6px">Tugas</td><td style="padding:6px;font-weight:600">' + d.nilai.tugas + "</td></tr>" +
              '<tr><td style="padding:6px">UTS</td><td style="padding:6px;font-weight:600">' + d.nilai.uts + "</td></tr></table>" +
              '<button class="mc-btn mc-btn-primary" style="margin-top:14px" onclick="this.closest(\'.mc-modal-overlay\').remove();window.printRapor(\'' + d.nis + "')\">🖨️ Cetak Rapor Ini</button>" +
              '<button class="mc-btn mc-btn-primary" style="margin-top:14px;margin-left:8px" onclick="window.pdfRapor(\'' + d.nis + "')\">⬇️ Unduh PDF</button>",
          );
        };
      } else if (btn.dataset.act === "pdf") {
        btn.onclick = function () { window.pdfRapor(d.nis); };
      } else {
        btn.onclick = function () { window.printRapor(d.nis); };
      }
    });
  }

  window.printRapor = function (nis) {
    const d = dataSiswa().find(function (x) { return x.nis === nis; });
    if (d) mcPrint(raporHTML(d));
  };

  // ── Unduh PDF (jsPDF lokal, jalan offline) ──
  window.pdfRapor = function (nis) {
    const d = dataSiswa().find(function (x) { return x.nis === nis; });
    if (!d) return;
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showToast("Modul PDF belum termuat — muat ulang halaman", "error");
      return;
    }
    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("SMAN MUHAMMADIYAH 1", 105, 20, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("Jl. Kauman No. 1, Yogyakarta · MaConnect Portal Madrasah", 105, 26, { align: "center" });
    doc.setLineWidth(0.8);
    doc.line(20, 30, 190, 30);
    doc.setLineWidth(0.2);
    doc.line(20, 31.2, 190, 31.2);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.text("LAPORAN HASIL BELAJAR (RAPOR)", 105, 41, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("Semester Genap · Tahun Ajaran 2025/2026", 105, 47, { align: "center" });

    const info = [
      ["Nama", d.nama], ["NIS", d.nis], ["Kelas", "X IPA 1"],
      ["Kehadiran", d.hadir + "%"],
    ];
    let y = 58;
    doc.setFontSize(11);
    info.forEach(function (r) {
      doc.text(r[0], 20, y);
      doc.text(": " + r[1], 55, y);
      y += 6.5;
    });

    // tabel nilai (grid manual)
    const rows = [
      ["Komponen (Matematika)", "Nilai"],
      ["Ulangan Harian 1", String(d.nilai.uh1)],
      ["Ulangan Harian 2", String(d.nilai.uh2)],
      ["Ulangan Harian 3", String(d.nilai.uh3)],
      ["Tugas", String(d.nilai.tugas)],
      ["UTS", String(d.nilai.uts)],
      ["Rata-rata", d.avg.toFixed(1) + " (" + d.pred + ")"],
    ];
    y += 4;
    const x0 = 20, x1 = 150, x2 = 190, rh = 9;
    rows.forEach(function (r, i) {
      const top = y + i * rh;
      if (i === 0 || i === rows.length - 1) {
        doc.setFillColor(243, 244, 246);
        doc.rect(x0, top, x2 - x0, rh, "F");
        doc.setFont("times", "bold");
      } else {
        doc.setFont("times", "normal");
      }
      doc.setDrawColor(150);
      doc.rect(x0, top, x1 - x0, rh);
      doc.rect(x1, top, x2 - x1, rh);
      doc.text(r[0], x0 + 3, top + 6);
      doc.text(r[1], (x1 + x2) / 2, top + 6, { align: "center" });
    });

    const sy = y + rows.length * rh + 22;
    doc.setFont("times", "normal");
    doc.text("Orang Tua/Wali", 40, sy, { align: "center" });
    doc.text("(________________)", 40, sy + 24, { align: "center" });
    doc.text("Yogyakarta, " + MCDB.todayISO(), 155, sy, { align: "center" });
    doc.text("Wali Kelas", 155, sy + 6, { align: "center" });
    doc.text("(Siti Rahma, S.Pd)", 155, sy + 24, { align: "center" });

    doc.save("rapor_" + d.nis + "_" + d.nama.replace(/\s+/g, "_") + ".pdf");
    showToast("PDF rapor " + d.nama + " berhasil diunduh ✅", "success");
  };

  // Topbar: export CSV & cetak rekap
  document.querySelectorAll(".topbar-btns .btn-outline, .topbar-btns .btn-primary").forEach(function (btn) {
    const t = btn.textContent.trim();
    if (t.indexOf("Export") !== -1) {
      btn.onclick = function () {
        let csv = "No,NIS,Nama,Rata-rata,Predikat,Kehadiran,Status\n";
        dataSiswa().forEach(function (d) {
          csv += [d.no, d.nis, d.nama.replace(/,/g, ""), d.avg.toFixed(1), d.pred, d.hadir + "%", "Siap"].join(",") + "\n";
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "rapor_10IPA_genap_2026.csv";
        a.click();
        showToast("Rapor berhasil diexport! ✅", "success");
      };
    } else if (t.indexOf("Cetak") !== -1) {
      btn.onclick = function () { window.print(); };
    }
  });

  render();
})();
