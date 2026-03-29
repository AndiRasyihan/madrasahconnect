function selMethod(el) {
  el.parentElement
    .querySelectorAll(".method-opt")
    .forEach((m) => m.classList.remove("sel"));
  el.classList.add("sel");
}
