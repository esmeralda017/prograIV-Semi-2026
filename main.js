// ══════════════════════════════════════════════
//  main.js
//  db_usss017124_OLimpiarivas — Parcial_I
// ══════════════════════════════════════════════

// ── TOAST ──────────────────────────────────────
let _tt;
function toast(msg, err) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = err ? 'show err' : 'show';
  clearTimeout(_tt);
  _tt = setTimeout(function(){ el.className = ''; }, 3400);
}

// ── NAVEGACIÓN ─────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  document.getElementById('nav-' + page).classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
  if (page === 'autores') buscarAutores();
  if (page === 'libros')  buscarLibros();
}

// ── CERRAR MODAL AL HACER CLIC EN EL FONDO ─────
document.addEventListener('click', function(e) {
  ['overlayAutor','overlayLibro','overlayConfirm'].forEach(function(id) {
    const el = document.getElementById(id);
    if (e.target === el) el.classList.remove('abierto');
  });
});

// ── CERRAR CON ESC ─────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    ['overlayAutor','overlayLibro','overlayConfirm'].forEach(function(id){
      document.getElementById(id).classList.remove('abierto');
    });
  }
});

// ── INIT ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  buscarAutores();
  buscarLibros();
});