// Pesan ortu – thread tersinkron dengan guru via MCDB
(function () {
  "use strict";

  const MY_ID = "o1";
  // Urutan sama dengan .contact-item di HTML
  const THREADS = [
    { id: "th_ortu_guru", name: "Siti Rahma, S.Pd", av: "SR" },
    { id: "th_o1_andi", name: "Andi Hermawan, M.Pd", av: "AH" },
    { id: "th_o1_dewi", name: "Dewi Safitri, S.Pd", av: "DS" },
    { id: "th_o1_rizki", name: "Muhammad Rizki, S.Pd", av: "MR" },
    { id: "th_o1_nur", name: "Nur Fadilah, S.Ag", av: "NF" },
  ];
  let current = 0;

  function renderThread(idx) {
    const meta = THREADS[idx];
    const th = MCDB.getThread(meta.id);
    const m = document.getElementById("chatMessages");
    if (!th || !m) return;
    m.innerHTML = "";
    th.messages.forEach(function (msg) {
      const dir = msg.from === MY_ID ? "out" : "in";
      m.innerHTML +=
        '<div class="msg msg-' + dir + '"><div>' +
        msg.text.replace(/</g, "&lt;") +
        '</div><div class="msg-time">' + msg.time + "</div></div>";
    });
    m.scrollTop = m.scrollHeight;
    const nameEl = document.querySelector(".chat-header-name");
    if (nameEl)
      nameEl.innerHTML =
        meta.name + ' <span class="online-dot"></span>';
    const avEl = document.querySelector(".chat-header .contact-av");
    if (avEl) avEl.textContent = meta.av;
  }

  window.sendMsg = function () {
    const i = document.getElementById("chatInput");
    const t = i.value.trim();
    if (!t) return;
    MCDB.sendMessage(THREADS[current].id, MY_ID, t);
    if (THREADS[current].id === "th_ortu_guru")
      MCDB.notify("guru", "Pesan baru dari H. Muhammad Fauzi (ortu)");
    i.value = "";
    renderThread(current);
    showToast("Pesan terkirim");
  };

  window.selectChat = function (idx) {
    document.querySelectorAll(".contact-item").forEach(function (c, i) {
      c.classList.toggle("active", i === idx);
      if (i === idx) {
        const u = c.querySelector(".contact-unread");
        if (u) u.remove();
      }
    });
    current = idx;
    renderThread(idx);
    document.querySelector(".main-area").classList.add("chat-open");
  };

  function init() {
    renderThread(0);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
