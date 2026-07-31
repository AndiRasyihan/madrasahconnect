// Kelola tugas guru – CRUD ke MCDB, sinkron dengan siswa & ortu
(function () {
  "use strict";

  const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const MAPEL_ICON = {
    Matematika: "📐", Fisika: "⚗️", Kimia: "🧪", Biologi: "🧬",
    "B. Indonesia": "📖", "B. Inggris": "🌐", PAI: "☪️",
  };

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function fmtDate(iso) {
    if (!iso) return "-";
    const p = iso.split("-");
    return parseInt(p[2], 10) + " " + BULAN[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function render() {
    const tbody = document.querySelector(".task-table tbody");
    if (!tbody) return;
    const list = MCDB.get("tugas_list", []);
    const st = MCDB.get("tugas_status", {});
    if (!list.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:28px">Belum ada tugas. Klik "+ Buat Tugas" untuk membuat.</td></tr>';
      return;
    }
    tbody.innerHTML = list
      .map(function (t) {
        const kumpul = t.terkumpul + (st[t.id] && st[t.id].done ? 1 : 0);
        const pct = Math.round((kumpul / t.total) * 100);
        const selesai = kumpul >= t.total;
        const badge = selesai
          ? '<span class="status-badge st-selesai">Selesai</span>'
          : '<span class="status-badge st-aktif">Aktif</span>';
        return (
          '<tr data-status="' + (selesai ? "selesai" : "aktif") + '">' +
          "<td><strong>" + esc(t.judul) + "</strong><br><span style='font-size:11px;color:var(--gray-400)'>" +
          t.icon + " " + esc(t.mapel) + "</span></td>" +
          "<td>" + esc(t.kelas) + "</td>" +
          "<td>" + fmtDate(t.deadline) + "</td>" +
          '<td><div class="progress-bar"><div class="progress-fill" style="width:' +
          pct + '%;background:var(--green-600)"></div></div>' +
          kumpul + "/" + t.total + "</td>" +
          "<td>" + badge + "</td>" +
          '<td><button class="action-btn" data-act="nilai">📊 Nilai</button>' +
          '<button class="action-btn" data-act="del" data-id="' + t.id +
          '" aria-label="Hapus tugas ' + esc(t.judul) + '">🗑️</button></td></tr>'
        );
      })
      .join("");
    wire();
  }

  function wire() {
    document.querySelectorAll('.task-table [data-act="del"]').forEach(function (btn) {
      btn.onclick = function () { delTask(btn.dataset.id); };
    });
    document.querySelectorAll('.task-table [data-act="nilai"]').forEach(function (btn) {
      btn.onclick = function () { window.location.href = "guru-nilai.html"; };
    });
  }

  function delTask(id) {
    const t = MCDB.get("tugas_list", []).find(function (x) { return x.id === id; });
    if (!t) return;
    mcConfirm(
      "Hapus Tugas",
      'Hapus tugas "' + esc(t.judul) + '"? Tugas akan hilang dari halaman siswa dan orang tua.',
      function () {
        MCDB.removeWhere("tugas_list", function (x) { return x.id === id; });
        MCDB.notify("siswa", "Tugas dibatalkan guru: " + t.judul);
        MCDB.notify("ortu", "Tugas dibatalkan guru: " + t.judul);
        render();
        showToast("Tugas dihapus");
      },
      "Hapus",
      "mc-btn-danger",
    );
  }

  window.publishTask = function () {
    const judul = document.getElementById("tgJudul").value.trim();
    const kelas = document.getElementById("tgKelas").value.replace("Kelas ", "");
    const desc = document.getElementById("tgDesc").value.trim();
    const deadline = document.getElementById("tgDeadline").value;
    if (!judul || !deadline) {
      showToast("Isi judul dan deadline terlebih dahulu", "error");
      return;
    }
    const me = MCAuth.currentUser() || {};
    const mapel = me.mapel || "Umum";
    MCDB.push("tugas_list", {
      id: MCDB.uid("tg"),
      judul: judul,
      mapel: mapel,
      icon: MAPEL_ICON[mapel] || "📚",
      jenis: "📝 Tugas",
      kelas: kelas,
      deadline: deadline,
      desc: desc || "Kerjakan sesuai instruksi guru.",
      by: me.name || "Guru",
      terkumpul: 0,
      total: 32,
      status: "aktif",
    });
    MCDB.notify("siswa", "Tugas baru " + mapel + ": " + judul);
    MCDB.notify("ortu", "Tugas baru untuk ananda: " + judul);
    closeModal();
    document.getElementById("tgJudul").value = "";
    document.getElementById("tgDesc").value = "";
    document.getElementById("tgDeadline").value = "";
    render();
    showToast("Tugas berhasil dipublikasikan! ✅", "success");
  };

  window.filterTask = function (btn, s) {
    btn.parentElement.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    document.querySelectorAll(".task-table tbody tr").forEach(function (r) {
      r.style.display = s === "all" || r.dataset.status === s ? "" : "none";
    });
  };

  window.openModal = function () {
    document.getElementById("taskModal").classList.add("open");
  };
  window.closeModal = function () {
    document.getElementById("taskModal").classList.remove("open");
  };

  render();
})();
