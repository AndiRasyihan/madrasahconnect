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
          '<td><button class="action-btn" data-id="' + b.id +
          '">📄 Kwitansi</button></td></tr>'
        );
      })
      .join("");
    tbody.querySelectorAll(".action-btn").forEach(function (btn) {
      btn.onclick = function () {
        const bill = MCDB.get("pembayaran", []).find(function (b) {
          return b.id === btn.dataset.id;
        });
        if (!bill) return;
        downloadText(
          "kwitansi-" + (bill.ref || bill.id) + ".txt",
          kwitansiText(bill),
        );
        showToast("Kwitansi " + bill.item + " berhasil diunduh! 📄", "success");
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
