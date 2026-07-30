// ═══════════════════════════════════════════
//  MaConnect – Auth & Session
//  Login tervalidasi, sesi persisten, route
//  guard per peran, personalisasi sidebar.
// ═══════════════════════════════════════════
(function () {
  "use strict";

  const SESSION_KEY = "mc_session";

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId: user.id, role: user.role, at: Date.now() }),
    );
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function findUser(identifier, pass, role) {
    const users = MCDB.get("users", []);
    const id = (identifier || "").trim().toLowerCase();
    return (
      users.find(function (u) {
        const matchId =
          (u.email && u.email.toLowerCase() === id) ||
          (u.username && String(u.username).toLowerCase() === id);
        return u.role === role && matchId && u.pass === pass;
      }) || null
    );
  }

  function currentUser() {
    const s = getSession();
    if (!s) return null;
    const users = MCDB.get("users", []);
    return (
      users.find(function (u) {
        return u.id === s.userId;
      }) || null
    );
  }

  function updateCurrentUser(patch) {
    const s = getSession();
    if (!s) return false;
    const users = MCDB.get("users", []);
    const idx = users.findIndex(function (u) {
      return u.id === s.userId;
    });
    if (idx === -1) return false;
    Object.assign(users[idx], patch);
    MCDB.set("users", users);
    return true;
  }

  // ── ROUTE GUARD ───────────────────────────
  // Tentukan peran yang diminta halaman dari path-nya
  function pageRole() {
    const path = window.location.pathname;
    const file = path.split("/").pop() || "";
    if (!path.includes("/pages/")) return null; // landing page bebas
    if (file === "ppdb.html") return null; // PPDB publik
    if (file.startsWith("guru-") || file === "dashboard-guru.html")
      return "guru";
    if (file.startsWith("ortu-") || file === "dashboard-ortu.html")
      return "ortu";
    return "siswa";
  }

  function guard() {
    const need = pageRole();
    if (!need) return;
    const user = currentUser();
    if (!user) {
      window.location.replace("../index.html?login=1");
      return;
    }
    if (user.role !== need) {
      const home = {
        siswa: "dashboard.html",
        guru: "dashboard-guru.html",
        ortu: "dashboard-ortu.html",
      };
      window.location.replace(home[user.role] || "../index.html");
    }
  }

  // ── PERSONALISASI SIDEBAR & TOPBAR ────────
  function personalize() {
    const user = currentUser();
    if (!user) return;
    document.querySelectorAll(".sidebar-uname").forEach(function (el) {
      el.textContent = user.name;
    });
    document.querySelectorAll(".sidebar-urole").forEach(function (el) {
      el.textContent = user.info || "";
    });
    document.querySelectorAll(".sidebar-av").forEach(function (el) {
      el.textContent = user.initials || user.name.slice(0, 2).toUpperCase();
    });
    document
      .querySelectorAll(".topbar-avatar, .avatar-btn")
      .forEach(function (el) {
        if (el.textContent.trim().length <= 3)
          el.textContent = user.initials || "";
      });
  }

  // ── LOGOUT ────────────────────────────────
  function wireLogout() {
    document
      .querySelectorAll('.sidebar-footer a, a[data-action="logout"]')
      .forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          clearSession();
          if (typeof showToast === "function")
            showToast("Anda telah keluar dari portal");
          setTimeout(function () {
            window.location.href = a.getAttribute("href") || "../index.html";
          }, 500);
        });
      });
  }

  // ── PUBLIC API ────────────────────────────
  window.MCAuth = {
    login: function (identifier, pass, role) {
      const user = findUser(identifier, pass, role);
      if (!user) return null;
      setSession(user);
      return user;
    },
    logout: function () {
      clearSession();
    },
    currentUser: currentUser,
    updateCurrentUser: updateCurrentUser,
    getSession: getSession,
  };

  // Jalankan guard secepat mungkin (sebelum render penuh)
  guard();

  document.addEventListener("DOMContentLoaded", function () {
    personalize();
    wireLogout();
  });
})();
