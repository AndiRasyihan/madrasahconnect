const schedules = {
  Senin: [
    {
      time: "07:00",
      name: "☪️ Sholat Dhuha Berjamaah",
      meta: "Masjid Sekolah · 07:00–07:25",
      dot: "var(--teal-400)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "07:30",
      name: "📖 Bahasa Indonesia",
      meta: "Pak Ahmad · Ruang 3A · 07:30–09:00",
      dot: "var(--blue-400)",
    },
    {
      time: "09:15",
      name: "🌐 Bahasa Inggris",
      meta: "Mrs. Diana · Ruang 3A · 09:15–10:45",
      dot: "var(--blue-400)",
    },
    { time: "10:45", empty: "🍽️ Istirahat 1 (10:45–11:15)" },
    {
      time: "11:15",
      name: "☪️ Sholat Dzuhur Berjamaah",
      meta: "Masjid Sekolah · 11:15–11:45",
      dot: "var(--teal-400)",
    },
    {
      time: "13:00",
      name: "🧪 Kimia",
      meta: "Pak Rizky · Lab Kimia · 13:00–14:30",
      dot: "var(--coral-400)",
    },
    {
      time: "14:45",
      name: "🏃 Penjaskes",
      meta: "Pak Deni · Lapangan · 14:45–16:00",
      dot: "var(--green-400)",
    },
  ],
  Selasa: [
    {
      time: "07:00",
      name: "☪️ Sholat Dhuha Berjamaah",
      meta: "Masjid Sekolah · 07:00–07:25",
      dot: "var(--teal-400)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "07:30",
      name: "📐 Matematika",
      meta: "Bu Siti Rahma · Ruang 3A · 07:30–09:00",
      dot: "var(--green-400)",
    },
    {
      time: "09:15",
      name: "🧪 Kimia",
      meta: "Pak Rizky · Lab Kimia · 09:15–10:45",
      dot: "var(--coral-400)",
    },
    { time: "10:45", empty: "🍽️ Istirahat 1 (10:45–11:15)" },
    {
      time: "11:15",
      name: "☪️ Sholat Dzuhur Berjamaah",
      meta: "Masjid Sekolah · 11:15–11:45",
      dot: "var(--teal-400)",
    },
    {
      time: "13:00",
      name: "📖 Bahasa Indonesia",
      meta: "Pak Ahmad · Ruang 3A · 13:00–14:30",
      dot: "var(--blue-400)",
    },
    {
      time: "14:45",
      name: "💻 Informatika",
      meta: "Pak Rudi · Lab Komputer · 14:45–16:00",
      dot: "var(--blue-400)",
    },
  ],
  Rabu: [
    {
      time: "07:00",
      name: "☪️ Sholat Dhuha Berjamaah",
      meta: "Masjid Sekolah · 07:00–07:25",
      dot: "var(--teal-400)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "07:30",
      name: "⚗️ Fisika",
      meta: "Bu Dewi · Lab Fisika · 07:30–09:00",
      dot: "var(--amber-200)",
    },
    {
      time: "09:15",
      name: "🌐 Bahasa Inggris",
      meta: "Mrs. Diana · Ruang 3A · 09:15–10:45",
      dot: "var(--blue-400)",
    },
    { time: "10:45", empty: "🍽️ Istirahat 1 (10:45–11:15)" },
    {
      time: "11:15",
      name: "☪️ Sholat Dzuhur Berjamaah",
      meta: "Masjid Sekolah · 11:15–11:45",
      dot: "var(--teal-400)",
    },
    {
      time: "13:00",
      name: "📐 Matematika",
      meta: "Bu Siti Rahma · Ruang 3A · 13:00–14:30",
      dot: "var(--green-400)",
    },
    {
      time: "14:45",
      name: "🤖 Ekskul Robotika",
      meta: "Pak Rudi · Lab Komputer · 15:30–17:00",
      dot: "var(--blue-400)",
      badge: "Ekskul",
      badgeBg: "#dbeafe",
      badgeColor: "#2563eb",
    },
  ],
  Kamis: [
    {
      time: "07:00",
      name: "☪️ Sholat Dhuha Berjamaah",
      meta: "Masjid Sekolah · 07:00–07:25",
      dot: "var(--teal-400)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "07:30",
      name: "☪️ Pendidikan Agama Islam",
      meta: "Ustaz Hamid · Ruang 3A · 07:30–09:00",
      dot: "var(--teal-600)",
    },
    {
      time: "09:15",
      name: "📖 Bahasa Indonesia",
      meta: "Pak Ahmad · Ruang 3A · 09:15–10:45",
      dot: "var(--blue-400)",
    },
    { time: "10:45", empty: "🍽️ Istirahat 1 (10:45–11:15)" },
    {
      time: "11:15",
      name: "☪️ Sholat Dzuhur Berjamaah",
      meta: "Masjid Sekolah · 11:15–11:45",
      dot: "var(--teal-400)",
    },
    {
      time: "13:00",
      name: "⚗️ Fisika",
      meta: "Bu Dewi · Lab Fisika · 13:00–14:30",
      dot: "var(--amber-200)",
    },
    {
      time: "14:45",
      name: "🎨 Seni Budaya",
      meta: "Bu Rina · Ruang Seni · 14:45–16:00",
      dot: "var(--coral-400)",
    },
  ],
  Jumat: [
    {
      time: "07:00",
      name: "☪️ Sholat Dhuha Berjamaah",
      meta: "Masjid Sekolah · 07:00–07:25",
      dot: "var(--teal-400)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "07:30",
      name: "📐 Matematika",
      meta: "Bu Siti Rahma · Ruang 3A · 07:30–09:00",
      dot: "var(--green-400)",
    },
    {
      time: "09:15",
      name: "🧪 Kimia",
      meta: "Pak Rizky · Lab Kimia · 09:15–10:45",
      dot: "var(--coral-400)",
    },
    { time: "10:45", empty: "🍽️ Istirahat 1 (10:45–11:15)" },
    {
      time: "11:15",
      name: "☪️ Sholat Jumat",
      meta: "Masjid Sekolah · 11:15–12:30",
      dot: "var(--teal-600)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "13:00",
      name: "🏸 Ekskul Badminton",
      meta: "Pak Deni · GOR Sekolah · 15:30–17:00",
      dot: "var(--green-400)",
      badge: "Ekskul",
      badgeBg: "#dbeafe",
      badgeColor: "#2563eb",
    },
  ],
  Sabtu: [
    {
      time: "07:00",
      name: "☪️ Sholat Dhuha Berjamaah",
      meta: "Masjid Sekolah · 07:00–07:25",
      dot: "var(--teal-400)",
      badge: "Wajib",
      badgeBg: "var(--teal-50)",
      badgeColor: "var(--teal-600)",
    },
    {
      time: "07:30",
      name: "📐 Matematika",
      meta: "Bu Siti Rahma · Ruang 3A · 07:30–09:00",
      dot: "var(--green-400)",
      badge: "Berlangsung",
      badgeBg: "var(--green-50)",
      badgeColor: "var(--green-600)",
    },
    {
      time: "09:15",
      name: "📖 Bahasa Indonesia",
      meta: "Pak Ahmad · Ruang 3A · 09:15–10:45",
      dot: "var(--blue-400)",
    },
    { time: "10:45", empty: "🍽️ Istirahat 1 (10:45–11:15)" },
    {
      time: "11:15",
      name: "☪️ Sholat Dzuhur Berjamaah",
      meta: "Masjid Sekolah · 11:15–11:45",
      dot: "var(--teal-400)",
    },
    {
      time: "13:00",
      name: "⚗️ Fisika",
      meta: "Bu Dewi · Lab Fisika · 13:00–14:30",
      dot: "var(--amber-200)",
    },
    {
      time: "14:45",
      name: "☪️ Pendidikan Agama Islam",
      meta: "Ustaz Hamid · Ruang 3A · 14:45–16:00",
      dot: "var(--teal-600)",
    },
  ],
};
function selectDay(btn) {
  btn.parentElement
    .querySelectorAll(".day-tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const day = btn.querySelector(".day-name").textContent;
  const data = schedules[day] || schedules["Sabtu"];
  const grid = document.querySelector(".schedule-grid");
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
        '</div><div class="slot-content"><div class="schedule-item" onclick="mcModal(\'' +
        s.name +
        "','<p>" +
        s.meta +
        '</p>\')"><div class="schedule-dot" style="background:' +
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
  showToast("Jadwal hari " + day);
}
// Make existing schedule items clickable with detail modal
document.querySelectorAll(".schedule-item").forEach((item) => {
  if (!item.onclick) {
    item.style.cursor = "pointer";
    item.addEventListener("click", function () {
      const name = item.querySelector(".schedule-name").textContent;
      const meta = item.querySelector(".schedule-meta").textContent;
      mcModal(name, "<p>" + meta + "</p>");
    });
  }
});
