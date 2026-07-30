// Pembayaran ortu – status tagihan tersimpan permanen di MCDB
(function () {
  "use strict";

  let method = "VA BCA";

  function rupiah(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  function fmtTanggal(iso) {
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + bulan[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  window.selMethod = function (el) {
    el.parentElement
      .querySelectorAll(".method-opt")
      .forEach(function (m) {
        m.classList.remove("sel");
      });
    el.classList.add("sel");
    method = el.textContent.trim();
  };

  function renderBills() {
    const bills = MCDB.get("pembayaran", []);
    const unpaid = bills.filter(function (b) {
      return b.status === "unpaid";
    });
    const paid = bills.filter(function (b) {
      return b.status === "paid";
    });

    const cards = document.querySelectorAll(".pay-grid .card .card-body");
    if (cards[0]) {
      cards[0].innerHTML = unpaid.length
        ? unpaid
            .map(function (b) {
              return (
                '<div class="bill-item"><div class="bi-info"><div class="bi-icon" style="background:#fef3c7">💰</div><div><div class="bi-name">' +
                b.item +
                '</div><div class="bi-desc">Ahmad Fauzi – Kelas 10 IPA</div></div></div><div class="bi-amount"><div class="bi-price">' +
                rupiah(b.amount) +
                '</div><div class="bi-due"><span class="badge badge-red">Belum Bayar</span></div></div></div>'
              );
            })
            .join("")
        : '<p style="color:var(--green-600);font-weight:600;padding:12px">🎉 Alhamdulillah, semua tagihan sudah lunas!</p>';
    }
    if (cards[1]) {
      cards[1].innerHTML = paid
        .slice(0, 4)
        .map(function (b) {
          return (
            '<div class="bill-item"><div class="bi-info"><div class="bi-icon" style="background:#def7ec">✅</div><div><div class="bi-name">' +
            b.item +
            '</div><div class="bi-desc">Dibayar: ' +
            fmtTanggal(b.paidAt) +
            " · " +
            b.method +
            '</div></div></div><div class="bi-amount"><div class="bi-price">' +
            rupiah(b.amount) +
            '</div><div class="bi-due"><span class="badge badge-green">Lunas</span></div></div></div>'
          );
        })
        .join("");
    }

    // Panel ringkasan bayar
    const summary = document.querySelector(".pay-summary");
    if (summary) {
      const btn = summary.querySelector(".btn-primary");
      if (!unpaid.length) {
        summary.querySelector(".ps-title").textContent =
          "✅ Tidak Ada Tagihan";
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Semua Lunas";
          btn.style.opacity = "0.6";
          btn.onclick = null;
        }
      } else {
        const bill = unpaid[0];
        summary.querySelector(".ps-title").textContent =
          "💳 Bayar " + bill.item.replace("SPP Bulan ", "SPP ");
        const rows = summary.querySelectorAll(".ps-row");
        if (rows[0])
          rows[0].innerHTML =
            "<span>SPP Bulanan</span><span>" + rupiah(bill.amount) + "</span>";
        if (rows[1])
          rows[1].innerHTML =
            "<span>Biaya Admin</span><span>" +
            rupiah(bill.admin || 2500) +
            "</span>";
        const total = summary.querySelector(".ps-total");
        if (total)
          total.innerHTML =
            "<span>Total</span><span>" +
            rupiah(bill.amount + (bill.admin || 2500)) +
            "</span>";
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Bayar Sekarang";
          btn.style.opacity = "";
          btn.onclick = function () {
            payBill(bill.id);
          };
        }
      }
    }
  }

  function payBill(id) {
    const bill = MCDB.get("pembayaran", []).find(function (b) {
      return b.id === id;
    });
    if (!bill) return;
    const va =
      "8800-" +
      String(Math.floor(1000 + Math.random() * 9000)) +
      "-" +
      String(Math.floor(1000 + Math.random() * 9000)) +
      "-" +
      String(Math.floor(1000 + Math.random() * 9000));
    mcConfirm(
      "Konfirmasi Pembayaran",
      "Bayar " +
        bill.item +
        " sebesar " +
        rupiah(bill.amount + (bill.admin || 2500)) +
        " via " +
        method +
        "?",
      function () {
        const ref =
          "TRX-" +
          MCDB.todayISO().replace(/-/g, "") +
          "-" +
          Math.floor(1000 + Math.random() * 9000);
        MCDB.updateWhere(
          "pembayaran",
          function (b) {
            return b.id === id;
          },
          function (b) {
            b.status = "paid";
            b.method = method;
            b.paidAt = MCDB.todayISO();
            b.ref = ref;
            return b;
          },
        );
        MCDB.notify("ortu", "Pembayaran " + bill.item + " berhasil (" + ref + ")");
        renderBills();
        mcModal(
          "✅ Pembayaran Berhasil",
          "<p style='margin-bottom:8px'>Pembayaran <strong>" +
            bill.item +
            "</strong> berhasil diproses.</p>" +
            "<p style='font-size:13px;color:var(--gray-500)'>Nomor VA: <strong>" +
            va +
            "</strong><br>No. Referensi: <strong>" +
            ref +
            "</strong><br>Metode: " +
            method +
            "</p>" +
            "<button class='mc-btn mc-btn-primary' style='margin-top:12px' onclick='this.closest(\".mc-modal-overlay\").remove()'>Selesai</button>",
        );
        showToast("Pembayaran berhasil! Ref: " + ref, "success");
      },
      "Bayar",
      "mc-btn-primary",
    );
  }

  function init() {
    renderBills();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
