// Fix class card clicks → show detail modal
document.querySelectorAll(".class-card").forEach((card) => {
  const title =
    card.querySelector(".class-title")?.textContent || "Kelas";
  card.onclick = function () {
    const stats = card.querySelector(".class-stats")?.innerHTML || "";
    mcModal(
      "🏫 " + title,
      '<div class="class-stats" style="display:flex;gap:16px;margin-bottom:16px">' +
        stats +
        '</div><p style="font-size:13px;color:var(--gray-500)">Klik tombol aksi di bawah kartu untuk mengelola kelas ini.</p>',
    );
  };
});
// Fix action buttons → navigate to guru pages
document.querySelectorAll(".ca-btn").forEach((btn) => {
  const text = btn.textContent.trim();
  btn.onclick = function (e) {
    e.stopPropagation();
    if (text.includes("Absensi"))
      window.location.href = "guru-absensi.html";
    else if (text.includes("Nilai"))
      window.location.href = "guru-nilai.html";
    else if (text.includes("Tugas"))
      window.location.href = "guru-tugas.html";
  };
});
// Fix search bar
const searchInput = document.querySelector(".search-bar[type=text]");
if (searchInput) {
  searchInput.onkeyup = function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll(".class-card").forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? "" : "none";
    });
  };
}
