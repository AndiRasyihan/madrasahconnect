// Filter tabs for exam status
(function () {
  const grid = document.querySelector(".exam-grid");
  const tabs = document.createElement("div");
  tabs.className = "filter-bar";
  tabs.style.marginBottom = "16px";
  tabs.innerHTML =
    '<button class="filter-btn active" onclick="filterExam(this,\'all\')">Semua</button>' +
    '<button class="filter-btn" onclick="filterExam(this,\'done\')">Sudah Dikerjakan</button>' +
    '<button class="filter-btn" onclick="filterExam(this,\'upcoming\')">Mendatang</button>';
  grid.parentElement.insertBefore(tabs, grid);
})();
function filterExam(btn, status) {
  btn.parentElement
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".exam-card").forEach((card) => {
    const s = card.querySelector(".exam-status");
    if (status === "all") {
      card.style.display = "";
      return;
    }
    if (status === "done") {
      card.style.display =
        s && s.classList.contains("status-done") ? "" : "none";
    } else {
      card.style.display =
        s && !s.classList.contains("status-done") ? "" : "none";
    }
  });
}
// Make exam cards clickable with detail modal
document.querySelectorAll(".exam-card").forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", function () {
    const title = card.querySelector(".exam-title").textContent;
    const teacher = card.querySelector(".exam-subject").textContent;
    const details = Array.from(card.querySelectorAll(".exam-detail"))
      .map(
        (d) =>
          '<p style="font-size:13px;margin:4px 0">' +
          d.textContent +
          "</p>",
      )
      .join("");
    const statusEl = card.querySelector(".exam-status");
    const status = statusEl ? statusEl.textContent : "";
    const resultEl = card.querySelector(".exam-result");
    const result = resultEl
      ? '<div style="margin-top:12px;padding:12px;background:var(--green-50);border-radius:8px"><strong>Nilai: ' +
        resultEl.querySelector(".result-score").textContent +
        '</strong><br><span style="font-size:12px">' +
        resultEl.querySelector(".result-info").innerHTML +
        "</span></div>"
      : "";
    mcModal(
      "📝 " + title,
      '<p style="color:var(--gray-500);font-size:12px">' +
        teacher +
        "</p>" +
        details +
        '<p style="margin-top:8px;font-weight:600">' +
        status +
        "</p>" +
        result,
    );
  });
});
