// Nilai guru – render dari MCDB dan simpan nyata (terbaca siswa & ortu)
(function () {
  "use strict";

  const FIELDS = ["uh1", "uh2", "uh3", "tugas", "uts"];
  const roster = MCDB.get("students", []);

  function renderTable() {
    const tbody = document.querySelector(".grade-table tbody");
    if (!tbody) return;
    const nilai = MCDB.get("nilai_kelas", {});
    tbody.innerHTML = "";
    roster.forEach(function (s, i) {
      const g = nilai[s.nis] || {};
      const cells = FIELDS.map(function (f) {
        const v = g[f] !== undefined && g[f] !== null ? g[f] : "";
        return (
          '<td><input class="grade-input" data-nis="' +
          s.nis +
          '" data-field="' +
          f +
          '" value="' +
          v +
          '" onchange="calcAvg(this)" /></td>'
        );
      }).join("");
      const vals = FIELDS.map(function (f) {
        return parseFloat(g[f]);
      }).filter(function (v) {
        return !isNaN(v);
      });
      const avg = vals.length
        ? (vals.reduce(function (a, b) {
            return a + b;
          }, 0) / vals.length).toFixed(1)
        : "—";
      tbody.innerHTML +=
        "<tr><td>" +
        (i + 1) +
        '</td><td>' +
        s.nama +
        "</td>" +
        cells +
        '<td class="avg-cell">' +
        avg +
        "</td></tr>";
    });
  }

  window.calcAvg = function (el) {
    const row = el.closest("tr");
    const inputs = row.querySelectorAll(".grade-input");
    let sum = 0,
      count = 0;
    inputs.forEach(function (i) {
      const v = parseFloat(i.value);
      if (!isNaN(v)) {
        sum += v;
        count++;
      }
    });
    row.querySelector(".avg-cell").textContent =
      count > 0 ? (sum / count).toFixed(1) : "—";
  };

  function collectAndSave() {
    const nilai = MCDB.get("nilai_kelas", {});
    document
      .querySelectorAll(".grade-table tbody .grade-input")
      .forEach(function (inp) {
        const nis = inp.dataset.nis;
        const field = inp.dataset.field;
        if (!nis || !field) return;
        if (!nilai[nis]) nilai[nis] = {};
        const v = parseFloat(inp.value);
        nilai[nis][field] = isNaN(v) ? null : v;
      });
    MCDB.saveNilaiKelas(nilai);
    MCDB.notify("siswa", "Nilai Matematika telah diperbarui oleh guru");
    MCDB.notify("ortu", "Nilai anak Anda telah diperbarui oleh guru");
  }

  function init() {
    renderTable();

    const saveBtn = document.querySelector(".action-bar .btn-primary");
    if (saveBtn)
      saveBtn.onclick = function () {
        mcConfirm(
          "Simpan Nilai",
          "Simpan semua perubahan nilai? Data akan langsung terlihat oleh siswa dan orang tua.",
          function () {
            collectAndSave();
            showToast("Semua nilai berhasil disimpan! ✅", "success");
          },
          "Simpan",
          "mc-btn-primary",
        );
      };

    document
      .querySelectorAll(".action-bar .btn-secondary")
      .forEach(function (btn) {
        const t = btn.textContent.trim();
        if (t.indexOf("Export") !== -1) {
          btn.onclick = function () {
            let csv = "No,Nama,UH1,UH2,UH3,Tugas,UTS,Rata-rata\n";
            document
              .querySelectorAll(".grade-table tbody tr")
              .forEach(function (row) {
                const cells = row.querySelectorAll("td");
                const no = cells[0].textContent.trim();
                const nama = cells[1].textContent.trim();
                const grades = [];
                row.querySelectorAll(".grade-input").forEach(function (inp) {
                  grades.push(inp.value || "-");
                });
                const avg = row.querySelector(".avg-cell").textContent.trim();
                csv +=
                  no + "," + nama + "," + grades.join(",") + "," + avg + "\n";
              });
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "nilai_siswa.csv";
            a.click();
            showToast("File CSV berhasil diexport! 📥");
          };
        } else if (t.indexOf("Import") !== -1) {
          btn.onclick = function () {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv";
            input.onchange = function (e) {
              const f = e.target.files[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = function () {
                const lines = String(reader.result).trim().split(/\r?\n/);
                const nilai = MCDB.get("nilai_kelas", {});
                let imported = 0;
                lines.slice(1).forEach(function (line) {
                  const cols = line.split(",");
                  if (cols.length < 7) return;
                  const nama = cols[1].trim();
                  const match = roster.find(function (s) {
                    return s.nama === nama;
                  });
                  if (!match) return;
                  nilai[match.nis] = {
                    uh1: parseFloat(cols[2]) || null,
                    uh2: parseFloat(cols[3]) || null,
                    uh3: parseFloat(cols[4]) || null,
                    tugas: parseFloat(cols[5]) || null,
                    uts: parseFloat(cols[6]) || null,
                  };
                  imported++;
                });
                MCDB.saveNilaiKelas(nilai);
                renderTable();
                showToast(
                  "Import selesai: " + imported + " baris nilai dimuat ✅",
                  "success",
                );
              };
              reader.readAsText(f);
            };
            input.click();
          };
        }
      });

    document
      .querySelectorAll(".select-row .form-select")
      .forEach(function (sel, idx) {
        if (idx < 2) {
          sel.onchange = function () {
            showToast(
              (idx === 0 ? "Kelas" : "Kategori") + " dipilih: " + this.value,
            );
          };
        }
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
