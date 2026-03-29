function sendMsg() {
  const i = document.getElementById("chatInput");
  const t = i.value.trim();
  if (!t) return;
  const m = document.getElementById("chatMessages");
  const d = document.createElement("div");
  d.className = "msg msg-out";
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const mn = now.getMinutes().toString().padStart(2, "0");
  d.innerHTML = `<div>${t.replace(/</g, "&lt;")}</div><div class="msg-time">${h}:${mn}</div>`;
  m.appendChild(d);
  m.scrollTop = m.scrollHeight;
  i.value = "";
  showToast("Pesan terkirim");
}
function selectChat(idx) {
  document.querySelectorAll(".contact-item").forEach((c, i) => {
    c.classList.toggle("active", i === idx);
  });
  showToast("Membuka percakapan...");
}
