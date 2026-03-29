function openEditProfile() {
  mcModal(
    "✏️ Edit Profil",
    `
    <form id="editProfileForm" style="display:flex;flex-direction:column;gap:14px">
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Nama Lengkap</label><input type="text" value="Ahmad Fauzi" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">No. HP</label><input type="tel" value="0812-3456-7890" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Alamat</label><input type="text" value="Jl. Darmo No. 45, Surabaya" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Bio</label><textarea rows="3" placeholder="Tuliskan bio singkat..." style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px;resize:vertical"></textarea></div>
      <button type="submit" class="mc-btn mc-btn-primary" style="align-self:flex-end">💾 Simpan Perubahan</button>
    </form>
  `,
  );
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = this.querySelector("input[type=text]").value;
      if (name.trim()) {
        document.querySelector(".profile-name").textContent = name;
        document.querySelector(".sidebar-uname").textContent = name;
      }
      document.querySelector(".mc-modal-overlay").remove();
      showToast("Profil berhasil diperbarui! ✅");
    });
}
