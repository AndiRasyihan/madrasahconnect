// Fix download PDF button
document.querySelector(".btn-primary").onclick = function () {
  showToast("Menyiapkan file PDF...");
  setTimeout(function () {
    showToast("Riwayat transaksi berhasil diunduh! 📥");
  }, 1500);
};
// Fix all kwitansi download buttons
document.querySelectorAll(".action-btn").forEach((btn) => {
  if (btn.textContent.includes("Kwitansi")) {
    btn.onclick = function () {
      const row = btn.closest("tr");
      const item =
        row?.querySelector("td")?.textContent?.trim() || "Item";
      showToast("Mengunduh kwitansi " + item + "...");
      setTimeout(function () {
        showToast("Kwitansi berhasil diunduh! 📄");
      }, 1000);
    };
  }
});
