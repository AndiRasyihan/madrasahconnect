const siswa = [
      { nis: "10001", nama: "Ahmad Fauzi", st: "h" },
      { nis: "10002", nama: "Aisyah Putri", st: "h" },
      { nis: "10003", nama: "Budi Santoso", st: "h" },
      { nis: "10004", nama: "Citra Dewi", st: "h" },
      { nis: "10005", nama: "Dimas Pratama", st: "h" },
      { nis: "10006", nama: "Eka Rahmawati", st: "i" },
      { nis: "10007", nama: "Fajar Nugroho", st: "h" },
      { nis: "10008", nama: "Gita Puspita", st: "h" },
      { nis: "10009", nama: "Hadi Wijaya", st: "s" },
      { nis: "10010", nama: "Indah Lestari", st: "h" },
      { nis: "10011", nama: "Joni Setiawan", st: "h" },
      { nis: "10012", nama: "Kartika Sari", st: "h" },
      { nis: "10013", nama: "Lukman Hakim", st: "h" },
      { nis: "10014", nama: "Mira Handayani", st: "h" },
      { nis: "10015", nama: "Naufal Rizki", st: "h" },
      { nis: "10016", nama: "Olivia Susanti", st: "i" },
      { nis: "10017", nama: "Putra Mahendra", st: "h" },
      { nis: "10018", nama: "Qori Amalia", st: "h" },
      { nis: "10019", nama: "Rizky Maulana", st: "h" },
      { nis: "10020", nama: "Salsabila Nur", st: "h" },
      { nis: "10021", nama: "Taufik Hidayat", st: "h" },
      { nis: "10022", nama: "Ulya Zahra", st: "h" },
      { nis: "10023", nama: "Vina Oktavia", st: "h" },
      { nis: "10024", nama: "Wahyu Firmansyah", st: "h" },
      { nis: "10025", nama: "Xena Maharani", st: "h" },
      { nis: "10026", nama: "Yusuf Ramadhan", st: "h" },
      { nis: "10027", nama: "Zahra Kamilah", st: "h" },
      { nis: "10028", nama: "Arif Budiman", st: "h" },
      { nis: "10029", nama: "Bella Safitri", st: "a" },
      { nis: "10030", nama: "Chandra Purnama", st: "h" },
      { nis: "10031", nama: "Dina Marlina", st: "h" },
      { nis: "10032", nama: "Erwin Saputra", st: "h" },
    ];
    function render() {
      const tb = document.getElementById("tAbsen");
      tb.innerHTML = "";
      siswa.forEach((s, i) => {
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
<td><input type="text" placeholder="–" style="border:1px solid var(--gray-200);border-radius:4px;padding:4px 8px;font-size:11px;width:80px"></td>
</tr>`;
      });
    }
    function upd(i, v) {
      siswa[i].st = v;
      updateSummary();
    }
    function updateSummary() {
      let h = 0,
        iz = 0,
        s = 0,
        a = 0;
      siswa.forEach((x) => {
        if (x.st === "h") h++;
        else if (x.st === "i") iz++;
        else if (x.st === "s") s++;
        else a++;
      });
      document.getElementById("smH").textContent = h;
      document.getElementById("smI").textContent = iz;
      document.getElementById("smS").textContent = s;
      document.getElementById("smA").textContent = a;
    }
    function saveAbsensi() {
      showToast("Absensi berhasil disimpan!", "✅");
    }
    render();
