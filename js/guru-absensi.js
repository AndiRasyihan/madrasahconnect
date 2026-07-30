// Absensi guru – tersimpan per tanggal di MCDB, terbaca ortu & siswa
(function () {
  "use strict";

  const roster = MCDB.get("students", []);
  let siswa = [];

  function loadForDate(dateISO) {
    const saved = MCDB.getAbsensi(dateISO);
    siswa = roster.map(function (s) {
      const rec = saved ? saved[s.nis] : null;
      return {
        nis: s.nis,
        nama: s.nama,
        st: rec ? rec.st : "h",
        note: rec ? rec.note || "" : "",
      };
    });
    render();
    window.updateSummary();
  }

  function render() {
    const tb = document.getElementById("tAbsen");
    if (!tb) return;
    tb.innerHTML = "";
    siswa.forEach(function (s, i) {
      const n = i + 1;
      const nm = "abs_" + i;
      tb.innerHTML += `<tr>
<td>${n}</td><td>${s.nis}</td><td style="font-weight:600">${s.nama}</td>
<td><div class="status-group">
  <input type="radio" class="status-radio" name="${nm}" id="${nm}h" value="h" ${s.st === "h" ? "checked" : ""} onchange="upd(${i},'h')"><label class="status-label h" for="${nm}h">Hadir</label>
  <input type="radio" class="status-radio" name="${nm}" id="${nm}i" value="i" ${s.st === "i" ? "checked" : ""} onchange="upd(${i},'i')"><label class="status-label i" for="${nm}i">Izin</label>
  <input type="radio" class="status-radio" name="${nm}" id="${nm}s" value="s" ${s.st === "s" ? "checked" : ""} onchange="upd(${i},'s')"><label class="status-label s" for="${nm}s">Sakit</label>
  <input type="radio" class="status-radio" name="${nm}" id="${nm}a" value="a" ${s.st === "a" ? "checked" : ""} onchange="upd(${i},'a')"><label class="status-label a" for="${nm}a">Alpha</label>
</div></td>
<td><input type="text" class="abs-note" data-i="${i}" value="${(s.note || "").replace(/"/g, "&quot;")}" placeholder="–" style="border:1px solid var(--gray-200);border-radius:4px;padding:4px 8px;font-size:11px;width:80px"></td>
</tr>`;
    });
    tb.querySelectorAll(".abs-note").forEach(function (inp) {
      inp.addEventListener("input", function () {
        siswa[parseInt(inp.dataset.i, 10)].note = inp.value;
      });
    });
  }

  window.upd = function (i, v) {
    siswa[i].st = v;
    window.updateSummary();
  };

  window.updateSummary = function () {
    let h = 0,
      iz = 0,
      sk = 0,
      a = 0;
    siswa.forEach(function (x) {
      if (x.st === "h") h++;
      else if (x.st === "i") iz++;
      else if (x.st === "s") sk++;
      else a++;
    });
    document.getElementById("smH").textContent = h;
    document.getElementById("smI").textContent = iz;
    document.getElementById("smS").textContent = sk;
    document.getElementById("smA").textContent = a;
  };

  window.saveAbsensi = function () {
    const date =
      document.getElementById("tglAbsen").value || MCDB.todayISO();
    const records = {};
    siswa.forEach(function (s) {
      records[s.nis] = { st: s.st, note: s.note || "" };
    });
    MCDB.saveAbsensi(date, records);
    MCDB.notify(
      "ortu",
      "Absensi tanggal " + date + " telah dicatat wali kelas",
    );
    MCDB.notify("siswa", "Absensi tanggal " + date + " telah dicatat");
    showToast("Absensi " + date + " berhasil disimpan! ✅", "success");
  };

  function init() {
    const dateInput = document.getElementById("tglAbsen");
    if (!dateInput) return;
    if (!MCDB.getAbsensi(dateInput.value)) dateInput.value = MCDB.todayISO();
    dateInput.addEventListener("change", function () {
      loadForDate(dateInput.value);
    });
    loadForDate(dateInput.value);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
