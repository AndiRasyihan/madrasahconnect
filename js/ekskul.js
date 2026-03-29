function filterEkskul(btn, cat) {
  btn.parentElement
    .querySelectorAll(".ekskul-tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".ekskul-card").forEach((c) => {
    c.style.display =
      cat === "all" || c.dataset.cat === cat ? "block" : "none";
  });
}
function toggleEkskul(btn, name, e) {
  e.stopPropagation();
  const card = btn.closest(".ekskul-card");
  const membersEl = card.querySelector(".ekskul-members");
  const match = membersEl.textContent.match(/(\d+)\/(\d+)/);
  let current = parseInt(match[1]),
    max = parseInt(match[2]);
  if (card.classList.contains("joined")) {
    card.classList.remove("joined");
    btn.className = "ekskul-btn ekskul-btn-join";
    btn.textContent = "Gabung";
    current = Math.max(0, current - 1);
    membersEl.textContent = "👥 " + current + "/" + max + " anggota";
    showToast("Anda keluar dari " + name);
  } else {
    if (current >= max) {
      showToast("Kuota " + name + " penuh. Coba lagi nanti.");
      return;
    }
    card.classList.add("joined");
    btn.className = "ekskul-btn ekskul-btn-joined";
    btn.textContent = "✓ Bergabung";
    current++;
    membersEl.textContent = "👥 " + current + "/" + max + " anggota";
    showToast("Berhasil bergabung ke " + name + "! ✅");
  }
}
// Make card click show detail
document.querySelectorAll(".ekskul-card").forEach((card) => {
  card.addEventListener("click", function () {
    const name = card.querySelector(".ekskul-name").textContent;
    const desc = card.querySelector(".ekskul-desc").textContent;
    const meta = card
      .querySelector(".ekskul-meta")
      .textContent.trim()
      .replace(/\s+/g, " ");
    const members = card.querySelector(".ekskul-members").textContent;
    mcModal(
      name,
      "<p>" +
        desc +
        '</p><p style="font-size:12px;color:var(--gray-500);margin-top:8px">' +
        meta +
        '</p><p style="margin-top:8px;font-weight:600">' +
        members +
        "</p>",
    );
  });
});
