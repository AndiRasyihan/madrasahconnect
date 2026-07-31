// Riwayat pembayaran – render dari MCDB + kwitansi unduhan nyata
(function () {
  "use strict";

  function rupiah(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }
  function fmtTanggal(iso) {
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + bulan[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }

  function kwitansiText(b) {
    return [
      "═══════════════════════════════════════",
      "        KWITANSI PEMBAYARAN",
      "     MaConnect – SMAN Muhammadiyah 1",
      "═══════════════════════════════════════",
      "",
      "No. Referensi : " + (b.ref || "-"),
      "Tanggal       : " + fmtTanggal(b.paidAt),
      "Item          : " + b.item,
      "Jumlah        : " + rupiah(b.amount),
      "Metode        : " + (b.method || "-"),
      "Status        : LUNAS",
      "Siswa         : Ahmad Fauzi (Kelas 10 IPA)",
      "",
      "Terima kasih atas pembayaran Anda.",
      "Dokumen ini sah tanpa tanda tangan.",
      "═══════════════════════════════════════",
    ].join("\n");
  }

  function slipHTML(b) {
    return (
      '<div style="font-family:Georgia,serif;color:#111;padding:32px;max-width:560px;margin:0 auto">' +
      '<div style="text-align:center;border-bottom:3px double #111;padding-bottom:12px;margin-bottom:20px">' +
      '<div style="font-size:18px;font-weight:700">SMAN MUHAMMADIYAH 1</div>' +
      '<div style="font-size:12px">Jl. Kauman No. 1, Yogyakarta · MaConnect Portal Madrasah</div>' +
      '<div style="font-size:15px;font-weight:700;margin-top:10px">KWITANSI PEMBAYARAN</div></div>' +
      '<table style="width:100%;font-size:13px;line-height:2">' +
      "<tr><td style='width:140px'>No. Referensi</td><td>: <strong>" + (b.ref || "-") + "</strong></td></tr>" +
      "<tr><td>Tanggal</td><td>: " + fmtTanggal(b.paidAt) + "</td></tr>" +
      "<tr><td>Diterima dari</td><td>: H. Muhammad Fauzi</td></tr>" +
      "<tr><td>Untuk siswa</td><td>: Ahmad Fauzi (Kelas 10 IPA)</td></tr>" +
      "<tr><td>Pembayaran</td><td>: " + b.item + "</td></tr>" +
      "<tr><td>Metode</td><td>: " + (b.method || "-") + "</td></tr>" +
      '<tr><td>Jumlah</td><td>: <strong style="font-size:15px">' + rupiah(b.amount) + "</strong></td></tr>" +
      '<tr><td>Status</td><td>: <strong style="color:#166534">LUNAS ✓</strong></td></tr></table>' +
      '<div style="display:flex;justify-content:space-between;margin-top:40px;font-size:13px">' +
      '<div style="font-size:11px;color:#555;max-width:260px">Dokumen ini dicetak dari MaConnect dan sah tanpa tanda tangan basah.</div>' +
      '<div style="text-align:center">Bendahara Madrasah<br /><br /><br />(Drs. Abdul Hakim)</div></div></div>'
    );
  }

  function renderTable() {
    const tbody = document.querySelector(".card table tbody");
    if (!tbody) return;
    const paid = MCDB.get("pembayaran", []).filter(function (b) {
      return b.status === "paid";
    });
    paid.sort(function (a, b) {
      return (b.paidAt || "").localeCompare(a.paidAt || "");
    });
    tbody.innerHTML = paid
      .map(function (b, i) {
        return (
          "<tr><td>" + (i + 1) + "</td><td>" + fmtTanggal(b.paidAt) +
          '</td><td style="font-weight:600">' + b.item + "</td><td>" +
          (b.method || "-") + '</td><td style="font-weight:600">' +
          rupiah(b.amount) +
          '</td><td><span class="badge badge-green">Lunas</span></td>' +
          '<td><button class="action-btn" data-act="print" data-id="' + b.id +
          '">🖨️ Cetak Slip</button>' +
          '<button class="action-btn" data-act="txt" data-id="' + b.id +
          '">📄</button></td></tr>'
        );
      })
      .join("");
    tbody.querySelectorAll(".action-btn").forEach(function (btn) {
      btn.onclick = function () {
        const bill = MCDB.get("pembayaran", []).find(function (b) {
          return b.id === btn.dataset.id;
        });
        if (!bill) return;
        if (btn.dataset.act === "print") {
          mcPrint(slipHTML(bill));
        } else {
          downloadText(
            "kwitansi-" + (bill.ref || bill.id) + ".txt",
            kwitansiText(bill),
          );
          showToast("Kwitansi " + bill.item + " berhasil diunduh! 📄", "success");
        }
      };
    });

    // Statistik: total dibayar tahun ini & tagihan tertunda
    const stats = document.querySelectorAll(".stat-card .stat-num");
    const bills = MCDB.get("pembayaran", []);
    const unpaidTotal = bills
      .filter(function (b) {
        return b.status === "unpaid";
      })
      .reduce(function (s, b) {
        return s + b.amount;
      }, 0);
    if (stats.length >= 1) {
      const paidTotal = paid.reduce(function (s, b) {
        return s + b.amount;
      }, 0);
      stats[0].textContent = rupiah(paidTotal);
    }
    if (stats.length >= 3)
      stats[stats.length - 1].textContent = rupiah(unpaidTotal);
  }

  function init() {
    renderTable();
    const dlAll = document.querySelector(".btn-primary");
    if (dlAll)
      dlAll.onclick = function () {
        const paid = MCDB.get("pembayaran", []).filter(function (b) {
          return b.status === "paid";
        });
        let csv = "No,Tanggal,Deskripsi,Metode,Jumlah,Referensi\n";
        paid.forEach(function (b, i) {
          csv +=
            [i + 1, b.paidAt, b.item, b.method, b.amount, b.ref].join(",") +
            "\n";
        });
        downloadText("riwayat-transaksi-maconnect.csv", csv);
        showToast("Riwayat transaksi berhasil diunduh! 📥", "success");
      };
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
