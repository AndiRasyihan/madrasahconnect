const semData = {
  genap: {
    rows: [
      {
        sub: "📐 Matematika",
        uh1: 85,
        uh2: 88,
        uh3: 92,
        uts: 92,
        uas: "—",
        avg: 89.3,
        grade: "A",
        color: "var(--green-600)",
        bar: "var(--green-400)",
      },
      {
        sub: "📖 Bahasa Indonesia",
        uh1: 90,
        uh2: 86,
        uh3: 88,
        uts: 88,
        uas: "—",
        avg: 88.0,
        grade: "A",
        color: "var(--green-600)",
        bar: "var(--teal-400)",
      },
      {
        sub: "⚗️ Fisika",
        uh1: 72,
        uh2: 78,
        uh3: 74,
        uts: "—",
        uas: "—",
        avg: 74.7,
        grade: "B",
        color: "var(--amber-800)",
        bar: "var(--amber-200)",
      },
      {
        sub: "☪️ PAI",
        uh1: 96,
        uh2: 94,
        uh3: 95,
        uts: "—",
        uas: "—",
        avg: 95.0,
        grade: "A+",
        color: "var(--green-600)",
        bar: "var(--green-600)",
      },
      {
        sub: "🌐 Bahasa Inggris",
        uh1: 82,
        uh2: 86,
        uh3: 85,
        uts: "—",
        uas: "—",
        avg: 84.3,
        grade: "A-",
        color: "var(--green-600)",
        bar: "var(--blue-400)",
      },
      {
        sub: "🧪 Kimia",
        uh1: 78,
        uh2: 82,
        uh3: 81,
        uts: "—",
        uas: "—",
        avg: 80.3,
        grade: "B+",
        color: "var(--green-600)",
        bar: "var(--coral-400)",
      },
    ],
  },
  ganjil: {
    rows: [
      {
        sub: "📐 Matematika",
        uh1: 80,
        uh2: 83,
        uh3: 85,
        uts: 84,
        uas: 86,
        avg: 83.6,
        grade: "A-",
        color: "var(--green-600)",
        bar: "var(--green-400)",
      },
      {
        sub: "📖 Bahasa Indonesia",
        uh1: 85,
        uh2: 82,
        uh3: 84,
        uts: 86,
        uas: 88,
        avg: 85.0,
        grade: "A-",
        color: "var(--green-600)",
        bar: "var(--teal-400)",
      },
      {
        sub: "⚗️ Fisika",
        uh1: 70,
        uh2: 72,
        uh3: 75,
        uts: 73,
        uas: 76,
        avg: 73.2,
        grade: "B",
        color: "var(--amber-800)",
        bar: "var(--amber-200)",
      },
      {
        sub: "☪️ PAI",
        uh1: 92,
        uh2: 90,
        uh3: 93,
        uts: 94,
        uas: 95,
        avg: 92.8,
        grade: "A+",
        color: "var(--green-600)",
        bar: "var(--green-600)",
      },
      {
        sub: "🌐 Bahasa Inggris",
        uh1: 78,
        uh2: 80,
        uh3: 82,
        uts: 81,
        uas: 83,
        avg: 80.8,
        grade: "B+",
        color: "var(--green-600)",
        bar: "var(--blue-400)",
      },
      {
        sub: "🧪 Kimia",
        uh1: 75,
        uh2: 77,
        uh3: 79,
        uts: 78,
        uas: 80,
        avg: 77.8,
        grade: "B",
        color: "var(--amber-800)",
        bar: "var(--coral-400)",
      },
    ],
  },
};
function switchSemester(btn, sem) {
  btn.parentElement
    .querySelectorAll(".sem-tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const data = semData[sem];
  const tbody = document.querySelector(".grade-table tbody");
  tbody.innerHTML = data.rows
    .map(
      (r) =>
        "<tr><td>" +
        r.sub +
        "</td><td>" +
        r.uh1 +
        "</td><td>" +
        r.uh2 +
        "</td><td>" +
        r.uh3 +
        "</td><td>" +
        r.uts +
        "</td><td>" +
        r.uas +
        '</td><td><span class="grade-val" style="color:' +
        r.color +
        '">' +
        r.avg.toFixed(1) +
        '</span><div class="grade-bar"><div class="grade-fill" style="width:' +
        Math.round(r.avg) +
        "%;background:" +
        r.bar +
        '"></div></div></td><td><strong style="color:' +
        r.color +
        '">' +
        r.grade +
        "</strong></td></tr>",
    )
    .join("");
  showToast(
    "Menampilkan " +
      (sem === "ganjil" ? "Semester Ganjil" : "Semester Genap"),
  );
}
// Download rapor
document
  .querySelector(".card-header")
  ?.insertAdjacentHTML(
    "beforeend",
    '<button onclick="downloadRapor()" style="padding:6px 14px;border-radius:8px;background:var(--green-600);color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer;margin-left:auto">📥 Download Rapor</button>',
  );
function downloadRapor() {
  const rows = document.querySelectorAll(".grade-table tbody tr");
  let csv = "Mata Pelajaran,UH1,UH2,UH3,UTS,UAS,Rata-rata,Predikat\\n";
  rows.forEach((r) => {
    const cells = r.querySelectorAll("td");
    csv +=
      Array.from(cells)
        .map((c) => c.textContent.trim().replace(/\\n/g, ""))
        .join(",") + "\\n";
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "rapor-ahmad-fauzi.csv";
  a.click();
  showToast("Rapor berhasil diunduh! 📥");
}
