// Pesan guru – thread tersinkron dengan siswa & ortu via MCDB
(function () {
  "use strict";

  const MY_ID = "g1";
  // Urutan sama dengan .chat-item di HTML
  const THREADS = [
    { id: "th_siswa_guru", name: "Ahmad Fauzi", av: "AF" },
    { id: "th_ortu_guru", name: "H. Muhammad Fauzi", av: "MF" },
    { id: "th_g1_aisyah", name: "Aisyah Putri", av: "AP" },
    { id: "th_g1_budi", name: "Budi Santoso", av: "BS" },
    { id: "th_g1_citra", name: "Ibu Citra (Ortu Dimas)", av: "CD" },
    { id: "th_g1_nugroho", name: "Pak Ahmad Nugroho", av: "AN" },
    { id: "th_g1_grup", name: "Grup Kelas 10 IPA", av: "GK" },
  ];
  let current = 0;

  function fmtDateSep(iso) {
    if (iso === MCDB.todayISO()) return "Hari Ini";
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + bulan[parseInt(p[1], 10) - 1];
  }

  function renderThread(idx) {
    const meta = THREADS[idx];
    const th = MCDB.getThread(meta.id);
    const msgs = document.getElementById("chatMsgs");
    if (!th || !msgs) return;
    msgs.innerHTML = "";
    let lastDate = null;
    th.messages.forEach(function (m) {
      if (m.date !== lastDate) {
        msgs.innerHTML +=
          '<div class="msg-date">' + fmtDateSep(m.date) + "</div>";
        lastDate = m.date;
      }
      const dir = m.from === MY_ID ? "out" : "in";
      msgs.innerHTML +=
        '<div class="msg msg-' + dir + '"><div>' +
        m.text.replace(/</g, "&lt;") +
        '</div><div class="msg-time">' + m.time + "</div></div>";
    });
    msgs.scrollTop = msgs.scrollHeight;
    const nameEl = document.querySelector(".cm-name");
    const avEl = document.querySelector(".cm-av");
    if (nameEl) nameEl.textContent = meta.name;
    if (avEl) avEl.textContent = meta.av;
  }

  window.selectChat = function (el) {
    const items = Array.prototype.slice.call(
      document.querySelectorAll(".chat-item"),
    );
    const idx = items.indexOf(el);
    items.forEach(function (c) {
      c.classList.remove("active");
    });
    el.classList.add("active");
    el.classList.remove("unread");
    const b = el.querySelector(".ci-badge");
    if (b) b.remove();
    current = idx >= 0 ? idx : 0;
    renderThread(current);
  };

  window.sendMsg = function () {
    const inp = document.getElementById("chatInput");
    const txt = inp.value.trim();
    if (!txt) return;
    MCDB.sendMessage(THREADS[current].id, MY_ID, txt);
    if (THREADS[current].id === "th_siswa_guru")
      MCDB.notify("siswa", "Pesan baru dari Bu Siti Rahma");
    if (THREADS[current].id === "th_ortu_guru")
      MCDB.notify("ortu", "Pesan baru dari Bu Siti Rahma");
    inp.value = "";
    renderThread(current);
    showToast("Pesan terkirim");
  };

  function init() {
    renderThread(0);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
