const chats = {
  siti: [
    { t: "msg-date", c: "— Hari Ini —" },
    {
      t: "in",
      c: "Assalamu'alaikum Ahmad, bagaimana persiapan UTS Matematika-nya?",
      time: "09:15",
    },
    {
      t: "out",
      c: "Wa'alaikumussalam Bu, alhamdulillah sudah review materi Bab 3 dan 4.",
      time: "09:20",
    },
    {
      t: "in",
      c: "Bagus, jangan lupa kerjakan latihan soal di halaman 87-92 ya. Itu cakupan UTS.",
      time: "09:22",
    },
    {
      t: "out",
      c: "Baik Bu, insya Allah saya kerjakan malam ini 🤲",
      time: "09:25",
    },
    {
      t: "in",
      c: "Oh iya, tugas aljabar yang kemarin dikumpul besok ya, jangan sampai lupa.",
      time: "10:42",
    },
  ],
  ahmad: [
    { t: "msg-date", c: "— Kemarin —" },
    {
      t: "in",
      c: "Ahmad, essay puisi yang kamu kerjakan cukup bagus. Tapi coba perbaiki paragraf ketiga.",
      time: "14:10",
    },
    {
      t: "out",
      c: "Baik Pak, terima kasih banyak koreksinya. Nanti saya revisi.",
      time: "14:30",
    },
    {
      t: "in",
      c: "Seperti yang saya bilang di kelas, revisi dikumpul Kamis.",
      time: "15:00",
    },
  ],
  dewi: [
    { t: "msg-date", c: "— 22 Mar —" },
    {
      t: "in",
      c: "Ahmad, laporan praktikum Hukum Newton sudah saya periksa. Nilainya 88, bagus.",
      time: "11:00",
    },
    {
      t: "out",
      c: "Alhamdulillah, terima kasih Bu Dewi!",
      time: "11:15",
    },
    { t: "in", c: "Laporan praktikum sudah saya periksa", time: "11:20" },
  ],
  hamid: [
    { t: "msg-date", c: "— 20 Mar —" },
    {
      t: "in",
      c: "Assalamu'alaikum Ahmad, jangan lupa hafalan surat Al-Mulk ayat 1-15 untuk UTS.",
      time: "08:00",
    },
    {
      t: "out",
      c: "Wa'alaikumussalam Ustaz, insya Allah sudah hafal sampai ayat 12. Masih lanjut menghafal.",
      time: "08:30",
    },
    { t: "in", c: "Semangat ya, perbanyak muraja'ah.", time: "08:35" },
  ],
  wali: [
    { t: "msg-date", c: "— 18 Mar —" },
    {
      t: "in",
      c: "Ahmad, sampaikan ke orang tua bahwa ada rapat wali murid tanggal 5 April ya.",
      time: "13:00",
    },
    {
      t: "out",
      c: "Baik Bu Ani, nanti saya sampaikan ke Bapak.",
      time: "13:15",
    },
    {
      t: "in",
      c: "Terima kasih Ahmad, kamu siswa yang bertanggung jawab 👍",
      time: "13:20",
    },
  ],
};
const chatNames = {
  siti: {
    name: "Bu Siti Rahma",
    role: "Guru Matematika · Online",
    av: "SR",
    bg: "linear-gradient(135deg,var(--green-400),var(--teal-400))",
  },
  ahmad: {
    name: "Pak Ahmad",
    role: "Guru B. Indonesia · Terakhir online 2j lalu",
    av: "AH",
    bg: "linear-gradient(135deg,var(--blue-400),var(--green-400))",
  },
  dewi: {
    name: "Bu Dewi (Fisika)",
    role: "Guru Fisika · Offline",
    av: "DW",
    bg: "linear-gradient(135deg,#F59E0B,var(--coral-400))",
  },
  hamid: {
    name: "Ustaz Hamid (PAI)",
    role: "Guru PAI · Terakhir online 5j lalu",
    av: "HM",
    bg: "linear-gradient(135deg,var(--teal-400),var(--teal-600))",
  },
  wali: {
    name: "Wali Kelas (Bu Ani)",
    role: "Wali Kelas 10 IPA · Offline",
    av: "WK",
    bg: "linear-gradient(135deg,#8B5CF6,var(--blue-400))",
  },
};

function selectChat(el, key) {
  document
    .querySelectorAll(".chat-item")
    .forEach((i) => i.classList.remove("active"));
  el.classList.add("active");
  const u = el.querySelector(".chat-unread");
  if (u) u.remove();
  const info = chatNames[key];
  document.getElementById("chatHeaderName").textContent = info.name;
  document.getElementById("chatHeaderStatus").textContent = info.role;
  document.querySelector(".chat-header .chat-av").textContent = info.av;
  document.querySelector(".chat-header .chat-av").style.background =
    info.bg;
  const mc = document.getElementById("chatMessages");
  mc.innerHTML = "";
  chats[key].forEach((m) => {
    if (m.t === "msg-date") {
      mc.innerHTML += `<div class="msg-date">${m.c}</div>`;
    } else {
      mc.innerHTML += `<div class="msg msg-${m.t}">${m.c}<span class="msg-time">${m.time}</span></div>`;
    }
  });
  mc.scrollTop = mc.scrollHeight;
  document.getElementById("chatMain").classList.add("show");
}
function sendMessage() {
  const inp = document.getElementById("chatInput");
  const txt = inp.value.trim();
  if (!txt) return;
  const mc = document.getElementById("chatMessages");
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  mc.innerHTML += `<div class="msg msg-out">${txt}<span class="msg-time">${time}</span></div>`;
  inp.value = "";
  mc.scrollTop = mc.scrollHeight;
  setTimeout(() => {
    mc.innerHTML += `<div class="msg msg-in">Terima kasih atas pesannya, akan saya tindak lanjuti 🤲<span class="msg-time">${time}</span></div>`;
    mc.scrollTop = mc.scrollHeight;
  }, 1200);
}
function filterChats(q) {
  q = q.toLowerCase();
  document.querySelectorAll(".chat-item").forEach((i) => {
    i.style.display = i.dataset.name.includes(q) ? "flex" : "none";
  });
}
