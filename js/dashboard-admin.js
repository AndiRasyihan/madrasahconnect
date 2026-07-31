// Dashboard admin – statistik, pendaftar terbaru, backup/restore data
(function () {
  "use strict";

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
    return n;
  }

  function renderStats() {
    const users = MCDB.get("users", []);
    const count = function (role) {
      return users.filter(function (u) {
        return u.role === role;
      }).length;
    };
    document.getElementById("statSiswa").textContent = count("siswa");
    document.getElementById("statGuru").textContent = count("guru");
    document.getElementById("statOrtu").textContent = count("ortu");
    const pending = updatePpdbBadge();
    document.getElementById("statPpdb").textContent = pending;
    document.getElementById("statPpdbInfo").textContent = pending
      ? "perlu ditindaklanjuti"
      : "belum ada pendaftar baru";
  }

  function renderRecent() {
    const box = document.getElementById("ppdbRecent");
    const list = MCDB.get("ppdb_pendaftar", []).slice(-5).reverse();
    if (!list.length) {
      box.innerHTML =
        '<p style="font-size:13px;color:var(--gray-400);text-align:center;padding:16px 0">Belum ada pendaftar PPDB.</p>';
      return;
    }
    const badge = function (st) {
      if (st === "Diterima")
        return '<span class="adm-badge b-ok">Diterima</span>';
      if (st === "Ditolak") return '<span class="adm-badge b-no">Ditolak</span>';
      return '<span class="adm-badge b-wait">Menunggu</span>';
    };
    box.innerHTML = list
      .map(function (p) {
        return (
          '<div class="rec-item"><div><div class="rec-name">' +
          esc(p.nama) +
          '</div><div class="rec-meta">' +
          esc(p.ref) +
          " · " +
          esc(p.jenjang) +
          " · " +
          esc(p.date) +
          "</div></div>" +
          badge(p.status) +
          "</div>"
        );
      })
      .join("");
  }

  // ── Backup / Restore ──
  function exportData() {
    const data = { _app: "MaConnect", _exportedAt: new Date().toISOString() };
    Object.keys(localStorage).forEach(function (k) {
      if (k.indexOf("mc_db_") === 0 || k === "mc_db_version")
        data[k] = localStorage.getItem(k);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "maconnect-backup-" + MCDB.todayISO() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Cadangan berhasil diunduh 💾", "success");
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = function () {
      let data;
      try {
        data = JSON.parse(reader.result);
      } catch (e) {
        showToast("File cadangan tidak valid", "error");
        return;
      }
      if (data._app !== "MaConnect" || !data["mc_db_users"]) {
        showToast("Ini bukan file cadangan MaConnect", "error");
        return;
      }
      mcConfirm(
        "Pulihkan Data",
        "Seluruh data saat ini akan DIGANTI dengan isi cadangan (" +
          esc(data._exportedAt || "tanpa tanggal") +
          "). Lanjutkan?",
        function () {
          Object.keys(data).forEach(function (k) {
            if (k.indexOf("mc_db_") === 0) localStorage.setItem(k, data[k]);
          });
          showToast("Data berhasil dipulihkan. Memuat ulang...", "success");
          setTimeout(function () {
            window.location.reload();
          }, 900);
        },
        "Pulihkan",
        "mc-btn-primary",
      );
    };
    reader.readAsText(file);
  }

  function resetData() {
    mcConfirm(
      "Reset ke Data Awal",
      "SEMUA data (akun tambahan, nilai, pesan, pendaftar PPDB) akan dihapus dan kembali ke data contoh awal. Unduh cadangan dulu bila perlu. Tindakan ini tidak dapat dibatalkan.",
      function () {
        MCDB.resetAll();
        showToast("Data direset. Anda akan keluar...", "success");
        setTimeout(function () {
          window.location.href = "../index.html";
        }, 900);
      },
      "Reset Semua",
      "mc-btn-danger",
    );
  }

  document.getElementById("btnExport").addEventListener("click", exportData);
  const fileInput = document.getElementById("importFile");
  document.getElementById("btnImport").addEventListener("click", function () {
    fileInput.click();
  });
  fileInput.addEventListener("change", function () {
    if (fileInput.files[0]) importData(fileInput.files[0]);
    fileInput.value = "";
  });
  document.getElementById("btnReset").addEventListener("click", resetData);

  renderStats();
  renderRecent();
})();
