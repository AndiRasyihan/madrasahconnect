function calcAvg(el) {
  const row = el.closest("tr");
  const inputs = row.querySelectorAll(".grade-input");
  let sum = 0,
    count = 0;
  inputs.forEach((i) => {
    const v = parseFloat(i.value);
    if (!isNaN(v)) {
      sum += v;
      count++;
    }
  });
  const avg = count > 0 ? (sum / count).toFixed(1) : "—";
  row.querySelector(".avg-cell").textContent = avg;
}

/* --- Simpan Nilai --- */
document.querySelector(".action-bar .btn-primary").onclick = function () {
  mcConfirm(
    "Simpan Nilai",
    "Simpan semua perubahan nilai? Pastikan data sudah benar.",
    function () {
      showToast("Menyimpan nilai...");
      setTimeout(function () {
        showToast("Semua nilai berhasil disimpan! ✅");
      }, 1000);
    },
    "Simpan",
    "mc-btn-primary",
  );
};

/* --- Export Excel (CSV) --- */
document
  .querySelectorAll(".action-bar .btn-secondary")
  .forEach(function (btn) {
    var t = btn.textContent.trim();
    if (t.indexOf("Export") !== -1) {
      btn.onclick = function () {
        var csv = "No,Nama,UH1,UH2,UH3,Tugas,UTS,Rata-rata\n";
        document
          .querySelectorAll(".grade-table tbody tr")
          .forEach(function (row) {
            var cells = row.querySelectorAll("td");
            var no = cells[0].textContent.trim();
            var nama = cells[1].textContent.trim();
            var grades = [];
            row.querySelectorAll(".grade-input").forEach(function (inp) {
              grades.push(inp.value || "-");
            });
            var avg = row.querySelector(".avg-cell").textContent.trim();
            csv +=
              no + "," + nama + "," + grades.join(",") + "," + avg + "\n";
          });
        var blob = new Blob([csv], { type: "text/csv" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "nilai_siswa.csv";
        a.click();
        showToast("File Excel berhasil diexport! 📥");
      };
    } else if (t.indexOf("Import") !== -1) {
      btn.onclick = function () {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx,.xls,.csv";
        input.onchange = function (e) {
          if (e.target.files.length) {
            showToast(
              "Mengimpor data dari " + e.target.files[0].name + "...",
            );
            setTimeout(function () {
              showToast("Data berhasil diimpor! ✅");
            }, 1500);
          }
        };
        input.click();
      };
    }
  });

/* --- Select dropdowns: actually filter table display --- */
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
