// ═══════════════════════════════════════════
//  MaConnect – Data Layer (localStorage DB)
//  Semua data aplikasi disimpan permanen di
//  browser via localStorage, tersinkron antar
//  peran (siswa / guru / orang tua).
// ═══════════════════════════════════════════
(function () {
  "use strict";

  const PREFIX = "mc_db_";
  const SEED_VERSION_KEY = "mc_db_version";
  const SEED_VERSION = 3;

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("MCDB write gagal:", e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  function uid(prefix) {
    return (
      (prefix || "id") +
      "_" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 7)
    );
  }

  function todayISO() {
    const d = new Date();
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  function nowTime() {
    const d = new Date();
    return (
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  }

  // ── SEED DATA ─────────────────────────────
  const SEED = {
    users: [
      {
        id: "s1",
        role: "siswa",
        name: "Ahmad Fauzi",
        initials: "AF",
        email: "ahmad@siswa.maconnect.sch.id",
        username: "0051234567", // NISN
        pass: "siswa123",
        kelas: "X IPA 1",
        info: "Kelas 10 IPA · SMAN Muh 1",
        phone: "0812-3456-7890",
        address: "Jl. Kemuning No. 12, Yogyakarta",
      },
      {
        id: "g1",
        role: "guru",
        name: "Siti Rahma, S.Pd",
        initials: "SR",
        email: "siti@guru.maconnect.sch.id",
        username: "196812052001", // NIP
        pass: "guru123",
        mapel: "Matematika",
        info: "Guru Matematika · SMAN Muh 1",
        phone: "0813-9876-5432",
        address: "Jl. Melati No. 5, Yogyakarta",
      },
      {
        id: "o1",
        role: "ortu",
        name: "H. Muhammad Fauzi",
        initials: "MF",
        email: "fauzi@ortu.maconnect.sch.id",
        username: "fauzi@ortu.maconnect.sch.id",
        pass: "ortu123",
        childId: "s1",
        childName: "Ahmad Fauzi",
        info: "Orang Tua · Ahmad Fauzi",
        phone: "0811-2233-4455",
        address: "Jl. Kemuning No. 12, Yogyakarta",
      },
    ],

    // Siswa kelas X IPA 1 (dipakai guru: absensi, nilai)
    students: [
      { nis: "10001", nama: "Ahmad Fauzi" },
      { nis: "10002", nama: "Aisyah Putri" },
      { nis: "10003", nama: "Budi Santoso" },
      { nis: "10004", nama: "Citra Dewi" },
      { nis: "10005", nama: "Dimas Pratama" },
      { nis: "10006", nama: "Eka Rahmawati" },
      { nis: "10007", nama: "Fajar Nugroho" },
      { nis: "10008", nama: "Gita Puspita" },
      { nis: "10009", nama: "Hadi Wijaya" },
      { nis: "10010", nama: "Indah Lestari" },
      { nis: "10011", nama: "Joni Setiawan" },
      { nis: "10012", nama: "Kartika Sari" },
      { nis: "10013", nama: "Lukman Hakim" },
      { nis: "10014", nama: "Mira Handayani" },
      { nis: "10015", nama: "Naufal Rizki" },
      { nis: "10016", nama: "Olivia Susanti" },
      { nis: "10017", nama: "Putra Mahendra" },
      { nis: "10018", nama: "Qori Amalia" },
      { nis: "10019", nama: "Rizky Maulana" },
      { nis: "10020", nama: "Salsabila Nur" },
      { nis: "10021", nama: "Taufik Hidayat" },
      { nis: "10022", nama: "Ulya Zahra" },
      { nis: "10023", nama: "Vina Oktavia" },
      { nis: "10024", nama: "Wahyu Firmansyah" },
      { nis: "10025", nama: "Xena Maharani" },
      { nis: "10026", nama: "Yusuf Ramadhan" },
      { nis: "10027", nama: "Zahra Kamilah" },
      { nis: "10028", nama: "Arif Budiman" },
      { nis: "10029", nama: "Bella Safitri" },
      { nis: "10030", nama: "Chandra Purnama" },
      { nis: "10031", nama: "Dina Marlina" },
      { nis: "10032", nama: "Erwin Saputra" },
    ],

    // Absensi per tanggal: { "YYYY-MM-DD": { nis: {st, note} } }
    absensi: {},

    // Nilai kelas (input guru): { nis: {uh1,uh2,uh3,tugas,uts} }
    nilai_kelas: {
      10001: { uh1: 85, uh2: 88, uh3: 90, tugas: 92, uts: 87 },
      10002: { uh1: 90, uh2: 92, uh3: 88, tugas: 95, uts: 91 },
      10003: { uh1: 78, uh2: 80, uh3: 75, tugas: 82, uts: 79 },
      10004: { uh1: 88, uh2: 85, uh3: 87, tugas: 90, uts: 86 },
      10005: { uh1: 75, uh2: 78, uh3: 72, tugas: 80, uts: 76 },
    },

    // Pengumuman sekolah (dikelola guru, dibaca semua peran)
    pengumuman: [
      {
        id: "ann1",
        icon: "📌",
        seeded: true,
        title: "Jadwal UTS Semester Genap 2026",
        body: "UTS dilaksanakan 6–11 April 2026. Seluruh siswa wajib hadir 15 menit sebelum ujian dimulai. Jadwal lengkap dapat diunduh di halaman ujian.",
        category: "Akademik",
        target: "Semua Siswa & Orang Tua",
        status: "published",
        date: "2026-03-20",
        author: "Siti Rahma, S.Pd",
      },
      {
        id: "ann2",
        icon: "🏆",
        seeded: true,
        title: "Lomba Tahfidz Antar Kelas",
        body: "Dalam rangka Milad Muhammadiyah, akan diadakan lomba tahfidz Juz 30 antar kelas. Pendaftaran melalui wali kelas masing-masing hingga 1 April 2026.",
        category: "Kegiatan",
        target: "Semua Siswa",
        status: "published",
        date: "2026-03-18",
        author: "Siti Rahma, S.Pd",
      },
      {
        id: "ann3",
        icon: "📋",
        seeded: true,
        title: "Rapat Wali Murid Kelas X",
        body: "Rapat wali murid membahas persiapan UTS dan program semester genap. Sabtu, 5 April 2026 pukul 09.00 WIB di Aula Utama.",
        category: "Umum",
        target: "Orang Tua Kelas X",
        status: "published",
        date: "2026-03-15",
        author: "Siti Rahma, S.Pd",
      },
      {
        id: "ann4",
        icon: "📝",
        seeded: true,
        title: "Pengumpulan Rapor Tengah Semester",
        body: "Rapor tengah semester dibagikan 18 April 2026. Orang tua diharapkan hadir mengambil rapor secara langsung.",
        category: "Akademik",
        target: "Orang Tua",
        status: "draft",
        date: "2026-03-22",
        author: "Siti Rahma, S.Pd",
      },
    ],

    // Thread pesan: id tetap agar sinkron lintas peran
    pesan_threads: [
      {
        id: "th_siswa_guru",
        participants: ["s1", "g1"],
        messages: [
          {
            from: "g1",
            text: "Assalamu'alaikum Ahmad, bagaimana persiapan UTS Matematika-nya?",
            date: "2026-03-24",
            time: "09:15",
          },
          {
            from: "s1",
            text: "Wa'alaikumussalam Bu, alhamdulillah sudah review materi Bab 3 dan 4.",
            date: "2026-03-24",
            time: "09:20",
          },
          {
            from: "g1",
            text: "Bagus, jangan lupa kerjakan latihan soal di halaman 87-92 ya. Itu cakupan UTS.",
            date: "2026-03-24",
            time: "09:22",
          },
          {
            from: "s1",
            text: "Baik Bu, insya Allah saya kerjakan malam ini 🤲",
            date: "2026-03-24",
            time: "09:25",
          },
          {
            from: "g1",
            text: "Oh iya, tugas aljabar yang kemarin dikumpul besok ya, jangan sampai lupa.",
            date: "2026-03-24",
            time: "10:42",
          },
        ],
      },
      {
        id: "th_ortu_guru",
        participants: ["o1", "g1"],
        messages: [
          {
            from: "g1",
            text: "Assalamu'alaikum Pak Fauzi, saya ingin menyampaikan bahwa Ahmad mendapatkan nilai yang sangat baik di UTS Matematika. Alhamdulillah nilainya 92.",
            date: "2026-03-23",
            time: "09:15",
          },
          {
            from: "o1",
            text: "Wa'alaikumussalam Bu Siti. Alhamdulillah, terima kasih banyak atas informasinya. Kami sangat senang mendengar kabar ini.",
            date: "2026-03-23",
            time: "09:20",
          },
          {
            from: "g1",
            text: "Iya Pak, Ahmad juga aktif di kelas dan sering membantu teman-temannya. Untuk tugas integral yang kemarin, Ahmad sudah mengumpulkan tepat waktu.",
            date: "2026-03-23",
            time: "09:45",
          },
          {
            from: "o1",
            text: "Alhamdulillah, kami selalu memantau tugas-tugasnya di rumah. Apakah ada hal yang perlu kami perhatikan di rumah, Bu?",
            date: "2026-03-23",
            time: "10:02",
          },
          {
            from: "g1",
            text: "Mungkin untuk persiapan UAS nanti, Ahmad perlu lebih banyak latihan soal terutama bab kalkulus diferensial. Saya sudah upload materi tambahan di portal.",
            date: "2026-03-23",
            time: "10:15",
          },
          {
            from: "o1",
            text: "Terima kasih Bu, saya akan sampaikan ke Ahmad untuk belajar lebih giat lagi. Jazakallah khairan.",
            date: "2026-03-23",
            time: "10:30",
          },
        ],
      },
      {
        id: "th_s1_ahmad",
        participants: ["s1", "p_ahmad"],
        messages: [
          {
            from: "p_ahmad",
            text: "Ahmad, essay puisi yang kamu kerjakan cukup bagus. Tapi coba perbaiki paragraf ketiga.",
            date: "2026-03-23",
            time: "14:10",
          },
          {
            from: "s1",
            text: "Baik Pak, terima kasih banyak koreksinya. Nanti saya revisi.",
            date: "2026-03-23",
            time: "14:30",
          },
          {
            from: "p_ahmad",
            text: "Seperti yang saya bilang di kelas, revisi dikumpul Kamis.",
            date: "2026-03-23",
            time: "15:00",
          },
        ],
      },
      {
        id: "th_s1_dewi",
        participants: ["s1", "p_dewi"],
        messages: [
          {
            from: "p_dewi",
            text: "Ahmad, laporan praktikum Hukum Newton sudah saya periksa. Nilainya 88, bagus.",
            date: "2026-03-22",
            time: "11:00",
          },
          {
            from: "s1",
            text: "Alhamdulillah, terima kasih Bu Dewi!",
            date: "2026-03-22",
            time: "11:15",
          },
        ],
      },
      {
        id: "th_s1_hamid",
        participants: ["s1", "p_hamid"],
        messages: [
          {
            from: "p_hamid",
            text: "Assalamu'alaikum Ahmad, jangan lupa hafalan surat Al-Mulk ayat 1-15 untuk UTS.",
            date: "2026-03-20",
            time: "08:00",
          },
          {
            from: "s1",
            text: "Wa'alaikumussalam Ustaz, insya Allah sudah hafal sampai ayat 12. Masih lanjut menghafal.",
            date: "2026-03-20",
            time: "08:30",
          },
          {
            from: "p_hamid",
            text: "Semangat ya, perbanyak muraja'ah.",
            date: "2026-03-20",
            time: "08:35",
          },
        ],
      },
      {
        id: "th_s1_wali",
        participants: ["s1", "p_wali"],
        messages: [
          {
            from: "p_wali",
            text: "Ahmad, sampaikan ke orang tua bahwa ada rapat wali murid tanggal 5 April ya.",
            date: "2026-03-18",
            time: "13:00",
          },
          {
            from: "s1",
            text: "Baik Bu, nanti saya sampaikan ke Ayah.",
            date: "2026-03-18",
            time: "13:10",
          },
          {
            from: "p_wali",
            text: "Terima kasih Ahmad, kamu siswa yang bertanggung jawab 👍",
            date: "2026-03-18",
            time: "13:20",
          },
        ],
      },
      {
        id: "th_g1_aisyah",
        participants: ["g1", "p_aisyah"],
        messages: [
          {
            from: "p_aisyah",
            text: "Bu, tugas yang kemarin sudah saya kumpulkan",
            date: "2026-03-23",
            time: "15:00",
          },
          {
            from: "g1",
            text: "Baik Aisyah, nanti Ibu periksa ya.",
            date: "2026-03-23",
            time: "15:05",
          },
        ],
      },
      {
        id: "th_g1_budi",
        participants: ["g1", "p_budi"],
        messages: [
          {
            from: "g1",
            text: "Budi, jangan lupa remedial UH 2 hari Kamis ya.",
            date: "2026-03-23",
            time: "13:00",
          },
          {
            from: "p_budi",
            text: "Terima kasih Bu, sudah saya pahami",
            date: "2026-03-23",
            time: "13:10",
          },
        ],
      },
      {
        id: "th_g1_citra",
        participants: ["g1", "p_citra"],
        messages: [
          {
            from: "p_citra",
            text: "Mohon info jadwal remedial Dimas bu...",
            date: "2026-03-21",
            time: "10:00",
          },
          {
            from: "g1",
            text: "Baik Bu Citra, remedial Dimas hari Sabtu pukul 08.00 di Ruang 301.",
            date: "2026-03-21",
            time: "10:20",
          },
        ],
      },
      {
        id: "th_g1_nugroho",
        participants: ["g1", "p_nugroho"],
        messages: [
          {
            from: "g1",
            text: "Pak Ahmad, mohon koordinasi jadwal pengawas UTS minggu depan.",
            date: "2026-03-20",
            time: "09:00",
          },
          {
            from: "p_nugroho",
            text: "Baik Bu, nanti kita koordinasikan",
            date: "2026-03-20",
            time: "09:30",
          },
        ],
      },
      {
        id: "th_g1_grup",
        participants: ["g1", "p_grup"],
        messages: [
          {
            from: "g1",
            text: "Ingat ya, deadline tugas Rabu",
            date: "2026-03-20",
            time: "08:00",
          },
        ],
      },
      {
        id: "th_o1_andi",
        participants: ["o1", "p_andi"],
        messages: [
          {
            from: "p_andi",
            text: "Nilai fisika Ahmad sudah diperbaiki",
            date: "2026-03-23",
            time: "14:00",
          },
          {
            from: "o1",
            text: "Terima kasih banyak Pak Andi atas perhatiannya.",
            date: "2026-03-23",
            time: "14:20",
          },
        ],
      },
      {
        id: "th_o1_dewi",
        participants: ["o1", "p_dewisafitri"],
        messages: [
          {
            from: "o1",
            text: "Bu Dewi, mohon perhatian ekstra untuk Ahmad di pelajaran Kimia.",
            date: "2026-03-22",
            time: "09:00",
          },
          {
            from: "p_dewisafitri",
            text: "Baik Pak, akan saya perhatikan",
            date: "2026-03-22",
            time: "09:30",
          },
        ],
      },
      {
        id: "th_o1_rizki",
        participants: ["o1", "p_rizki"],
        messages: [
          {
            from: "p_rizki",
            text: "Jadwal ekskul sudah diperbarui",
            date: "2026-03-21",
            time: "10:00",
          },
        ],
      },
      {
        id: "th_o1_nur",
        participants: ["o1", "p_nur"],
        messages: [
          {
            from: "p_nur",
            text: "Hafalan Ahmad sudah sangat baik",
            date: "2026-03-17",
            time: "11:00",
          },
          {
            from: "o1",
            text: "Alhamdulillah, terima kasih Bu Nur.",
            date: "2026-03-17",
            time: "11:30",
          },
        ],
      },
    ],

    // Tugas siswa: status pengumpulan per tugas
    tugas_siswa: {
      // taskId: { done, file, submittedAt }
    },

    // Tugas yang dibuat guru
    tugas_guru: [
      {
        id: "tg1",
        title: "Latihan Soal Aljabar Bab 4",
        kelas: "X IPA 1",
        deadline: "2026-03-28",
        status: "aktif",
        submitted: 24,
        total: 32,
      },
      {
        id: "tg2",
        title: "Tugas Kelompok: Statistika Data Sekolah",
        kelas: "X IPA 2",
        deadline: "2026-04-02",
        status: "aktif",
        submitted: 12,
        total: 30,
      },
    ],

    // Pembayaran (ortu) – SPP anak
    pembayaran: [
      {
        id: "pay_apr26",
        item: "SPP Bulan April 2026",
        amount: 750000,
        admin: 2500,
        status: "unpaid",
        due: "2026-04-10",
        method: null,
        paidAt: null,
        ref: null,
      },
      {
        id: "pay_mar26",
        item: "SPP Bulan Maret 2026",
        amount: 750000,
        status: "paid",
        paidAt: "2026-03-08",
        method: "Transfer Bank BCA",
        ref: "TRX-20260308-1121",
      },
      {
        id: "pay_feb26",
        item: "SPP Bulan Februari 2026",
        amount: 750000,
        status: "paid",
        paidAt: "2026-02-05",
        method: "VA BCA",
        ref: "TRX-20260205-8812",
      },
      {
        id: "pay_jan26",
        item: "SPP Bulan Januari 2026",
        amount: 750000,
        status: "paid",
        paidAt: "2026-01-06",
        method: "VA Mandiri",
        ref: "TRX-20260106-3341",
      },
      {
        id: "pay_des25",
        item: "SPP Desember 2025",
        amount: 750000,
        status: "paid",
        paidAt: "2025-12-03",
        method: "GoPay",
        ref: "TRX-20251203-7710",
      },
      {
        id: "pay_nov25",
        item: "SPP November 2025",
        amount: 750000,
        status: "paid",
        paidAt: "2025-11-04",
        method: "VA BCA",
        ref: "TRX-20251104-5520",
      },
      {
        id: "pay_okt25",
        item: "SPP Oktober 2025",
        amount: 750000,
        status: "paid",
        paidAt: "2025-10-07",
        method: "Transfer Bank Mandiri",
        ref: "TRX-20251007-9931",
      },
      {
        id: "pay_sep25",
        item: "SPP September 2025",
        amount: 750000,
        status: "paid",
        paidAt: "2025-09-05",
        method: "VA BNI",
        ref: "TRX-20250905-2214",
      },
      {
        id: "pay_agu25",
        item: "SPP Agustus 2025",
        amount: 750000,
        status: "paid",
        paidAt: "2025-08-10",
        method: "OVO",
        ref: "TRX-20250810-6672",
      },
      {
        id: "pay_jul25",
        item: "Uang Pangkal + SPP Juli",
        amount: 3250000,
        status: "paid",
        paidAt: "2025-07-15",
        method: "Transfer Bank BCA",
        ref: "TRX-20250715-1108",
      },
    ],

    // Ekskul yang diikuti siswa
    ekskul_joined: ["Futsal", "Tahfidz Club"],

    // Pendaftar PPDB
    ppdb_pendaftar: [],

    // Checklist tugas di dashboard siswa
    task_checks: {},

    // Notifikasi sederhana per peran
    notif: {
      siswa: [],
      guru: [],
      ortu: [],
    },
  };

  function seedIfNeeded() {
    const current = parseInt(localStorage.getItem(SEED_VERSION_KEY) || "0", 10);
    if (current >= SEED_VERSION) return;
    // Versi seed berubah → muat ulang data contoh agar konsisten
    Object.keys(SEED).forEach(function (key) {
      write(key, SEED[key]);
    });
    localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION));
  }

  function resetAll() {
    Object.keys(localStorage)
      .filter(function (k) {
        return k.indexOf(PREFIX) === 0;
      })
      .forEach(function (k) {
        localStorage.removeItem(k);
      });
    localStorage.removeItem(SEED_VERSION_KEY);
    localStorage.removeItem("mc_session");
    seedIfNeeded();
  }

  // ── PUBLIC API ────────────────────────────
  window.MCDB = {
    get: read,
    set: write,
    remove: remove,
    uid: uid,
    todayISO: todayISO,
    nowTime: nowTime,
    resetAll: resetAll,

    // helper koleksi array
    push: function (key, item) {
      const arr = read(key, []);
      arr.push(item);
      write(key, arr);
      return item;
    },
    updateWhere: function (key, predicate, updater) {
      const arr = read(key, []);
      let changed = false;
      arr.forEach(function (item, i) {
        if (predicate(item)) {
          arr[i] = updater(item) || item;
          changed = true;
        }
      });
      if (changed) write(key, arr);
      return changed;
    },
    removeWhere: function (key, predicate) {
      const arr = read(key, []);
      const next = arr.filter(function (item) {
        return !predicate(item);
      });
      write(key, next);
      return arr.length - next.length;
    },

    // ── Pesan (thread bersama antar peran) ──
    getThreadsFor: function (userId) {
      return read("pesan_threads", []).filter(function (t) {
        return t.participants.indexOf(userId) !== -1;
      });
    },
    getThread: function (threadId) {
      return read("pesan_threads", []).find(function (t) {
        return t.id === threadId;
      });
    },
    sendMessage: function (threadId, fromUserId, text) {
      const threads = read("pesan_threads", []);
      const th = threads.find(function (t) {
        return t.id === threadId;
      });
      if (!th) return null;
      const msg = {
        from: fromUserId,
        text: text,
        date: todayISO(),
        time: nowTime(),
      };
      th.messages.push(msg);
      write("pesan_threads", threads);
      return msg;
    },

    // ── Absensi ──
    getAbsensi: function (dateISO) {
      const all = read("absensi", {});
      return all[dateISO] || null;
    },
    saveAbsensi: function (dateISO, records) {
      const all = read("absensi", {});
      all[dateISO] = records;
      write("absensi", all);
    },
    getAbsensiRekapSiswa: function (nis) {
      const all = read("absensi", {});
      const rekap = { h: 0, i: 0, s: 0, a: 0, detail: [] };
      Object.keys(all)
        .sort()
        .forEach(function (date) {
          const rec = all[date][nis];
          if (rec) {
            rekap[rec.st] = (rekap[rec.st] || 0) + 1;
            rekap.detail.push({ date: date, st: rec.st, note: rec.note || "" });
          }
        });
      return rekap;
    },

    // ── Nilai ──
    getNilaiSiswa: function (nis) {
      const all = read("nilai_kelas", {});
      return all[nis] || null;
    },
    saveNilaiKelas: function (map) {
      write("nilai_kelas", map);
    },

    // ── Pengumuman ──
    getPengumuman: function (publishedOnly) {
      const list = read("pengumuman", []);
      return publishedOnly
        ? list.filter(function (a) {
            return a.status === "published";
          })
        : list;
    },

    // ── Notifikasi ──
    notify: function (role, text) {
      const n = read("notif", { siswa: [], guru: [], ortu: [] });
      n[role] = n[role] || [];
      n[role].unshift({
        text: text,
        date: todayISO(),
        time: nowTime(),
        read: false,
      });
      if (n[role].length > 30) n[role] = n[role].slice(0, 30);
      write("notif", n);
    },
    getNotif: function (role) {
      const n = read("notif", { siswa: [], guru: [], ortu: [] });
      return n[role] || [];
    },
    markNotifRead: function (role) {
      const n = read("notif", { siswa: [], guru: [], ortu: [] });
      (n[role] || []).forEach(function (item) {
        item.read = true;
      });
      write("notif", n);
    },
  };

  seedIfNeeded();
})();
