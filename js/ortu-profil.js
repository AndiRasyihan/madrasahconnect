document.querySelectorAll(".btn-sm").forEach((btn) => {
  if (btn.textContent.includes("Edit")) {
    btn.onclick = function () {
      const card = btn.closest(".card");
      const rows = card.querySelectorAll(".info-row");
      let fields = "";
      rows.forEach((row) => {
        const label = row.querySelector(".info-label").textContent;
        const val = row.querySelector(".info-value").textContent;
        fields +=
          '<div style="margin-bottom:10px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">' +
          label +
          '</label><input type="text" value="' +
          val +
          '" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>';
      });
      mcModal(
        "✏️ Edit " +
          (card.querySelector(".card-title")?.textContent || "Data"),
        "<form onsubmit=\"event.preventDefault();document.querySelector('.mc-modal-overlay').remove();showToast('Data berhasil diperbarui! ✅')\">" +
          fields +
          '<button type="submit" class="mc-btn mc-btn-primary" style="margin-top:8px">💾 Simpan</button></form>',
      );
    };
  }
});
