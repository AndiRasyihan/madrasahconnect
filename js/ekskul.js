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
  const joined = MCDB.get("ekskul_joined", []);
  if (card.classList.contains("joined")) {
    card.classList.remove("joined");
    btn.className = "ekskul-btn ekskul-btn-join";
    btn.textContent = "Gabung";
    current = Math.max(0, current - 1);
    membersEl.textContent = "👥 " + current + "/" + max + " anggota";
    MCDB.set(
      "ekskul_joined",
      joined.filter((n) => n !== name),
    );
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
    if (!joined.includes(name)) {
      joined.push(name);
      MCDB.set("ekskul_joined", joined);
    }
    showToast("Berhasil bergabung ke " + name + "! ✅", "success");
  }
}

// Pulihkan status keanggotaan tersimpan
document.addEventListener("DOMContentLoaded", () => {
  const joined = MCDB.get("ekskul_joined", null);
  if (joined === null) {
    // simpan status awal dari HTML saat pertama kali
    const initial = [];
    document.querySelectorAll(".ekskul-card.joined .ekskul-name").forEach((n) =>
      initial.push(n.textContent.trim()),
    );
    MCDB.set("ekskul_joined", initial);
    return;
  }
  document.querySelectorAll(".ekskul-card").forEach((card) => {
    const name = card.querySelector(".ekskul-name")?.textContent.trim();
    const btn = card.querySelector(".ekskul-btn");
    if (!name || !btn) return;
    const shouldJoin = joined.includes(name);
    if (shouldJoin && !card.classList.contains("joined")) {
      card.classList.add("joined");
      btn.className = "ekskul-btn ekskul-btn-joined";
      btn.textContent = "✓ Bergabung";
    } else if (!shouldJoin && card.classList.contains("joined")) {
      card.classList.remove("joined");
      btn.className = "ekskul-btn ekskul-btn-join";
      btn.textContent = "Gabung";
    }
  });
});
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
