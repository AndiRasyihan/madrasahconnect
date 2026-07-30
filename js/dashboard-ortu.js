// Dashboard ortu – badge tagihan & notifikasi dari data nyata
(function () {
  "use strict";

  function init() {
    // Badge pembayaran = jumlah tagihan belum dibayar
    const unpaid = MCDB.get("pembayaran", []).filter(function (b) {
      return b.status === "unpaid";
    }).length;
    document
      .querySelectorAll('.sidebar-link[href*="pembayaran"] .sidebar-badge')
      .forEach(function (b) {
        if (unpaid > 0) b.textContent = unpaid;
        else b.remove();
      });

    // Badge pesan = notifikasi ortu belum dibaca
    const unread = MCDB.getNotif("ortu").filter(function (n) {
      return !n.read;
    }).length;
    document
      .querySelectorAll('.sidebar-link[href*="pesan"] .sidebar-badge')
      .forEach(function (b) {
        if (unread > 0) b.textContent = unread;
        else b.remove();
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
