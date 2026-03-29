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

// Toggle task checkbox
function toggleTask(el, nameId) {
  const isDone = el.classList.contains("done");
  if (!isDone) {
    el.classList.add("done");
    el.textContent = "✓";
    el.setAttribute("aria-checked", "true");
    document.getElementById(nameId)?.classList.add("done-text");
    showToast("Tugas ditandai selesai ✓", "success");
  } else {
    el.classList.remove("done");
    el.textContent = "  ";
    el.setAttribute("aria-checked", "false");
    document.getElementById(nameId)?.classList.remove("done-text");
    showToast("Tugas ditandai belum selesai");
  }
}

// Keyboard support for checkboxes
document.querySelectorAll(".task-check").forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
});
