// ═══════════════════════════════════════════
//  MadrasahConnect – Main JavaScript
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
    document.getElementById("btnHC")?.classList.toggle("active", a11yState.hc);
    document
      .getElementById("btnBig")
      ?.classList.toggle("active", a11yState.fontSize > 16);
    document
      .getElementById("btnDys")
      ?.classList.toggle("active", a11yState.dyslexia);

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
    toast.textContent = "✓ " + msg;
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
      };

      // Simulate loading
      if (btn) {
        btn.textContent = "Masuk...";
        btn.disabled = true;
      }
      setTimeout(() => {
        if (btn) {
          btn.textContent = "Masuk ke Portal";
          btn.disabled = false;
        }
        closeLogin();
        showToast("Selamat datang! Menuju dashboard...", "success");
        // Redirect ke halaman dashboard sesuai role
        setTimeout(() => {
          window.location.href =
            dashboardMap[activeRole] || "pages/dashboard.html";
        }, 1200);
      }, 1800);
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
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarEl = document.querySelector(".sidebar");
  if (sidebarToggle && sidebarEl) {
    sidebarToggle.addEventListener("click", () => {
      sidebarEl.classList.toggle("open");
    });
  }
  // Close sidebar on backdrop click (mobile)
  document.addEventListener("click", (e) => {
    if (
      sidebarEl &&
      sidebarEl.classList.contains("open") &&
      !sidebarEl.contains(e.target) &&
      e.target.id !== "sidebarToggle"
    ) {
      sidebarEl.classList.remove("open");
    }
  });

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

  // ── SEARCH BAR (inner pages) ──────────────
  document.querySelectorAll(".search-bar").forEach((bar) => {
    bar.style.cursor = "pointer";
    bar.addEventListener("click", () => {
      const q = prompt("Cari materi, tugas, atau informasi:");
      if (q && q.trim()) {
        showToast('Mencari: "' + q.trim() + '"...');
        // Search through visible text content on page
        setTimeout(() => {
          const body = document.querySelector(".main-area") || document.body;
          const text = body.innerText.toLowerCase();
          if (text.includes(q.trim().toLowerCase())) {
            showToast('Ditemukan hasil untuk "' + q.trim() + '"');
          } else {
            showToast('Tidak ditemukan hasil untuk "' + q.trim() + '"');
          }
        }, 500);
      }
    });
  });

  // ── NOTIF BUTTON ──────────────────────────
  document.querySelectorAll(".notif-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dot = btn.querySelector(".notif-dot");
      if (dot) dot.style.display = "none";
      mcModal(
        "🔔 Notifikasi",
        `
        <div style="display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;background:var(--green-50,#f0fdf4);border-radius:8px">
            <span>📊</span><div><strong style="font-size:13px">Nilai UH Matematika</strong><p style="font-size:12px;color:var(--gray-500,#6b7280);margin-top:2px">Nilai Ulangan Harian Matematika: 92/100</p><span style="font-size:10px;color:var(--gray-400,#9ca3af)">30 menit lalu</span></div>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:8px;border:1px solid var(--gray-100,#f3f4f6)">
            <span>💬</span><div><strong style="font-size:13px">Pesan Baru</strong><p style="font-size:12px;color:var(--gray-500,#6b7280);margin-top:2px">Bu Siti Rahma mengirim komentar pada tugas Anda</p><span style="font-size:10px;color:var(--gray-400,#9ca3af)">1 jam lalu</span></div>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:8px;border:1px solid var(--gray-100,#f3f4f6)">
            <span>📢</span><div><strong style="font-size:13px">Jadwal UTS Berubah</strong><p style="font-size:12px;color:var(--gray-500,#6b7280);margin-top:2px">Cek kalender terbaru untuk jadwal UTS yang diperbarui</p><span style="font-size:10px;color:var(--gray-400,#9ca3af)">3 jam lalu</span></div>
          </div>
        </div>
      `,
      );
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
