// Countdown timer
function updateCountdown() {
  const deadline = new Date('2026-04-15T23:59:59');
  const now = new Date();
  const diff = deadline - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Jenjang selection
function selectJenjang(el, name) {
  document.querySelectorAll('.jenjang-card').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
  el.classList.add('selected');
  el.setAttribute('aria-checked','true');
  showToast('Jenjang dipilih: ' + name);
}
document.querySelectorAll('.jenjang-card').forEach(card => {
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
});

// PPDB Form submit
document.getElementById('ppdbFormEl').addEventListener('submit', e => {
  e.preventDefault();
  const nama = document.getElementById('namaLengkap').value.trim();
  const hp = document.getElementById('noHp').value.trim();
  const email = document.getElementById('emailOrtu').value.trim();
  if (!nama || !hp || !email) { showToast('Mohon isi semua kolom wajib (*)', 'error'); return; }

  const btn = document.getElementById('ppdbSubmitBtn');
  btn.textContent = 'Mengirim...'; btn.disabled = true;

  setTimeout(() => {
    const ref = 'PPDB-2026-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('refNumber').textContent = 'No. Referensi: ' + ref;
    document.getElementById('ppdbForm').style.display = 'none';
    document.getElementById('successBanner').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Pendaftaran berhasil! Ref: ' + ref, 'success');
  }, 2000);
});
