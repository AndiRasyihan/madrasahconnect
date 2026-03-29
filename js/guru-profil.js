function openGuruEdit() {
  mcModal(
    "✏️ Edit Profil Guru",
    `
    <form id="guruEditForm" style="display:flex;flex-direction:column;gap:14px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Nama Lengkap</label><input type="text" value="Siti Rahma, S.Pd" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">No. Telepon</label><input type="tel" value="0812-3456-7890" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Email</label><input type="email" value="siti.rahma@muh1.sch.id" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Bio</label><textarea rows="3" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px;resize:vertical">Guru Matematika berpengalaman 12 tahun</textarea></div>
      <button type="submit" class="mc-btn mc-btn-primary" style="align-self:flex-end">💾 Simpan</button>
    </form>
  `,
  );
  document
    .getElementById("guruEditForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = this.querySelector("input[type=text]").value;
      if (name.trim())
        document.querySelector(".pb-name").textContent = name;
      document.querySelector(".mc-modal-overlay").remove();
      showToast("Profil berhasil diperbarui! ✅");
    });
}
