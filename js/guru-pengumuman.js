// Pengumuman guru – CRUD penuh ke MCDB, terbaca siswa & ortu
(function () {
  "use strict";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const bulan = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + bulan[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function renderList() {
    const list = document.querySelector(".ann-list");
    if (!list) return;
    const anns = MCDB.get("pengumuman", []);
    if (!anns.length) {
      list.innerHTML =
        '<p style="color:var(--gray-400);padding:24px;text-align:center">Belum ada pengumuman. Klik "+ Buat Pengumuman" untuk membuat.</p>';
      return;
    }
    list.innerHTML = anns
      .map(function (a) {
        const published = a.status === "published";
        const badge = published
          ? '<span class="ann-badge" style="background:var(--green-50);color:var(--green-600)">Terpublikasi</span>'
          : '<span class="ann-badge" style="background:#fef3c7;color:#d97706">Draft</span>';
        const pubBtn = published
          ? ""
          : '<button class="a-btn" data-act="publish" data-id="' +
            a.id +
            '">🚀 Publish</button>';
        return (
          '<div class="ann-card" data-id="' + a.id + '">' +
          '<div class="ann-header"><div class="ann-title">' +
          (a.icon || "📌") + " " + esc(a.title) +
          "</div>" + badge + "</div>" +
          '<div class="ann-meta"><span>📅 ' + fmtDate(a.date) +
          "</span><span>oleh: " + esc(a.author || "Guru") + "</span></div>" +
          '<div class="ann-body">' + esc(a.body) + "</div>" +
          '<div class="ann-footer"><div class="ann-target"><span class="ann-target-tag">' +
          esc(a.target || "Semua") + "</span></div>" +
          '<div class="ann-actions">' + pubBtn +
          '<button class="a-btn" data-act="edit" data-id="' + a.id +
          '">✏️ Edit</button>' +
          '<button class="a-btn" data-act="del" data-id="' + a.id +
          '">🗑️</button></div></div></div>'
        );
      })
      .join("");
    wireActions();
  }

  function wireActions() {
    document.querySelectorAll(".ann-list .a-btn").forEach(function (btn) {
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      btn.onclick = function () {
        if (act === "del") delAnn(id);
        else if (act === "publish") publishAnn(id);
        else if (act === "edit") editAnn(id);
      };
    });
  }

  function delAnn(id) {
    const ann = MCDB.get("pengumuman", []).find(function (a) {
      return a.id === id;
    });
    mcConfirm(
      "Hapus Pengumuman",
      'Yakin ingin menghapus "' + (ann ? ann.title : "") +
        '"? Tindakan ini tidak dapat dibatalkan.',
      function () {
        MCDB.removeWhere("pengumuman", function (a) {
          return a.id === id;
        });
        renderList();
        showToast("Pengumuman berhasil dihapus");
      },
      "Hapus",
      "mc-btn-danger",
    );
  }

  function publishAnn(id) {
    const ann = MCDB.get("pengumuman", []).find(function (a) {
      return a.id === id;
    });
    mcConfirm(
      "Publish Pengumuman",
      'Publikasikan "' + (ann ? ann.title : "") + '" ke seluruh penerima?',
      function () {
        MCDB.updateWhere(
          "pengumuman",
          function (a) {
            return a.id === id;
          },
          function (a) {
            a.status = "published";
            a.date = MCDB.todayISO();
            return a;
          },
        );
        MCDB.notify("siswa", "Pengumuman baru: " + (ann ? ann.title : ""));
        MCDB.notify("ortu", "Pengumuman baru: " + (ann ? ann.title : ""));
        renderList();
        showToast("Pengumuman berhasil dipublikasikan! 📢", "success");
      },
      "Publish",
      "mc-btn-primary",
    );
  }

  function editAnn(id) {
    const ann = MCDB.get("pengumuman", []).find(function (a) {
      return a.id === id;
    });
    if (!ann) return;
    mcModal(
      "✏️ Edit Pengumuman",
      '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Judul</label><input type="text" id="editAnnTitle" value="' +
        esc(ann.title) +
        '" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px"></div>' +
        '<div style="margin-bottom:12px"><label style="font-weight:600;display:block;margin-bottom:4px">Isi</label><textarea id="editAnnBody" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;min-height:100px">' +
        esc(ann.body) +
        "</textarea></div>" +
        '<button class="mc-btn mc-btn-primary" id="editAnnSave">Simpan</button>',
    );
    setTimeout(function () {
      const saveBtn = document.getElementById("editAnnSave");
      if (saveBtn)
        saveBtn.onclick = function () {
          const t = document.getElementById("editAnnTitle").value.trim();
          const b = document.getElementById("editAnnBody").value.trim();
          if (!t || !b) {
            showToast("Judul dan isi wajib diisi", "error");
            return;
          }
          MCDB.updateWhere(
            "pengumuman",
            function (a) {
              return a.id === id;
            },
            function (a) {
              a.title = t;
              a.body = b;
              return a;
            },
          );
          const overlay = saveBtn.closest(".mc-modal-overlay");
          if (overlay) overlay.remove();
          renderList();
          showToast("Pengumuman berhasil diperbarui ✅", "success");
        };
    }, 50);
  }

  window.openModal = function () {
    document.getElementById("modalOverlay").classList.add("show");
  };
  window.closeModal = function () {
    document.getElementById("modalOverlay").classList.remove("show");
  };

  function init() {
    renderList();

    // Tombol publikasikan pada modal "Buat Pengumuman"
    const pubBtn = document.querySelector("#modalOverlay .btn-primary");
    if (pubBtn)
      pubBtn.onclick = function () {
        const modal = document.querySelector("#modalOverlay .modal");
        const title = modal.querySelector('.form-input[type="text"]');
        const body = modal.querySelector(".form-textarea");
        const t = title ? title.value.trim() : "";
        const b = body ? body.value.trim() : "";
        if (!t || !b) {
          showToast("Judul dan isi pengumuman wajib diisi", "error");
          return;
        }
        const targets = [];
        modal
          .querySelectorAll(".form-group:nth-of-type(3) .form-check input")
          .forEach(function (cb) {
            if (cb.checked)
              targets.push(cb.parentElement.textContent.trim());
          });
        const user =
          typeof MCAuth !== "undefined" ? MCAuth.currentUser() : null;
        MCDB.push("pengumuman", {
          id: MCDB.uid("ann"),
          icon: "📢",
          title: t,
          body: b,
          category: "Umum",
          target: targets.join(", ") || "Semua Kelas",
          status: "published",
          date: MCDB.todayISO(),
          author: user ? user.name : "Guru",
        });
        MCDB.notify("siswa", "Pengumuman baru: " + t);
        MCDB.notify("ortu", "Pengumuman baru: " + t);
        if (title) title.value = "";
        if (body) body.value = "";
        window.closeModal();
        renderList();
        showToast("Pengumuman berhasil dipublikasikan! 📢", "success");
      };
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
