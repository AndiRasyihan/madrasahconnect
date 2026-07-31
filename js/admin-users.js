// Kelola pengguna – tambah akun, reset sandi, hapus
(function () {
  "use strict";

  let filter = "all";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function updatePpdbBadge() {
    const n = MCDB.get("ppdb_pendaftar", []).filter(function (p) {
      return p.status === "Menunggu Verifikasi";
    }).length;
    const badge = document.getElementById("ppdbBadge");
    if (badge) {
      badge.textContent = n;
      badge.style.display = n > 0 ? "" : "none";
    }
  }

  function genPass() {
    const c = "bcdfghjkmnpqrstvwxz";
    const v = "aeiou";
    let p = "";
    for (let i = 0; i < 3; i++) {
      p += c[Math.floor(Math.random() * c.length)];
      p += v[Math.floor(Math.random() * v.length)];
    }
    return p + Math.floor(10 + Math.random() * 90);
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) {
        return w[0] || "";
      })
      .join("")
      .toUpperCase();
  }

  const ROLE_BADGE = {
    siswa: '<span class="adm-badge b-siswa">🎒 Siswa</span>',
    guru: '<span class="adm-badge b-guru">👩‍🏫 Guru</span>',
    ortu: '<span class="adm-badge b-ortu">👨‍👩‍👧 Ortu</span>',
    admin: '<span class="adm-badge b-admin">🛡️ Admin</span>',
  };

  function render() {
    const tbody = document.getElementById("usersTbody");
    const me = MCAuth.currentUser();
    let users = MCDB.get("users", []);
    if (filter !== "all")
      users = users.filter(function (u) {
        return u.role === filter;
      });
    if (!users.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="adm-empty">Tidak ada pengguna dengan peran ini.</td></tr>';
      return;
    }
    tbody.innerHTML = users
      .map(function (u) {
        const self = me && u.id === me.id;
        const del = self
          ? '<span style="color:var(--gray-300);font-size:11px">(akun Anda)</span>'
          : '<button class="adm-btn adm-btn-danger adm-btn-sm" data-act="del" data-id="' +
            u.id + '">🗑️ Hapus</button>';
        return (
          "<tr><td><strong>" + esc(u.name) + "</strong></td><td>" +
          (ROLE_BADGE[u.role] || esc(u.role)) + "</td><td>" +
          esc(u.username || "-") + "</td><td>" + esc(u.email || "-") +
          "</td><td style='font-size:12px;color:var(--gray-400)'>" +
          esc(u.info || "-") + "</td><td><div class='row-actions'>" +
          '<button class="adm-btn adm-btn-outline adm-btn-sm" data-act="pass" data-id="' +
          u.id + '">🔑 Reset Sandi</button>' + del + "</div></td></tr>"
        );
      })
      .join("");
    wire();
  }

  function wire() {
    document.querySelectorAll("#usersTbody [data-act]").forEach(function (btn) {
      btn.onclick = function () {
        const id = btn.dataset.id;
        if (btn.dataset.act === "del") delUser(id);
        else if (btn.dataset.act === "pass") resetPass(id);
      };
    });
  }

  function delUser(id) {
    const u = MCDB.get("users", []).find(function (x) {
      return x.id === id;
    });
    if (!u) return;
    const admins = MCDB.get("users", []).filter(function (x) {
      return x.role === "admin";
    });
    if (u.role === "admin" && admins.length <= 1) {
      showToast("Tidak bisa menghapus admin terakhir", "error");
      return;
    }
    mcConfirm(
      "Hapus Pengguna",
      "Hapus akun <strong>" + esc(u.name) + "</strong> (" +
        esc(u.username || u.email) +
        ")? Pengguna tidak akan bisa masuk lagi.",
      function () {
        MCDB.removeWhere("users", function (x) {
          return x.id === id;
        });
        render();
        showToast("Akun dihapus");
      },
      "Hapus",
      "mc-btn-danger",
    );
  }

  function resetPass(id) {
    const u = MCDB.get("users", []).find(function (x) {
      return x.id === id;
    });
    if (!u) return;
    mcConfirm(
      "Reset Kata Sandi",
      "Buat kata sandi baru untuk <strong>" + esc(u.name) + "</strong>?",
      function () {
        const np = genPass();
        MCDB.updateWhere(
          "users",
          function (x) {
            return x.id === id;
          },
          function (x) {
            x.pass = np;
            return x;
          },
        );
        mcModal(
          "🔑 Sandi Baru",
          '<p style="font-size:13px">Sandi baru untuk <strong>' + esc(u.name) +
            '</strong>:</p><div class="cred-box">Username: <code>' +
            esc(u.username || u.email) + "</code><br>Sandi baru: <code>" + esc(np) +
            '</code></div><div class="cred-warn">⚠️ Sampaikan sandi ini kepada pengguna terkait.</div>',
        );
        showToast("Sandi berhasil direset", "success");
      },
      "Reset Sandi",
      "mc-btn-primary",
    );
  }

  // ── Tambah pengguna ──
  function openAddModal() {
    mcModal(
      "➕ Tambah Pengguna",
      '<form id="addUserForm" class="adm-form">' +
        '<div class="form-group"><label for="auName">Nama Lengkap *</label><input id="auName" required placeholder="cth: Indah Lestari" /></div>' +
        '<div class="form-group"><label for="auRole">Peran *</label><select id="auRole">' +
        '<option value="siswa">🎒 Siswa</option><option value="guru">👩‍🏫 Guru</option>' +
        '<option value="ortu">👨‍👩‍👧 Orang Tua</option><option value="admin">🛡️ Admin</option></select></div>' +
        '<div class="form-group"><label for="auUsername">Username / NISN / NIP *</label><input id="auUsername" required placeholder="cth: 0069876543" /></div>' +
        '<div class="form-group"><label for="auEmail">Email</label><input id="auEmail" type="email" placeholder="opsional" /></div>' +
        '<div class="form-group"><label for="auInfo">Keterangan</label><input id="auInfo" placeholder="cth: Kelas 10 IPA / Guru Fisika" /></div>' +
        '<div class="form-group"><label for="auPass">Kata Sandi *</label><input id="auPass" value="' + genPass() + '" required /></div>' +
        '<button type="submit" class="adm-btn adm-btn-primary btn-block">Simpan Pengguna</button>' +
        "</form>",
    );
    document.getElementById("addUserForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("auName").value.trim();
      const role = document.getElementById("auRole").value;
      const username = document.getElementById("auUsername").value.trim();
      const email = document.getElementById("auEmail").value.trim();
      const info = document.getElementById("auInfo").value.trim();
      const pass = document.getElementById("auPass").value.trim();
      if (!name || !username || !pass) {
        showToast("Isi kolom bertanda *", "error");
        return;
      }
      const taken = MCDB.get("users", []).some(function (u) {
        return (
          (u.username && u.username.toLowerCase() === username.toLowerCase()) ||
          (email && u.email && u.email.toLowerCase() === email.toLowerCase())
        );
      });
      if (taken) {
        showToast("Username/email sudah dipakai pengguna lain", "error");
        return;
      }
      MCDB.push("users", {
        id: MCDB.uid(role[0]),
        role: role,
        name: name,
        initials: initials(name),
        email: email,
        username: username,
        pass: pass,
        info: info,
        phone: "",
        address: "",
      });
      document.querySelector(".mc-modal-overlay")?.remove();
      render();
      showToast("Pengguna " + name + " berhasil ditambahkan 🎉", "success");
    });
  }

  document.getElementById("btnAddUser").addEventListener("click", openAddModal);

  document.querySelectorAll(".f-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".f-tab").forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
      filter = tab.dataset.f;
      render();
    });
  });

  render();
  updatePpdbBadge();
})();
