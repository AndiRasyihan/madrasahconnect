function openEditProfile() {
  const u = MCAuth.currentUser() || {};
  mcModal(
    "✏️ Edit Profil",
    `
    <form id="editProfileForm" style="display:flex;flex-direction:column;gap:14px">
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Nama Lengkap</label><input type="text" id="epName" value="${u.name || ""}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">No. HP</label><input type="tel" id="epPhone" value="${u.phone || ""}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Alamat</label><input type="text" id="epAddr" value="${u.address || ""}" style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:4px">Bio</label><textarea id="epBio" rows="3" placeholder="Tuliskan bio singkat..." style="width:100%;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:13px;resize:vertical">${u.bio || ""}</textarea></div>
      <button type="submit" class="mc-btn mc-btn-primary" style="align-self:flex-end">💾 Simpan Perubahan</button>
    </form>
  `,
  );
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("epName").value.trim();
      const phone = document.getElementById("epPhone").value.trim();
      const addr = document.getElementById("epAddr").value.trim();
      const bio = document.getElementById("epBio").value.trim();
      if (name) {
        MCAuth.updateCurrentUser({
          name: name,
          phone: phone,
          address: addr,
          bio: bio,
          initials: name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        });
        const pn = document.querySelector(".profile-name");
        if (pn) pn.textContent = name;
        document
          .querySelectorAll(".sidebar-uname")
          .forEach((el) => (el.textContent = name));
      }
      document.querySelector(".mc-modal-overlay").remove();
      showToast("Profil berhasil disimpan permanen! ✅", "success");
    });
}

// Tampilkan data profil tersimpan saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
  const u = MCAuth.currentUser();
  if (!u) return;
  const pn = document.querySelector(".profile-name");
  if (pn) pn.textContent = u.name;
});
