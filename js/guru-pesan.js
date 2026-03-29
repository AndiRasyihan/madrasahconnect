function selectChat(el) {
  document
    .querySelectorAll(".chat-item")
    .forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  el.classList.remove("unread");
  const b = el.querySelector(".ci-badge");
  if (b) b.remove();
  showToast("Membuka percakapan...");
}
function sendMsg() {
  const inp = document.getElementById("chatInput");
  const txt = inp.value.trim();
  if (!txt) return;
  const msgs = document.getElementById("chatMsgs");
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  const div = document.createElement("div");
  div.className = "msg msg-out";
  div.innerHTML =
    "<div>" +
    txt.replace(/</g, "&lt;") +
    '</div><div class="msg-time">' +
    time +
    "</div>";
  msgs.appendChild(div);
  inp.value = "";
  msgs.scrollTop = msgs.scrollHeight;
}
