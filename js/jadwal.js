// Jadwal siswa – data dari MCDB (jadwal_pelajaran), sama dengan tampilan ortu
const schedules = MCDB.get("jadwal_pelajaran", {});

function renderDay(day) {
  const data = schedules[day] || schedules["Sabtu"] || [];
  const grid = document.querySelector(".schedule-grid");
  if (!grid) return;
  grid.innerHTML = data
    .map((s) => {
      if (s.empty)
        return (
          '<div class="time-slot"><div class="time-label">' +
          s.time +
          '</div><div class="slot-content"><div class="empty-slot">' +
          s.empty +
          "</div></div></div>"
        );
      const badgeHTML = s.badge
        ? '<span class="schedule-badge" style="background:' +
          s.badgeBg +
          ";color:" +
          s.badgeColor +
          '">' +
          s.badge +
          "</span>"
        : "";
      return (
        '<div class="time-slot"><div class="time-label">' +
        s.time +
        '</div><div class="slot-content"><div class="schedule-item"><div class="schedule-dot" style="background:' +
        s.dot +
        '"></div><div class="schedule-info"><div class="schedule-name">' +
        s.name +
        '</div><div class="schedule-meta">' +
        s.meta +
        "</div></div>" +
        badgeHTML +
        "</div></div></div>"
      );
    })
    .join("");
  // detail modal per item
  grid.querySelectorAll(".schedule-item").forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", function () {
      const name = item.querySelector(".schedule-name").textContent;
      const meta = item.querySelector(".schedule-meta").textContent;
      mcModal(name, "<p>" + meta + "</p>");
    });
  });
}

function selectDay(btn) {
  btn.parentElement
    .querySelectorAll(".day-tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const day = btn.querySelector(".day-name").textContent;
  renderDay(day);
  showToast("Jadwal hari " + day);
}

// Render awal sesuai tab aktif
document.addEventListener("DOMContentLoaded", () => {
  const active = document.querySelector(".day-tab.active .day-name");
  renderDay(active ? active.textContent : "Sabtu");
});
