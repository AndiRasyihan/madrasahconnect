function filterAnn(cat, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".ann-card").forEach((c) => {
    c.style.display =
      cat === "all" || c.dataset.cat === cat ? "" : "none";
  });
}

// Tampilkan pengumuman baru yang dipublikasikan guru (dari MCDB)
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("annList");
  if (!list || typeof MCDB === "undefined") return;
  const fresh = MCDB.getPengumuman(true).filter((a) => !a.seeded);
  fresh
    .slice()
    .reverse()
    .forEach((a) => {
      const esc = (s) =>
        String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const card = document.createElement("div");
      card.className = "ann-card";
      card.dataset.cat = (a.category || "umum").toLowerCase();
      card.innerHTML =
        '<div class="ann-header"><div class="ann-icon">' +
        (a.icon || "📢") +
        '</div><div class="ann-meta"><div class="ann-category">' +
        esc(a.category || "Umum") +
        ' · <strong style="color:var(--green-600)">BARU</strong></div><div class="ann-title">' +
        esc(a.title) +
        '</div><div class="ann-date">📅 Diposting: ' +
        esc(a.date) +
        " · Oleh: " +
        esc(a.author || "Guru") +
        '</div></div></div><div class="ann-body">' +
        esc(a.body) +
        '</div><div class="ann-footer"><span class="ann-tag">' +
        esc(a.target || "Semua") +
        "</span></div>";
      list.insertBefore(card, list.firstChild);
    });
});
