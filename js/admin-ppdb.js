// Verifikasi PPDB – terima pendaftar → buat akun siswa & ortu otomatis
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

  // ── Generator kredensial ──
  function genNISN() {
    const users = MCDB.get("users", []);
    let nisn;
    do {
      nisn = "26";
      for (let i = 0; i < 8; i++) nisn += Math.floor(Math.random() * 10);
    } while (
      users.some(function (u) {
        return u.username === nisn;
      })
    );
    return nisn;
  }

  function genPass() {
    // pola konsonan-vokal agar mudah dibaca/diketik
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

  function statusBadge(st) {
    if (st === "Diterima") return '<span class="adm-badge b-ok">✅ Diterima</span>';
    if (st === "Ditolak") return '<span class="adm-badge b-no">❌ Ditolak</span>';
    return '<span class="adm-badge b-wait">⏳ Menunggu Verifikasi</span>';
  }

  function render() {
    const tbody = document.getElementById("ppdbTbody");
    let list = MCDB.get("ppdb_pendaftar", []).slice().reverse();
    if (filter !== "all")
      list = list.filter(function (p) {
        return p.status === filter || (filter === "Menunggu Verifikasi" && !p.status);
      });
    if (!list.length) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="adm-empty">Tidak ada pendaftar' +
        (filter !== "all" ? " dengan status ini" : "") +
        ". Pendaftaran dilakukan lewat halaman PPDB publik.</td></tr>";
      return;
    }
    tbody.innerHTML = list
      .map(function (p) {
        let actions = "";
        if (p.status === "Diterima" && p.cred) {
          actions =
            '<button class="adm-btn adm-btn-outline adm-btn-sm" data-act="cred" data-id="' +
            p.id +
            '">🔑 Kredensial</button>';
        } else if (p.status !== "Ditolak" && p.status !== "Diterima") {
          actions =
            '<div class="row-actions"><button class="adm-btn adm-btn-primary adm-btn-sm" data-act="terima" data-id="' +
            p.id +
            '">✅ Terima</button><button class="adm-btn adm-btn-danger adm-btn-sm" data-act="tolak" data-id="' +
            p.id +
            '">❌ Tolak</button></div>';
        } else {
          actions = '<span style="color:var(--gray-300)">—</span>';
        }
        return (
          "<tr><td><strong>" + esc(p.ref) + "</strong></td><td>" +
          esc(p.nama) + "</td><td>" + esc(p.jenjang) + "</td><td>" +
          esc(p.email) + "<br><span style='color:var(--gray-400);font-size:11px'>" +
          esc(p.hp) + "</span></td><td>" + esc(p.date || "-") + "</td><td>" +
          statusBadge(p.status) + "</td><td>" + actions + "</td></tr>"
        );
      })
      .join("");
    wire();
  }

  function wire() {
    document.querySelectorAll("#ppdbTbody [data-act]").forEach(function (btn) {
      btn.onclick = function () {
        const id = btn.dataset.id;
        if (btn.dataset.act === "terima") terima(id);
        else if (btn.dataset.act === "tolak") tolak(id);
        else if (btn.dataset.act === "cred") showCred(id);
      };
    });
  }

  function credHTML(p) {
    const c = p.cred;
    return (
      '<p style="font-size:13px;margin-bottom:4px">Akun untuk <strong>' +
      esc(p.nama) + "</strong> (" + esc(p.ref) + "):</p>" +
      '<div class="cred-box">🎒 <strong>Siswa</strong><br>NISN: <code>' +
      esc(c.nisn) + "</code><br>Sandi: <code>" + esc(c.spass) + "</code></div>" +
      '<div class="cred-box">👨‍👩‍👧 <strong>Orang Tua</strong><br>Email: <code>' +
      esc(c.oemail) + "</code><br>Sandi: <code>" + esc(c.opass) + "</code></div>" +
      '<div class="cred-warn">⚠️ Sampaikan kredensial ini kepada orang tua siswa. Sandi dapat diubah lewat menu Pengaturan setelah masuk.</div>' +
      '<button class="adm-btn adm-btn-primary btn-block" style="margin-top:12px" id="btnCopyCred">📋 Salin Kredensial</button>'
    );
  }

  function openCredModal(p) {
    mcModal("🔑 Kredensial Akun", credHTML(p));
    const btn = document.getElementById("btnCopyCred");
    if (btn)
      btn.addEventListener("click", function () {
        const c = p.cred;
        const text =
          "Akun MaConnect utk " + p.nama + " — Siswa NISN: " + c.nisn +
          " / " + c.spass + " | Ortu: " + c.oemail + " / " + c.opass;
        navigator.clipboard.writeText(text).then(function () {
          showToast("Kredensial disalin 📋");
        });
      });
  }

  function terima(id) {
    const p = MCDB.get("ppdb_pendaftar", []).find(function (x) {
      return x.id === id;
    });
    if (!p) return;
    mcConfirm(
      "Terima Pendaftar",
      "Terima <strong>" + esc(p.nama) + "</strong> (" + esc(p.jenjang) +
        ")? Akun siswa dan orang tua akan dibuat otomatis.",
      function () {
        const nisn = genNISN();
        const spass = genPass();
        const opass = genPass();
        const sid = MCDB.uid("s");
        MCDB.push("users", {
          id: sid,
          role: "siswa",
          name: p.nama,
          initials: initials(p.nama),
          email: "",
          username: nisn,
          pass: spass,
          kelas: "X (Siswa Baru)",
          info: "Siswa Baru · " + p.jenjang,
          phone: p.hp,
          address: "",
        });
        MCDB.push("users", {
          id: MCDB.uid("o"),
          role: "ortu",
          name: "Orang Tua " + p.nama,
          initials: initials(p.nama),
          email: p.email,
          username: p.email,
          pass: opass,
          childId: sid,
          childName: p.nama,
          info: "Orang Tua · " + p.nama,
          phone: p.hp,
          address: "",
        });
        const cred = { nisn: nisn, spass: spass, oemail: p.email, opass: opass };
        MCDB.updateWhere(
          "ppdb_pendaftar",
          function (x) {
            return x.id === id;
          },
          function (x) {
            x.status = "Diterima";
            x.cred = cred;
            return x;
          },
        );
        render();
        updatePpdbBadge();
        showToast("Pendaftar diterima — akun berhasil dibuat 🎉", "success");
        openCredModal({ nama: p.nama, ref: p.ref, cred: cred });
      },
      "Terima & Buat Akun",
      "mc-btn-primary",
    );
  }

  function tolak(id) {
    const p = MCDB.get("ppdb_pendaftar", []).find(function (x) {
      return x.id === id;
    });
    if (!p) return;
    mcConfirm(
      "Tolak Pendaftar",
      "Tolak pendaftaran <strong>" + esc(p.nama) + "</strong> (" + esc(p.ref) + ")?",
      function () {
        MCDB.updateWhere(
          "ppdb_pendaftar",
          function (x) {
            return x.id === id;
          },
          function (x) {
            x.status = "Ditolak";
            return x;
          },
        );
        render();
        updatePpdbBadge();
        showToast("Pendaftaran ditolak");
      },
      "Tolak",
      "mc-btn-danger",
    );
  }

  function showCred(id) {
    const p = MCDB.get("ppdb_pendaftar", []).find(function (x) {
      return x.id === id;
    });
    if (p && p.cred) openCredModal(p);
  }

  // filter tabs
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
