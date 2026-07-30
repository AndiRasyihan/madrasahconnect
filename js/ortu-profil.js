// Edit data profil ortu — nilai tersimpan permanen per kartu
document.querySelectorAll(".btn-sm").forEach((btn) => {
  if (btn.textContent.includes("Edit")) {
    btn.onclick = function () {
      const card = btn.closest(".card");
      const rows = card.querySelectorAll(".info-row");
      let fields = "";
      rows.forEach((row, i) => {
        const label = row.querySelector(".info-label").textContent;
        const val = row.querySelector(".info-value").textContent;
        fields +=
          '<div style="margin-bottom:10px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">' +
          label +
          '</label><input type="text" data-idx="' + i + '" value="' +
          val.replace(/"/g, "&quot;") +
          '" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>';
      });
      const cardTitle =
        card.querySelector(".card-title")?.textContent || "Data";
      mcModal(
        "✏️ Edit " + cardTitle,
        '<form id="ortuEditForm">' +
          fields +
          '<button type="submit" class="mc-btn mc-btn-primary" style="margin-top:8px">💾 Simpan</button></form>',
      );
      document
        .getElementById("ortuEditForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const saved = {};
          this.querySelectorAll("input[data-idx]").forEach((inp) => {
            const i = parseInt(inp.dataset.idx, 10);
            const row = rows[i];
            row.querySelector(".info-value").textContent = inp.value;
            saved[row.querySelector(".info-label").textContent] = inp.value;
            if (
              /nama/i.test(row.querySelector(".info-label").textContent) &&
              inp.value.trim()
            ) {
              MCAuth.updateCurrentUser({ name: inp.value.trim() });
              document
                .querySelectorAll(".sidebar-uname")
                .forEach((el) => (el.textContent = inp.value.trim()));
            }
          });
          const extra = MCAuth.currentUser()?.profileExtra || {};
          extra[cardTitle] = saved;
          MCAuth.updateCurrentUser({ profileExtra: extra });
          document.querySelector(".mc-modal-overlay").remove();
          showToast("Data berhasil disimpan permanen! ✅", "success");
        });
    };
  }
});

// Pulihkan data profil tersimpan
document.addEventListener("DOMContentLoaded", () => {
  const extra = MCAuth.currentUser()?.profileExtra;
  if (!extra) return;
  document.querySelectorAll(".card").forEach((card) => {
    const title = card.querySelector(".card-title")?.textContent;
    if (!title || !extra[title]) return;
    card.querySelectorAll(".info-row").forEach((row) => {
      const label = row.querySelector(".info-label").textContent;
      if (extra[title][label] !== undefined)
        row.querySelector(".info-value").textContent = extra[title][label];
    });
  });
});
