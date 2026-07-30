function openGuruEdit() {
  const u = MCAuth.currentUser() || {};
  mcModal(
    "✏️ Edit Profil Guru",
    `
    <form id="guruEditForm" style="display:flex;flex-direction:column;gap:14px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Nama Lengkap</label><input type="text" id="geName" value="${u.name || ""}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">No. Telepon</label><input type="tel" id="gePhone" value="${u.phone || ""}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Email</label><input type="email" id="geEmail" value="${u.email || ""}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Bio</label><textarea id="geBio" rows="3" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px;resize:vertical">${u.bio || "Guru Matematika berpengalaman 12 tahun"}</textarea></div>
      <button type="submit" class="mc-btn mc-btn-primary" style="align-self:flex-end">💾 Simpan</button>
    </form>
  `,
  );
  document
    .getElementById("guruEditForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("geName").value.trim();
      const phone = document.getElementById("gePhone").value.trim();
      const email = document.getElementById("geEmail").value.trim();
      const bio = document.getElementById("geBio").value.trim();
      if (name) {
        MCAuth.updateCurrentUser({
          name: name,
          phone: phone,
          email: email,
          bio: bio,
        });
        const pb = document.querySelector(".pb-name");
        if (pb) pb.textContent = name;
        document
          .querySelectorAll(".sidebar-uname")
          .forEach((el) => (el.textContent = name));
      }
      document.querySelector(".mc-modal-overlay").remove();
      showToast("Profil berhasil disimpan permanen! ✅", "success");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const u = MCAuth.currentUser();
  if (!u) return;
  const pb = document.querySelector(".pb-name");
  if (pb) pb.textContent = u.name;
});
