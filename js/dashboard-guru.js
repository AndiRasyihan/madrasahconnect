// Dashboard guru – tanda notifikasi & ringkasan data nyata
(function () {
  "use strict";

  function init() {
    // Badge pesan di sidebar = notifikasi guru yang belum dibaca
    const unread = MCDB.getNotif("guru").filter(function (n) {
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
