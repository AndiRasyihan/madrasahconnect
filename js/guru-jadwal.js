// Replace schedule item showToast with detail modals
document.querySelectorAll(".sch-item").forEach((item) => {
  item.addEventListener("click", function () {
    const cls = item.querySelector(".cls")?.textContent || "";
    const room = item.querySelector(".room")?.textContent || "";
    mcModal(
      "📅 Detail Jadwal",
      "<p><strong>Kelas:</strong> " +
        cls +
        "</p><p><strong>Ruang:</strong> " +
        room +
        '</p><p><strong>Mata Pelajaran:</strong> Matematika</p><p style="margin-top:10px"><a href="guru-kelas.html" style="color:var(--green-600);font-weight:600">Lihat Detail Kelas →</a></p>',
    );
  });
});
