// ═══════════════════════════════════════════
//  MaConnect – Main JavaScript
// ═══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // ── SCROLL PROGRESS BAR ──────────────────
  const scrollBar = document.getElementById("scrollProgress");
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      if (scrollBar) scrollBar.style.width = pct.toFixed(1) + "%";
    },
    { passive: true },
  );

  // ── HAMBURGER / MOBILE NAV ────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

  function openNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.add("open");
    mobileNav.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (hamburger)
    hamburger.addEventListener("click", () => {
      hamburger.classList.contains("open") ? closeNav() : openNav();
    });
  mobileLinks.forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // ── ACTIVE NAV ON SCROLL ──────────────────
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.classList.add("active");
              link.setAttribute("aria-current", "page");
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: "-68px 0px 0px 0px" },
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // ── ACCESSIBILITY PANEL & FEATURES ─────────────────
  const A11Y_STORAGE_KEY = "mc_a11y_prefs";
  const a11yState = {
    hc: false,
    bigText: false,
    dyslexia: false,
    spacing: false,
    links: false,
    grayscale: false,
    noAnim: false,
    bigCursor: false,
    noImages: false,
    strongFocus: false,
    readingGuide: false,
    saturate: false,
    dark: false,
    fontSize: 16,
  };

  // Load saved preferences
  function loadA11yPrefs() {
    try {
      const saved = localStorage.getItem(A11Y_STORAGE_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        Object.assign(a11yState, prefs);
      }
    } catch (e) {
      /* ignore */
    }
  }

  function saveA11yPrefs() {
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(a11yState));
    } catch (e) {
      /* ignore */
    }
  }

  // Apply all a11y states to DOM
  function applyA11yState() {
    const b = document.body;
    const html = document.documentElement;

    b.classList.toggle("hc", a11yState.hc);
    b.classList.toggle("a11y-spacing", a11yState.spacing);
    b.classList.toggle("a11y-links", a11yState.links);
    b.classList.toggle("a11y-grayscale", a11yState.grayscale);
    b.classList.toggle("a11y-no-anim", a11yState.noAnim);
    b.classList.toggle("a11y-big-cursor", a11yState.bigCursor);
    b.classList.toggle("a11y-no-images", a11yState.noImages);
    b.classList.toggle("a11y-strong-focus", a11yState.strongFocus);
    b.classList.toggle("a11y-reading-guide", a11yState.readingGuide);
    b.classList.toggle("a11y-saturate", a11yState.saturate);
    b.classList.toggle("a11y-dark", a11yState.dark);

    // Font size
    html.style.fontSize =
      a11yState.fontSize !== 16 ? a11yState.fontSize + "px" : "";

    // Dyslexia font
    b.style.fontFamily = a11yState.dyslexia
      ? '"Comic Sans MS", "OpenDyslexic", cursive'
      : "";

    // Update panel option states
    document.querySelectorAll(".a11y-option[data-key]").forEach((opt) => {
      const key = opt.dataset.key;
      opt.classList.toggle("active", !!a11yState[key]);
      const pressed = a11yState[key] ? "true" : "false";
      opt.setAttribute("aria-pressed", pressed);
    });

    // Update slider
    const slider = document.getElementById("a11yFontSlider");
    const sliderVal = document.getElementById("a11yFontVal");
    if (slider) slider.value = a11yState.fontSize;
    if (sliderVal) sliderVal.textContent = a11yState.fontSize + "px";

    // Update mini toolbar button states
    const btnHC = document.getElementById("btnHC");
    const btnBig = document.getElementById("btnBig");
    const btnDys = document.getElementById("btnDys");
    if (btnHC) {
      btnHC.classList.toggle("active", a11yState.hc);
      btnHC.setAttribute("aria-pressed", a11yState.hc ? "true" : "false");
    }
    if (btnBig) {
      btnBig.classList.toggle("active", a11yState.fontSize > 16);
      btnBig.setAttribute(
        "aria-pressed",
        a11yState.fontSize > 16 ? "true" : "false",
      );
    }
    if (btnDys) {
      btnDys.classList.toggle("active", a11yState.dyslexia);
      btnDys.setAttribute(
        "aria-pressed",
        a11yState.dyslexia ? "true" : "false",
      );
    }

    window.dispatchEvent(new CustomEvent("mc-a11y"));

    saveA11yPrefs();
  }

  // Toggle a11y preference
  function toggleA11y(key) {
    a11yState[key] = !a11yState[key];
    applyA11yState();

    const labels = {
      hc: ["Mode kontras tinggi diaktifkan", "Mode kontras tinggi dimatikan"],
      dyslexia: ["Font disleksia diaktifkan", "Font default diaktifkan"],
      spacing: ["Spasi teks diperbesar", "Spasi teks normal"],
      links: ["Sorotan link diaktifkan", "Sorotan link dimatikan"],
      grayscale: ["Mode abu-abu diaktifkan", "Mode abu-abu dimatikan"],
      noAnim: ["Animasi dihentikan", "Animasi diaktifkan kembali"],
      bigCursor: ["Kursor besar diaktifkan", "Kursor besar dimatikan"],
      noImages: ["Gambar disembunyikan", "Gambar ditampilkan kembali"],
      strongFocus: ["Fokus kuat diaktifkan", "Fokus kuat dimatikan"],
      readingGuide: ["Panduan baca diaktifkan", "Panduan baca dimatikan"],
      saturate: ["Saturasi warna ditingkatkan", "Saturasi warna normal"],
      dark: ["Mode gelap diaktifkan", "Mode gelap dimatikan"],
    };
    const pair = labels[key];
    if (pair) {
      const msg = a11yState[key] ? pair[0] : pair[1];
      announce(msg);
      showToast(msg);
    }
  }

  // Reset all a11y prefs
  function resetA11y() {
    Object.keys(a11yState).forEach((k) => {
      if (k === "fontSize") a11yState[k] = 16;
      else a11yState[k] = false;
    });
    applyA11yState();
    announce("Semua pengaturan aksesibilitas direset");
    showToast("↺ Semua pengaturan aksesibilitas direset");
  }

  // Panel open/close
  function openA11yPanel() {
    const panel = document.getElementById("a11yPanel");
    const overlay = document.getElementById("a11yPanelOverlay");
    if (panel) {
      panel.classList.add("open");
      panel.querySelector(".a11y-panel-close")?.focus();
    }
    if (overlay) overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    announce("Panel aksesibilitas dibuka");
  }

  function closeA11yPanel() {
    const panel = document.getElementById("a11yPanel");
    const overlay = document.getElementById("a11yPanelOverlay");
    if (panel) panel.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("btnA11yOpen")?.focus();
  }

  // Expose globally
  window.toggleA11y = toggleA11y;
  window.resetA11y = resetA11y;
  window.openA11yPanel = openA11yPanel;
  window.closeA11yPanel = closeA11yPanel;

  // Keep old functions working for backward compat
  window.toggleHighContrast = function () {
    toggleA11y("hc");
  };
  window.toggleBigText = function () {
    a11yState.fontSize = a11yState.fontSize <= 16 ? 20 : 16;
    applyA11yState();
    announce(
      a11yState.fontSize > 16 ? "Teks diperbesar" : "Ukuran teks normal",
    );
    showToast(a11yState.fontSize > 16 ? "A+ Teks diperbesar" : "A Teks normal");
  };
  window.toggleDyslexia = function () {
    toggleA11y("dyslexia");
  };

  // Setup panel toggle buttons
  document.querySelectorAll(".a11y-option[data-key]").forEach((opt) => {
    opt.addEventListener("click", () => toggleA11y(opt.dataset.key));
    opt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleA11y(opt.dataset.key);
      }
    });
  });

  // Font size slider
  const fontSlider = document.getElementById("a11yFontSlider");
  if (fontSlider) {
    fontSlider.addEventListener("input", () => {
      a11yState.fontSize = parseInt(fontSlider.value);
      applyA11yState();
    });
    fontSlider.addEventListener("change", () => {
      announce("Ukuran font: " + a11yState.fontSize + " piksel");
    });
  }

  // Panel buttons
  document
    .getElementById("btnA11yOpen")
    ?.addEventListener("click", openA11yPanel);

  // ── TOOLBAR A11Y KOLAPSIBEL ───────────────
  // Default terlipat di layar kecil agar tidak menutupi konten
  (function () {
    const toolbar = document.querySelector(".a11y-toolbar");
    if (!toolbar) return;
    const collapseBtn = document.createElement("button");
    collapseBtn.className = "a11y-btn a11y-collapse-btn";
    collapseBtn.setAttribute("aria-expanded", "true");
    const saved = localStorage.getItem("mc_a11y_toolbar");
    const startCollapsed =
      saved !== null ? saved === "collapsed" : window.innerWidth <= 768;
    const apply = (collapsed) => {
      toolbar.classList.toggle("collapsed", collapsed);
      collapseBtn.innerHTML = collapsed
        ? '<span class="tooltip">Tampilkan Fitur Aksesibilitas</span>♿'
        : '<span class="tooltip">Sembunyikan Toolbar</span>✕';
      collapseBtn.setAttribute("aria-expanded", String(!collapsed));
      collapseBtn.setAttribute(
        "aria-label",
        collapsed
          ? "Tampilkan toolbar aksesibilitas"
          : "Sembunyikan toolbar aksesibilitas",
      );
      localStorage.setItem(
        "mc_a11y_toolbar",
        collapsed ? "collapsed" : "expanded",
      );
    };
    collapseBtn.addEventListener("click", () =>
      apply(!toolbar.classList.contains("collapsed")),
    );
    toolbar.appendChild(collapseBtn);
    apply(startCollapsed);
  })();

  document
    .getElementById("a11yPanelOverlay")
    ?.addEventListener("click", closeA11yPanel);
  document
    .getElementById("a11yPanelCloseBtn")
    ?.addEventListener("click", closeA11yPanel);
  document.getElementById("a11yResetBtn")?.addEventListener("click", resetA11y);
  document.getElementById("a11yShortcutBtn")?.addEventListener("click", () => {
    mcModal(
      "⌨️ Pintasan Keyboard Aksesibilitas",
      `
      <div class="kbd-grid">
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>A</kbd> <span>Buka Panel</span></div>
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>H</kbd> <span>Kontras Tinggi</span></div>
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>D</kbd> <span>Mode Gelap</span></div>
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>+</kbd> <span>Perbesar Teks</span></div>
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>-</kbd> <span>Perkecil Teks</span></div>
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>G</kbd> <span>Panduan Baca</span></div>
        <div class="kbd-item"><kbd>Alt</kbd>+<kbd>R</kbd> <span>Reset Semua</span></div>
        <div class="kbd-item"><kbd>Esc</kbd> <span>Tutup Panel</span></div>
        <div class="kbd-item"><kbd>Tab</kbd> <span>Navigasi Elemen</span></div>
        <div class="kbd-item"><kbd>Enter</kbd> <span>Aktifkan Tombol</span></div>
      </div>
    `,
    );
  });

  // Reading guide (follows mouse)
  const readingGuide = document.getElementById("readingGuide");
  if (readingGuide) {
    document.addEventListener("mousemove", (e) => {
      if (a11yState.readingGuide) {
        readingGuide.style.top = e.clientY - 6 + "px";
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;
    switch (e.key.toLowerCase()) {
      case "a":
        e.preventDefault();
        openA11yPanel();
        break;
      case "h":
        e.preventDefault();
        toggleA11y("hc");
        break;
      case "d":
        e.preventDefault();
        toggleA11y("dark");
        break;
      case "g":
        e.preventDefault();
        toggleA11y("readingGuide");
        break;
      case "r":
        e.preventDefault();
        resetA11y();
        break;
      case "+":
      case "=":
        e.preventDefault();
        a11yState.fontSize = Math.min(28, a11yState.fontSize + 2);
        applyA11yState();
        announce("Ukuran font: " + a11yState.fontSize + "px");
        break;
      case "-":
        e.preventDefault();
        a11yState.fontSize = Math.max(12, a11yState.fontSize - 2);
        applyA11yState();
        announce("Ukuran font: " + a11yState.fontSize + "px");
        break;
    }
  });

  // Close panel on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const panel = document.getElementById("a11yPanel");
      if (panel?.classList.contains("open")) {
        e.stopPropagation();
        closeA11yPanel();
      }
    }
  });

  // Focus trap for a11y panel
  document.getElementById("a11yPanel")?.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const panel = document.getElementById("a11yPanel");
    const focusable = panel.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"]), .a11y-option',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Load and apply saved preferences on start
  loadA11yPrefs();
  applyA11yState();

  // ── LIVE REGION ANNOUNCER ─────────────────
  function announce(msg) {
    let el = document.getElementById("sr-live");
    if (!el) {
      el = document.createElement("div");
      el.id = "sr-live";
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      el.className = "sr-only";
      document.body.appendChild(el);
    }
    el.textContent = "";
    setTimeout(() => {
      el.textContent = msg;
    }, 80);
  }

  // ── TOAST NOTIFICATION ────────────────────
  let toastTimer = null;
  window.showToast = function (msg, type = "") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    const icons = { error: "✕", success: "✓" };
    toast.textContent = (icons[type] || "✓") + " " + msg;
    toast.className = "toast show " + type;
    toastTimer = setTimeout(() => {
      toast.className = "toast";
    }, 2800);
  };

  // ── LOGIN MODAL ───────────────────────────
  const loginOverlay = document.getElementById("loginOverlay");
  const loginForm = document.getElementById("loginForm");

  window.openLogin = function () {
    if (loginOverlay) {
      loginOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(() => loginOverlay.querySelector("input")?.focus(), 100);
    }
  };
  window.closeLogin = function () {
    if (loginOverlay) {
      loginOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  };

  // Close on backdrop click
  if (loginOverlay) {
    loginOverlay.addEventListener("click", (e) => {
      if (e.target === loginOverlay) closeLogin();
    });
    // Focus trap for login modal
    loginOverlay.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = loginOverlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && loginOverlay?.classList.contains("open"))
      closeLogin();
  });

  // Buka modal login otomatis jika diarahkan oleh route guard
  if (new URLSearchParams(window.location.search).has("login")) {
    setTimeout(() => window.openLogin(), 300);
  }

  // Role tabs in modal
  const roleTabs = document.querySelectorAll(".role-tab-btn");
  roleTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      roleTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const role = btn.dataset.role;
      const placeholders = {
        siswa: "NISN / Email Siswa",
        guru: "NIP / Email Guru",
        ortu: "Email Orang Tua",
        admin: "Username Admin",
      };
      const emailInput = document.getElementById("loginEmail");
      if (emailInput) emailInput.placeholder = placeholders[role] || "Email";
    });
  });

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail")?.value.trim();
      const pass = document.getElementById("loginPass")?.value.trim();
      const btn = loginForm.querySelector(".login-btn");

      if (!email || !pass) {
        showToast("Isi semua kolom terlebih dahulu", "error");
        return;
      }
      // Determine active role
      const activeRole =
        document.querySelector(".role-tab-btn.active")?.dataset.role || "siswa";
      const dashboardMap = {
        siswa: "pages/dashboard.html",
        guru: "pages/dashboard-guru.html",
        ortu: "pages/dashboard-ortu.html",
        admin: "pages/dashboard-admin.html",
      };

      // Validasi kredensial nyata via MCAuth
      if (btn) {
        btn.textContent = "Memeriksa...";
        btn.disabled = true;
      }
      setTimeout(() => {
        const user =
          typeof MCAuth !== "undefined"
            ? MCAuth.login(email, pass, activeRole)
            : null;
        if (!user) {
          if (btn) {
            btn.textContent = "Masuk ke Portal";
            btn.disabled = false;
          }
          showToast(
            "Email/NISN atau kata sandi salah untuk peran ini",
            "error",
          );
          const hint = document.getElementById("loginHint");
          if (hint) hint.style.display = "block";
          return;
        }
        closeLogin();
        showToast("Selamat datang, " + user.name + "!", "success");
        setTimeout(() => {
          const isInPagesFolder = window.location.pathname.includes("/pages/");
          const redirectPath = isInPagesFolder
            ? dashboardMap[activeRole].replace(/^pages\//, "")
            : dashboardMap[activeRole];
          window.location.href = redirectPath;
        }, 700);
      }, 500);
    });
  }

  // ── ANNOUNCEMENT STRIP CLOSE ──────────────
  const stripClose = document.getElementById("stripClose");
  const strip = document.getElementById("announceStrip");
  if (stripClose && strip) {
    stripClose.addEventListener("click", () => {
      strip.style.display = "none";
    });
  }

  // ── PPDB BUTTON ───────────────────────────
  document.querySelectorAll('[data-action="ppdb"]').forEach((el) => {
    el.addEventListener("click", () => {
      window.location.href = "pages/ppdb.html";
    });
  });

  // ── ROLE PORTAL BUTTONS ───────────────────
  document.querySelectorAll('[data-action="login"]').forEach((el) => {
    el.addEventListener("click", openLogin);
  });

  // ── DASHBOARD TABS ────────────────────────
  const dashTabs = document.querySelectorAll(".dash-tab");
  dashTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dashTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showToast("Tab " + tab.textContent + " dibuka");
    });
  });

  // ── DASHBOARD MENU LINKS ──────────────────
  document.querySelectorAll(".dash-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".dash-menu a")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ── PROGRESS BAR ANIMATION ───────────────
  const dashSection = document.getElementById("dashboard-section");
  if (dashSection) {
    const progObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".prog-fill").forEach((bar) => {
              const target = bar.dataset.width;
              if (target) {
                bar.style.width = "0";
                setTimeout(() => {
                  bar.style.transition = "width 1s ease";
                  bar.style.width = target;
                }, 200);
              }
            });
            progObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    progObserver.observe(dashSection);
  }

  // ── CALENDAR ─────────────────────────────
  document.querySelectorAll(".cal-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Navigasi kalender — gunakan halaman kalender untuk detail");
    });
  });

  // ── ANNOUNCEMENT CARDS ───────────────────
  document.querySelectorAll(".ann-card").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h4")?.textContent;
      showToast(
        "Membuka: " + (title?.substring(0, 40) || "Pengumuman") + "...",
      );
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // ── QUICK LINKS ───────────────────────────
  document.querySelectorAll(".quick-item").forEach((item) => {
    item.addEventListener("click", () => {
      const lbl = item.querySelector(".quick-lbl")?.textContent;
      if (lbl?.includes("PPDB")) window.location.href = "pages/ppdb.html";
      else if (lbl?.includes("Dashboard") || lbl?.includes("Rapor")) {
        openLogin();
      } else showToast("Membuka: " + lbl);
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter") item.click();
    });
  });

  // ── SMOOTH SCROLL OFFSET (for fixed navbar) ──
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
      }
    });
  });

  // ── STICKY NAVBAR SHADOW ─────────────────
  const navbar = document.querySelector(".navbar");
  window.addEventListener(
    "scroll",
    () => {
      if (navbar) {
        navbar.style.boxShadow =
          window.scrollY > 10 ? "0 2px 20px rgba(0,0,0,0.08)" : "";
      }
    },
    { passive: true },
  );

  // ── ENTRANCE ANIMATIONS (Intersection) ────
  const fadeEls = document.querySelectorAll(
    ".feat-card, .role-card, .a11y-card, .ann-card",
  );
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = (i % 3) * 80 + "ms";
          entry.target.classList.add("fade-in");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  fadeEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .45s ease, transform .45s ease";
    fadeObserver.observe(el);
  });
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
      .fade-in { opacity:1 !important; transform:translateY(0) !important; }
      .mc-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:all .25s}
      .mc-modal-overlay.open{opacity:1;visibility:visible}
      .mc-modal{background:#fff;border-radius:14px;width:90%;max-width:560px;max-height:80vh;overflow-y:auto;padding:0;transform:translateY(20px);transition:transform .25s}
      .mc-modal-overlay.open .mc-modal{transform:translateY(0)}
      .mc-modal-header{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid var(--gray-100,#e5e7eb)}
      .mc-modal-header h3{font-size:16px;font-weight:700;color:var(--gray-900,#111)}
      .mc-modal-close{width:32px;height:32px;border-radius:50%;border:none;background:var(--gray-100,#f3f4f6);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
      .mc-modal-close:hover{background:var(--gray-200,#e5e7eb)}
      .mc-modal-body{padding:22px}
      .mc-modal-footer{padding:14px 22px;border-top:1px solid var(--gray-100,#e5e7eb);display:flex;gap:10px;justify-content:flex-end}
      .mc-confirm-text{font-size:14px;color:var(--gray-700,#374151);line-height:1.6;margin-bottom:10px}
      .mc-btn{padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .15s}
      .mc-btn-primary{background:var(--green-600,#059669);color:#fff}.mc-btn-primary:hover{opacity:.9}
      .mc-btn-danger{background:#DC2626;color:#fff}.mc-btn-danger:hover{opacity:.9}
      .mc-btn-cancel{background:var(--gray-100,#f3f4f6);color:var(--gray-700,#374151)}.mc-btn-cancel:hover{background:var(--gray-200,#e5e7eb)}
    </style>
  `,
  );

  // ── SIDEBAR MOBILE TOGGLE (for inner pages) ──
  const sidebarEl = document.querySelector(".sidebar");
  if (sidebarEl) {
    let sidebarToggle = document.getElementById("sidebarToggle");
    if (!sidebarToggle) {
      sidebarToggle = document.createElement("button");
      sidebarToggle.id = "sidebarToggle";
      sidebarToggle.className = "mobile-sidebar-btn";
      sidebarToggle.setAttribute("aria-label", "Buka menu navigasi");
      sidebarToggle.setAttribute("aria-expanded", "false");
      sidebarToggle.innerHTML = "<span></span><span></span><span></span>";
      document.body.appendChild(sidebarToggle);
    }
    const sidebarBackdrop = document.createElement("div");
    sidebarBackdrop.className = "sidebar-backdrop";
    document.body.appendChild(sidebarBackdrop);

    const setSidebar = (open) => {
      sidebarEl.classList.toggle("open", open);
      sidebarBackdrop.classList.toggle("show", open);
      sidebarToggle.classList.toggle("open", open);
      sidebarToggle.setAttribute("aria-expanded", String(open));
      sidebarToggle.setAttribute(
        "aria-label",
        open ? "Tutup menu navigasi" : "Buka menu navigasi",
      );
    };
    sidebarToggle.addEventListener("click", () =>
      setSidebar(!sidebarEl.classList.contains("open")),
    );
    sidebarBackdrop.addEventListener("click", () => setSidebar(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebarEl.classList.contains("open"))
        setSidebar(false);
    });
    // Tutup saat memilih menu (mobile)
    sidebarEl.addEventListener("click", (e) => {
      if (e.target.closest("a")) setSidebar(false);
    });
  }

  // ── TOGGLE SWITCHES GLOBAL ────────────────
  document
    .querySelectorAll(".toggle input[type='checkbox']")
    .forEach((toggle) => {
      toggle.addEventListener("change", () => {
        const label =
          toggle
            .closest(".setting-item")
            ?.querySelector(".setting-label, .setting-title")?.textContent ||
          "Pengaturan";
        showToast(
          toggle.checked
            ? "✓ " + label + " diaktifkan"
            : label + " dinonaktifkan",
        );
      });
    });

  // ── GENERIC CONFIRM DIALOG ────────────────
  window.mcConfirm = function (
    title,
    message,
    onConfirm,
    btnText = "Ya, Lanjutkan",
    btnClass = "mc-btn-primary",
  ) {
    const overlay = document.createElement("div");
    overlay.className = "mc-modal-overlay open";
    overlay.innerHTML = `<div class="mc-modal"><div class="mc-modal-header"><h3>${title}</h3><button class="mc-modal-close" onclick="this.closest('.mc-modal-overlay').remove()">✕</button></div><div class="mc-modal-body"><p class="mc-confirm-text">${message}</p></div><div class="mc-modal-footer"><button class="mc-btn mc-btn-cancel" onclick="this.closest('.mc-modal-overlay').remove()">Batal</button><button class="mc-btn ${btnClass}" id="mcConfirmBtn">${btnText}</button></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.getElementById("mcConfirmBtn").addEventListener("click", () => {
      overlay.remove();
      onConfirm();
    });
  };

  // ── GENERIC DETAIL MODAL ──────────────────
  window.mcModal = function (title, bodyHTML) {
    const overlay = document.createElement("div");
    overlay.className = "mc-modal-overlay open";
    overlay.innerHTML = `<div class="mc-modal"><div class="mc-modal-header"><h3>${title}</h3><button class="mc-modal-close" onclick="this.closest('.mc-modal-overlay').remove()">✕</button></div><div class="mc-modal-body">${bodyHTML}</div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.addEventListener("keydown", function handler(e) {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", handler);
      }
    });
  };

  // ── FILE UPLOAD SIMULATION ────────────────
  document.querySelectorAll(".upload-area").forEach((area) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.docx,.jpg,.png,.jpeg";
    fileInput.style.display = "none";
    fileInput.multiple = true;
    area.appendChild(fileInput);
    area.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.click();
    });
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const names = Array.from(fileInput.files)
          .map((f) => f.name)
          .join(", ");
        showToast("File dipilih: " + names);
        const p = area.querySelector("p strong");
        if (p) p.textContent = "✅ " + names;
      }
    });
    // Drag and drop
    area.addEventListener("dragover", (e) => {
      e.preventDefault();
      area.style.borderColor = "var(--green-400)";
      area.style.background = "var(--green-50)";
    });
    area.addEventListener("dragleave", () => {
      area.style.borderColor = "";
      area.style.background = "";
    });
    area.addEventListener("drop", (e) => {
      e.preventDefault();
      area.style.borderColor = "";
      area.style.background = "";
      if (e.dataTransfer.files.length > 0) {
        const names = Array.from(e.dataTransfer.files)
          .map((f) => f.name)
          .join(", ");
        showToast("File diunggah: " + names);
        const p = area.querySelector("p strong");
        if (p) p.textContent = "✅ " + names;
      }
    });
  });

  // ── ROLE DARI PATH (dipakai search & notif) ──
  function currentRoleFromPath() {
    const path = window.location.pathname;
    const file = path.split("/").pop() || "";
    if (!path.includes("/pages/")) return null;
    if (file.startsWith("guru-") || file === "dashboard-guru.html")
      return "guru";
    if (file.startsWith("ortu-") || file === "dashboard-ortu.html")
      return "ortu";
    if (file.startsWith("admin-") || file === "dashboard-admin.html")
      return "admin";
    return "siswa";
  }

  // ── PENCARIAN GLOBAL (data nyata MCDB) ────
  const SEARCH_PAGES = {
    siswa: [
      ["🏠 Dashboard", "dashboard.html"], ["📅 Jadwal Pelajaran", "jadwal.html"],
      ["📚 Materi Pelajaran", "pelajaran.html"], ["📋 Tugas", "tugas.html"],
      ["📝 Ujian", "ujian.html"], ["📊 Nilai", "nilai.html"],
      ["⚽ Ekstrakurikuler", "ekskul.html"], ["💬 Pesan", "pesan.html"],
      ["👤 Profil", "profil.html"], ["⚙️ Pengaturan", "pengaturan.html"],
    ],
    guru: [
      ["🏠 Dashboard", "dashboard-guru.html"], ["📅 Jadwal Mengajar", "guru-jadwal.html"],
      ["🏫 Kelas Saya", "guru-kelas.html"], ["✅ Absensi", "guru-absensi.html"],
      ["📊 Nilai", "guru-nilai.html"], ["📋 Tugas", "guru-tugas.html"],
      ["📝 Ujian", "guru-ujian.html"], ["📄 Rapor", "guru-rapor.html"],
      ["📢 Pengumuman", "guru-pengumuman.html"], ["💬 Pesan", "guru-pesan.html"],
      ["👤 Profil", "guru-profil.html"], ["⚙️ Pengaturan", "guru-pengaturan.html"],
    ],
    ortu: [
      ["🏠 Dashboard", "dashboard-ortu.html"], ["📅 Jadwal Anak", "ortu-jadwal.html"],
      ["✅ Absensi Anak", "ortu-absensi.html"], ["📊 Nilai Anak", "ortu-nilai.html"],
      ["📋 Tugas Anak", "ortu-tugas.html"], ["💳 Pembayaran", "ortu-pembayaran.html"],
      ["🧾 Riwayat Pembayaran", "ortu-riwayat.html"], ["📢 Pengumuman", "ortu-pengumuman.html"],
      ["💬 Pesan", "ortu-pesan.html"], ["👤 Profil", "ortu-profil.html"],
      ["⚙️ Pengaturan", "ortu-pengaturan.html"],
    ],
    admin: [
      ["🏠 Dashboard", "dashboard-admin.html"], ["📥 Verifikasi PPDB", "admin-ppdb.html"],
      ["👥 Kelola Pengguna", "admin-users.html"],
    ],
  };

  function buildSearchIndex() {
    const role = currentRoleFromPath() || "siswa";
    const idx = [];
    (SEARCH_PAGES[role] || []).forEach((p) => {
      idx.push({ group: "Halaman", label: p[0], href: p[1] });
    });
    if (typeof MCDB === "undefined") return idx;
    const tugasHref =
      role === "guru" ? "guru-tugas.html" : role === "ortu" ? "ortu-tugas.html" : "tugas.html";
    MCDB.get("tugas_list", []).forEach((t) => {
      idx.push({
        group: "Tugas",
        label: (t.icon || "📋") + " " + t.judul + " · " + t.mapel,
        href: tugasHref,
      });
    });
    const annHref =
      role === "guru" ? "guru-pengumuman.html" : role === "ortu" ? "ortu-pengumuman.html" : "dashboard.html";
    MCDB.getPengumuman(role !== "guru").forEach((a) => {
      idx.push({ group: "Pengumuman", label: "📢 " + (a.title || a.judul || ""), href: annHref });
    });
    const jadwalHref =
      role === "guru" ? "guru-jadwal.html" : role === "ortu" ? "ortu-jadwal.html" : "jadwal.html";
    const seen = {};
    const jadwal = MCDB.get("jadwal_pelajaran", {});
    Object.keys(jadwal).forEach((hari) => {
      (jadwal[hari] || []).forEach((j) => {
        if (!j.name || seen[j.name]) return;
        seen[j.name] = true;
        idx.push({ group: "Jadwal", label: j.name + " · " + hari, href: jadwalHref });
      });
    });
    if (role === "siswa") {
      MCDB.get("ekskul_joined", []).forEach((e) => {
        idx.push({ group: "Ekskul", label: "⚽ " + e, href: "ekskul.html" });
      });
    }
    return idx;
  }

  document.querySelectorAll("div.search-bar").forEach((bar) => {
    bar.innerHTML =
      '🔍 <input type="search" class="mc-search-input" placeholder="Cari halaman, tugas, pengumuman..." aria-label="Pencarian global" autocomplete="off">';
    const input = bar.querySelector("input");
    const drop = document.createElement("div");
    drop.className = "mc-search-results";
    drop.setAttribute("role", "listbox");
    bar.style.position = "relative";
    bar.appendChild(drop);

    let items = [];
    function close() {
      drop.classList.remove("open");
      drop.innerHTML = "";
    }
    function renderResults(q) {
      const query = q.trim().toLowerCase();
      if (query.length < 2) {
        close();
        return;
      }
      if (!items.length) items = buildSearchIndex();
      const hits = items
        .filter((it) => it.label.toLowerCase().includes(query))
        .slice(0, 8);
      if (!hits.length) {
        drop.innerHTML =
          '<div class="mc-search-empty">Tidak ada hasil untuk "' +
          q.replace(/</g, "&lt;") + '"</div>';
        drop.classList.add("open");
        return;
      }
      drop.innerHTML = hits
        .map(
          (h, i) =>
            '<button type="button" class="mc-search-item" role="option" data-href="' +
            h.href + '" data-i="' + i + '">' +
            '<span class="mc-search-group">' + h.group + "</span>" +
            '<span class="mc-search-label">' + h.label.replace(/</g, "&lt;") + "</span></button>",
        )
        .join("");
      drop.classList.add("open");
      drop.querySelectorAll(".mc-search-item").forEach((btn) => {
        btn.addEventListener("mousedown", (e) => {
          e.preventDefault();
          window.location.href = btn.dataset.href;
        });
      });
    }
    input.addEventListener("input", () => renderResults(input.value));
    input.addEventListener("focus", () => renderResults(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Enter") {
        const first = drop.querySelector(".mc-search-item");
        if (first) window.location.href = first.dataset.href;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        drop.querySelector(".mc-search-item")?.focus();
      }
    });
    drop.addEventListener("keydown", (e) => {
      const focusables = [...drop.querySelectorAll(".mc-search-item")];
      const i = focusables.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        (focusables[i + 1] || focusables[0])?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (i <= 0) input.focus();
        else focusables[i - 1].focus();
      } else if (e.key === "Enter" && document.activeElement.dataset?.href) {
        window.location.href = document.activeElement.dataset.href;
      } else if (e.key === "Escape") {
        close();
        input.focus();
      }
    });
    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (!drop.contains(document.activeElement)) close();
      }, 150);
    });
  });

  // ── NOTIF BUTTON (data nyata dari MCDB) ───
  function refreshNotifBadge() {
    const role = currentRoleFromPath();
    if (!role || typeof MCDB === "undefined") return;
    const unread = MCDB.getNotif(role).filter((n) => !n.read).length;
    document.querySelectorAll(".notif-btn").forEach((btn) => {
      let dot = btn.querySelector(".notif-dot");
      if (unread > 0) {
        if (!dot) {
          dot = document.createElement("span");
          dot.className = "notif-dot";
          dot.setAttribute("aria-hidden", "true");
          btn.appendChild(dot);
        }
        dot.classList.add("notif-count");
        dot.style.display = "";
        dot.textContent = unread > 9 ? "9+" : unread;
        btn.setAttribute("aria-label", "Notifikasi — " + unread + " belum dibaca");
      } else {
        if (dot) dot.style.display = "none";
        btn.setAttribute("aria-label", "Notifikasi");
      }
    });
  }
  refreshNotifBadge();

  document.querySelectorAll(".notif-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = currentRoleFromPath();
      let items = [];
      if (role && typeof MCDB !== "undefined") {
        items = MCDB.getNotif(role);
        MCDB.markNotifRead(role);
      }
      const bodyHTML = items.length
        ? '<div style="display:flex;flex-direction:column;gap:14px">' +
          items
            .slice(0, 10)
            .map(
              (n) =>
                `<div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:8px;${n.read ? "border:1px solid var(--gray-100,#f3f4f6)" : "background:var(--green-50,#f0fdf4)"}">
            <span>🔔</span><div><p style="font-size:13px;font-weight:600">${n.text}</p><span style="font-size:10px;color:var(--gray-400,#9ca3af)">${n.date} ${n.time}</span></div>
          </div>`,
            )
            .join("") +
          "</div>"
        : '<p style="font-size:13px;color:var(--gray-500);text-align:center;padding:16px">Belum ada notifikasi baru. Aktivitas dari peran lain (nilai, absensi, pesan, pengumuman) akan muncul di sini.</p>';
      mcModal("🔔 Notifikasi", bodyHTML);
      refreshNotifBadge();
    });
  });

  // ── SIDEBAR AVATAR CLICK → PROFIL ─────────
  document
    .querySelectorAll(".topbar .sidebar-av, .topbar .user-av")
    .forEach((av) => {
      av.style.cursor = "pointer";
      av.addEventListener("click", (e) => {
        e.stopPropagation();
        // Detect which portal we're on
        const path = window.location.pathname;
        if (path.includes("guru")) window.location.href = "guru-profil.html";
        else if (path.includes("ortu"))
          window.location.href = "ortu-profil.html";
        else window.location.href = "profil.html";
      });
    });

  // ── AUTO-ENHANCE ONCLICK ELEMENTS (A11Y) ──
  // Adds role, tabindex, aria-label, and keyboard support to all
  // clickable divs/spans that use onclick but lack proper ARIA attrs.
  document.querySelectorAll("[onclick]").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    // Skip elements that are already natively accessible
    if (["a", "button", "input", "select", "textarea", "summary"].includes(tag))
      return;
    // Add role="button" if no role set
    if (!el.getAttribute("role")) el.setAttribute("role", "button");
    // Add tabindex so it's keyboard-focusable
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    // Add aria-label from text content if none exists
    if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
      const label = el.textContent.trim().replace(/\s+/g, " ").substring(0, 80);
      if (label) el.setAttribute("aria-label", label);
    }
    // Enable Enter/Space to trigger click
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ── BISINDO SIGN LANGUAGE GLOSSARY ────────
  // Provides a BISINDO glossary modal for common school-related terms.
  window.openBisindo = function () {
    const terms = [
      {
        word: "Sekolah",
        sign: "Telapak tangan kanan menepuk punggung tangan kiri dua kali",
      },
      {
        word: "Guru",
        sign: "Jari telunjuk kanan menunjuk ke depan, lalu tangan membentuk huruf G di depan dahi",
      },
      {
        word: "Murid",
        sign: "Tangan kanan menunjuk ke diri sendiri, lalu jari membentuk huruf M",
      },
      {
        word: "Belajar",
        sign: "Kedua tangan terbuka di depan dada, bergerak bergantian ke atas dan bawah seperti membaca buku",
      },
      {
        word: "Ujian",
        sign: "Jari telunjuk dan jari tengah kanan membentuk huruf V, digerakkan ke bawah di depan dada",
      },
      {
        word: "Nilai",
        sign: "Tangan kanan membentuk angka dengan jari, digerakkan dari atas ke bawah",
      },
      {
        word: "Tugas",
        sign: "Tangan kanan mengepal, digerakkan ke depan dengan tegas dua kali",
      },
      {
        word: "Jadwal",
        sign: "Telapak tangan kiri terbuka menghadap ke atas, jari telunjuk kanan menunjuk ke telapak kiri",
      },
      {
        word: "Lulus",
        sign: "Kedua tangan terbuka diangkat dari dada ke atas dengan gerakan melepas",
      },
      {
        word: "Terima Kasih",
        sign: "Tangan kanan menyentuh dagu lalu bergerak ke depan dan ke bawah",
      },
      { word: "Tolong", sign: "Telapak tangan kanan menepuk dada dua kali" },
      {
        word: "Izin",
        sign: "Tangan kanan membentuk huruf I, digerakkan dari dahi ke depan",
      },
    ];
    let html = '<div style="max-height:60vh;overflow-y:auto">';
    html +=
      '<p style="margin-bottom:16px;color:var(--gray-600,#4b5563);font-size:14px">Panduan istilah sekolah dalam Bahasa Isyarat Indonesia (BISINDO). Gunakan panduan ini untuk komunikasi inklusif di lingkungan madrasah.</p>';
    html += '<div style="display:grid;gap:10px">';
    terms.forEach((t) => {
      html += `<div style="display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:8px;border:1px solid var(--gray-200,#e5e7eb);background:var(--green-50,#f0fdf4)">
        <span style="font-size:20px;min-width:32px;text-align:center" aria-hidden="true">🤟</span>
        <div><strong style="font-size:14px;color:var(--green-700,#15803d)">${t.word}</strong>
        <p style="font-size:13px;color:var(--gray-600,#4b5563);margin-top:4px">${t.sign}</p></div>
      </div>`;
    });
    html += "</div></div>";
    mcModal("🤟 Kamus BISINDO — Istilah Sekolah", html);
  };

  // Add BISINDO button to accessibility panel if it exists
  const a11yOpts = document.querySelector(".a11y-options");
  if (a11yOpts) {
    const bisindoBtn = document.createElement("button");
    bisindoBtn.className = "a11y-option";
    bisindoBtn.setAttribute("aria-label", "Buka Kamus BISINDO");
    bisindoBtn.innerHTML =
      '<span class="a11y-opt-icon">🤟</span><span class="a11y-opt-label">Kamus BISINDO</span>';
    bisindoBtn.addEventListener("click", () => window.openBisindo());
    a11yOpts.appendChild(bisindoBtn);
  }
});

// ═══ PWA: manifest + service worker ═══
(function () {
  const base = window.location.pathname.includes("/pages/") ? "../" : "";
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = base + "manifest.json";
  document.head.appendChild(link);
  const theme = document.createElement("meta");
  theme.name = "theme-color";
  theme.content = "#16a34a";
  document.head.appendChild(theme);
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(base + "sw.js").catch(function () {});
    });
  }
})();

// ═══ CETAK: helper print area khusus ═══
window.mcPrint = function (html) {
  let area = document.getElementById("printArea");
  if (!area) {
    area = document.createElement("div");
    area.id = "printArea";
    document.body.appendChild(area);
  }
  area.innerHTML = html;
  document.body.classList.add("print-doc");
  const cleanup = function () {
    document.body.classList.remove("print-doc");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
};

// ═══ TANGGAL TOPBAR DINAMIS ═══
(function () {
  const el = document.getElementById("topbarDate");
  if (!el) return;  const now = new Date();
  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const bulan = now.getMonth() + 1; // Jan–Jun = Genap, Jul–Des = Ganjil
  const tahun = now.getFullYear();
  const semester =
    bulan >= 7
      ? "Semester Ganjil " + tahun + "/" + (tahun + 1)
      : "Semester Genap " + (tahun - 1) + "/" + tahun;
  el.textContent = tanggal + " · " + semester;
})();

// ═══ GRAFIK CANVAS RINGAN (tanpa library) ═══
// cfg: { type:'line'|'bar', labels:[], values:[], color, min, max, label }
window.mcChart = function (canvas, cfg) {
  if (!canvas || !canvas.getContext || !cfg.values || !cfg.values.length)
    return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.parentElement.clientWidth || 320;
  const h = canvas.clientHeight || 180;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  if (cfg.label) {
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", cfg.label);
  }
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const dark = document.body.classList.contains("a11y-dark");
  const gridCol = dark ? "rgba(255,255,255,.12)" : "rgba(17,24,39,.08)";
  const txtCol = dark ? "#cbd5e1" : "#6b7280";
  const color = cfg.color || "#16a34a";
  const vals = cfg.values;
  const n = vals.length;
  let vmin = cfg.min != null ? cfg.min : Math.min.apply(null, vals);
  let vmax = cfg.max != null ? cfg.max : Math.max.apply(null, vals);
  if (cfg.min == null) vmin = Math.max(0, Math.floor((vmin - 5) / 10) * 10);
  if (cfg.max == null) vmax = Math.ceil((vmax + 5) / 10) * 10;
  if (vmax <= vmin) vmax = vmin + 10;
  const P = { t: 12, r: 12, b: 26, l: 34 };
  const cw = w - P.l - P.r;
  const ch = h - P.t - P.b;
  const y = (v) => P.t + ch - ((v - vmin) / (vmax - vmin)) * ch;

  ctx.clearRect(0, 0, w, h);
  ctx.font = "10px system-ui, sans-serif";
  ctx.fillStyle = txtCol;
  ctx.strokeStyle = gridCol;
  ctx.lineWidth = 1;
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = vmin + ((vmax - vmin) / steps) * i;
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(P.l, yy);
    ctx.lineTo(w - P.r, yy);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(String(Math.round(v)), P.l - 6, yy + 3);
  }
  ctx.textAlign = "center";

  if (cfg.type === "bar") {
    const bw = Math.min(46, (cw / n) * 0.55);
    vals.forEach(function (v, i) {
      const cx = P.l + (cw / n) * (i + 0.5);
      const yy = y(v);
      const colors = Array.isArray(color) ? color[i % color.length] : color;
      ctx.fillStyle = colors;
      const bh = P.t + ch - yy;
      const r = Math.min(5, bw / 2, bh);
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2, P.t + ch);
      ctx.lineTo(cx - bw / 2, yy + r);
      ctx.arcTo(cx - bw / 2, yy, cx - bw / 2 + r, yy, r);
      ctx.lineTo(cx + bw / 2 - r, yy);
      ctx.arcTo(cx + bw / 2, yy, cx + bw / 2, yy + r, r);
      ctx.lineTo(cx + bw / 2, P.t + ch);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = txtCol;
      ctx.fillText(String(v), cx, yy - 5);
      ctx.fillText(cfg.labels[i] || "", cx, h - 8);
    });
  } else {
    // area fill
    ctx.beginPath();
    vals.forEach(function (v, i) {
      const cx = P.l + (cw / Math.max(1, n - 1)) * i;
      if (i === 0) ctx.moveTo(cx, y(v));
      else ctx.lineTo(cx, y(v));
    });
    ctx.lineTo(P.l + cw, P.t + ch);
    ctx.lineTo(P.l, P.t + ch);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, P.t, 0, P.t + ch);
    grad.addColorStop(0, color + "44");
    grad.addColorStop(1, color + "00");
    ctx.fillStyle = grad;
    ctx.fill();
    // garis
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    vals.forEach(function (v, i) {
      const cx = P.l + (cw / Math.max(1, n - 1)) * i;
      if (i === 0) ctx.moveTo(cx, y(v));
      else ctx.lineTo(cx, y(v));
    });
    ctx.stroke();
    // titik + label
    vals.forEach(function (v, i) {
      const cx = P.l + (cw / Math.max(1, n - 1)) * i;
      ctx.beginPath();
      ctx.arc(cx, y(v), 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = dark ? "#16213e" : "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = txtCol;
      ctx.fillText(String(v), cx, y(v) - 10);
      ctx.fillText(cfg.labels[i] || "", cx, h - 8);
    });
  }
};

// ═══ JADWAL SHOLAT + KALENDER HIJRIAH ═══
(function () {
  const strip = document.getElementById("prayerStrip");
  if (!strip) return;

  // Perhitungan astronomis standar (Yogyakarta, WIB). Sudut Kemenag: Subuh 20°, Isya 18°.
  function prayerTimes(date, lat, lng, tz) {
    const rad = Math.PI / 180;
    const D =
      Math.floor(
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
          Date.UTC(2000, 0, 1)) /
          86400000,
      ) + 0.5;
    const g = (357.529 + 0.98560028 * D) % 360;
    const q = (280.459 + 0.98564736 * D) % 360;
    const L = q + 1.915 * Math.sin(g * rad) + 0.02 * Math.sin(2 * g * rad);
    const e = 23.439 - 0.00000036 * D;
    const decl = Math.asin(Math.sin(e * rad) * Math.sin(L * rad)) / rad;
    let RA =
      Math.atan2(Math.cos(e * rad) * Math.sin(L * rad), Math.cos(L * rad)) /
      rad /
      15;
    RA = (RA + 24) % 24;
    const eqt = q / 15 - RA;
    const dhuhr = (12 + tz - lng / 15 - eqt + 24) % 24;
    function hourAngle(angle) {
      const cosHA =
        (-Math.sin(angle * rad) - Math.sin(decl * rad) * Math.sin(lat * rad)) /
        (Math.cos(decl * rad) * Math.cos(lat * rad));
      return Math.acos(Math.min(1, Math.max(-1, cosHA))) / rad / 15;
    }
    // Asr (Syafi'i): bayangan = 1 + tan|lat-decl|
    const asrAngle =
      -Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * rad))) / rad;
    return {
      Subuh: dhuhr - hourAngle(20),
      Dzuhur: dhuhr,
      Ashar: dhuhr + hourAngle(asrAngle),
      Maghrib: dhuhr + hourAngle(0.833),
      Isya: dhuhr + hourAngle(18),
    };
  }

  function fmt(h) {
    h = (h + 24) % 24;
    const m = Math.round(h * 60);
    return (
      String(Math.floor(m / 60)).padStart(2, "0") +
      ":" +
      String(m % 60).padStart(2, "0")
    );
  }

  const now = new Date();
  const times = prayerTimes(now, -7.8014, 110.3647, 7); // Yogyakarta WIB
  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
  } catch (e) {
    hijri = "";
  }

  // sholat berikutnya
  const nowH = now.getHours() + now.getMinutes() / 60;
  const order = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
  let next = order.find(function (n) {
    return (times[n] + 24) % 24 > nowH;
  });

  strip.innerHTML =
    '<div class="prayer-head"><span class="prayer-title">🕌 Jadwal Sholat</span>' +
    (hijri ? '<span class="prayer-hijri">📅 ' + hijri + "</span>" : "") +
    "</div>" +
    '<div class="prayer-times">' +
    order
      .map(function (n) {
        return (
          '<div class="prayer-item' +
          (n === next ? " next" : "") +
          '"><span class="p-name">' +
          n +
          '</span><span class="p-time">' +
          fmt(times[n]) +
          "</span></div>"
        );
      })
      .join("") +
    "</div>" +
    '<div class="prayer-note">Perkiraan wilayah Yogyakarta (WIB)' +
    (next ? " · Berikutnya: <strong>" + next + "</strong>" : "") +
    "</div>";
})();
