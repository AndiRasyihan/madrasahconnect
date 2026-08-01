// Animate bars on load
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".bar[data-h]").forEach((bar) => {
      const h = parseInt(bar.dataset.h);
      bar.style.transition = "height .8s ease";
      bar.style.height = h + "px";
    });
  }, 300);
});

// Grafik akademik (data nyata MCDB)
(function () {
  function renderCharts() {
    if (typeof mcChart !== "function" || typeof MCDB === "undefined") return;
    const nilaiCv = document.getElementById("chartNilai");
    if (nilaiCv) {
      const n = MCDB.nilaiSiswa("10001");
      mcChart(nilaiCv, {
        type: "line",
        labels: ["UH1", "UH2", "UH3", "Tugas", "UTS"],
        values: [n.uh1, n.uh2, n.uh3, n.tugas, n.uts],
        color: "#16a34a",
        label: "Grafik tren nilai Matematika",
      });
    }
    const absenCv = document.getElementById("chartAbsen");
    if (absenCv) {
      const r = MCDB.getAbsensiRekapSiswa("10001");
      const total = r.h + r.i + r.s + r.a;
      mcChart(absenCv, {
        type: "bar",
        labels: ["Hadir", "Izin", "Sakit", "Alfa"],
        values: total ? [r.h, r.i, r.s, r.a] : [22, 1, 1, 0],
        color: ["#16a34a", "#f59e0b", "#3b82f6", "#ef4444"],
        min: 0,
        label: "Grafik rekap kehadiran",
      });
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", renderCharts);
  else renderCharts();
  window.addEventListener("resize", renderCharts);
  window.addEventListener("mc-a11y", renderCharts);
})();

// Toggle task checkbox (tersimpan di MCDB)
function toggleTask(el, nameId) {
  const isDone = el.classList.contains("done");
  const checks = MCDB.get("task_checks", {});
  if (!isDone) {
    el.classList.add("done");
    el.textContent = "\u2713";
    el.setAttribute("aria-checked", "true");
    document.getElementById(nameId)?.classList.add("done-text");
    checks["dash:" + nameId] = true;
    showToast("Tugas ditandai selesai \u2713", "success");
  } else {
    el.classList.remove("done");
    el.textContent = "  ";
    el.setAttribute("aria-checked", "false");
    document.getElementById(nameId)?.classList.remove("done-text");
    checks["dash:" + nameId] = false;
    showToast("Tugas ditandai belum selesai");
  }
  MCDB.set("task_checks", checks);
}

// Pulihkan checklist dashboard
document.addEventListener("DOMContentLoaded", () => {
  const checks = MCDB.get("task_checks", {});
  document.querySelectorAll(".task-check[onclick]").forEach((el) => {
    const m = (el.getAttribute("onclick") || "").match(/'([^']+)'/);
    if (!m) return;
    const key = "dash:" + m[1];
    if (!(key in checks)) return;
    const shouldDone = !!checks[key];
    const isDone = el.classList.contains("done");
    if (shouldDone !== isDone) {
      el.classList.toggle("done", shouldDone);
      el.textContent = shouldDone ? "\u2713" : "  ";
      el.setAttribute("aria-checked", String(shouldDone));
      document
        .getElementById(m[1])
        ?.classList.toggle("done-text", shouldDone);
    }
  });
});

// Keyboard support for checkboxes
document.querySelectorAll(".task-check").forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
});
